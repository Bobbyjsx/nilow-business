'use client';

import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { CustomSelect } from '@/components/ui/select';
import { TextArea } from '@/components/ui/textarea';
import { loadGoogleMaps } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MapView } from '../../address/MapView';
import { PriceType, priceTypeOptions, TravelFeeFormValues, TravelFeeSchema } from './constants';

export const TravelFeeForm = ({ onNextPage }: { onNextPage: () => void }) => {
  const [location, setLocation] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    const loadMaps = async () => {
      try {
        await loadGoogleMaps({ onload: setLocation });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };
    loadMaps();
  }, []);

  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<TravelFeeFormValues>({
    resolver: zodResolver(TravelFeeSchema),
    defaultValues: {
      priceType: PriceType.FREE,
      maximumTravelDistance: '25',
    },
  });

  const maxTravelDistanceOptions = Array.from({ length: 10 }, (_, i) => {
    const value = String((i + 1) * 5);
    return { label: `${value} miles`, value };
  });

  const formValues = watch();

  const maxTravelDistance = formValues.maximumTravelDistance;
  console.log(errors);
  const onSubmit: SubmitHandler<TravelFeeFormValues> = (data) => {
    console.log(data);
    onNextPage();
  };

  const isPriceFeeDisabled = () => {
    return formValues.priceType === PriceType.FREE || formValues.priceType === PriceType.VARIES;
  };

  return (
    <div className='flex flex-col justify-between items-center w-full h-full min-h-[60vh]'>
      <section className='w-full flex flex-col justify-between items-center gap-y-8'>
        <h1 className='text-2xl font-bold text-custom-black-700'>What's your travel fee?</h1>
        <p className='text-custom-black-300 text-sm mb-7'>Add your minimum travel fee</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-full space-y-6'
        >
          <section className='flex w-full gap-x-10'>
            <Controller
              name='priceType'
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  options={priceTypeOptions}
                  label='Price Type'
                  className='w-full'
                  error={errors.priceType?.message}
                />
              )}
            />

            <Controller
              name='travelFee'
              control={control}
              render={({ field }) => (
                <FloatingLabelInput
                  {...field}
                  type='number'
                  label='Travel Fee'
                  placeholder='Enter amount'
                  disabled={isPriceFeeDisabled()}
                  className='w-full !h-12'
                  error={errors.travelFee?.message}
                  leftNode={<span className='text-custom-black-300 text-sm border-r px-2'>$</span>}
                />
              )}
            />
          </section>

          <section className='flex w-full'>
            <Controller
              name='maximumTravelDistance'
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  options={maxTravelDistanceOptions}
                  label='Maximum Travel Distance'
                  className='w-full'
                  error={errors.maximumTravelDistance?.message}
                />
              )}
            />
          </section>

          <MapView
            location={location}
            radiusMiles={Number(maxTravelDistance ?? '5')}
            controls={{
              fullscreenControl: false,
              scaleControl: false,
              streetViewControl: false,
              zoomControl: false,
              mapTypeControl: false,
            }}
          />

          <Controller
            name='travelPolicy'
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder='Travel & fee policy (optional) '
                className='w-full !h-32'
                error={errors.travelPolicy?.message}
              />
            )}
          />

          <Button
            type='submit'
            className='w-full'
          >
            Continue
          </Button>
        </form>
      </section>
    </div>
  );
};
