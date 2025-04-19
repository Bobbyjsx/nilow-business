'use client';
import { useServiceTypes } from '@/app/api/services';
import type { Service } from '@/components/modules/calendar/types';
import { hoursOptions, minutesOptions } from '@/components/modules/onboarding/services/constants';
import { priceTypeOptions } from '@/components/modules/onboarding/travel-fee/constants';
import ColorSelector from '@/components/ui/color-select';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { ImageUpload } from '@/components/ui/image-upload';
import { Select } from '@/components/ui/select';
import { TextArea } from '@/components/ui/textarea';
import { Controller, useFormContext } from 'react-hook-form';
import { serviceTargets } from './constants';

export const ServicesForm = () => {
  const { data: serviceTypes, isLoading: serviceTypesLoading } = useServiceTypes();

  const {
    formState: { errors },
    control,
  } = useFormContext<Service>();

  return (
    <div className='space-y-4'>
      <div className='flex w-full gap-x-3'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Service Name'
              placeholder='e.g. Haircut'
              className='w-full'
              error={errors.name?.message}
              isRequired
              {...field}
            />
          )}
        />
        <div className='flex-1'>
          <Controller
            name='color'
            control={control}
            render={({ field }) => (
              <ColorSelector
                label='Color'
                defaultColor={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className='flex w-full gap-x-3'>
        <div className='flex-1'>
          <Controller
            name='target'
            control={control}
            render={({ field }) => (
              <Select
                label='Service Target'
                options={serviceTargets}
                placeholder={'Select a Service Target'}
                className='w-full min-w-64'
                triggerClassName='!h-12'
                error={errors.serviceType?.message}
                fallbackOption={{ value: 'unassigned', label: 'Unassigned' }}
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name='serviceType'
          control={control}
          render={({ field }) => (
            //@ts-expect-error
            <Select
              variant='searchable'
              options={serviceTypes?.map((type) => ({ value: type._id, label: type.name })) || []}
              label='Service Type'
              placeholder={serviceTypesLoading ? 'Loading...' : 'Select Service Type'}
              className='w-full'
              triggerClassName='!h-12'
              error={errors.serviceType?.message}
              fallbackOption={{ value: 'unassigned', label: 'Unassigned' }}
              {...field}
            />
          )}
        />
      </div>

      <Controller
        name='photos'
        control={control}
        render={({ field }) => (
          <ImageUpload
            label='Service Photos'
            value={field.value || []}
            onChange={field.onChange}
            error={errors.photos?.message}
            maxImages={3}
          />
        )}
      />

      <Controller
        name='description'
        control={control}
        render={({ field }) => (
          <TextArea
            id='description'
            placeholder='Describe the service...'
            label='Description'
            className='min-h-[120px] w-full'
            error={errors.description?.message}
            {...field}
          />
        )}
      />

      <div className='flex gap-4'>
        <Controller
          name='hours'
          control={control}
          render={({ field }) => (
            <Select
              options={hoursOptions}
              label='Hours'
              placeholder='Hours'
              className='w-full'
              error={errors.hours?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='minutes'
          control={control}
          render={({ field }) => (
            <Select
              options={minutesOptions}
              label='Minutes'
              placeholder='Minutes'
              className='w-full'
              error={errors.minutes?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <Controller
          name='priceType'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={priceTypeOptions}
              label='Price Type'
              className='w-full'
              error={errors.priceType?.message}
            />
          )}
        />

        <Controller
          name='price'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Price'
              placeholder='e.g. 25.00'
              leftNode={<p className='px-3'>$</p>}
              error={errors.price?.message}
              isRequired
              size='xs'
              className='w-full'
              type='number'
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
};
