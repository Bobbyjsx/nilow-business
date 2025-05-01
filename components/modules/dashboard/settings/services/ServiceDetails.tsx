'use client';
import { useUploadImage } from '@/app/api/images';
import { CreateBusinessService, useGetSingleBusinessService, useUpdateBusinessService } from '@/app/api/services';
import { FadeIn } from '@/components/common/fade-in';
import type { Service } from '@/components/modules/calendar/types';
import { PriceType } from '@/components/modules/onboarding/travel-fee/constants';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { toast } from '@/components/ui/toast';
import { getServerError } from '@/lib/https';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ServicesForm } from './ServicesForm';

export const ServiceDetails = () => {
  const { serviceId } = useParams();
  const { data: service, isLoading: isServicesLoading } = useGetSingleBusinessService(serviceId as string);

  const formMethods = useForm<Service>();
  const { setValue, reset } = formMethods;

  const serviceImages = useMemo(() => {
    if (!service || !service.service_images) return [];

    if (Array.isArray(service?.service_images)) {
      console.log('service_images multiple', service?.service_images);
      return service?.service_images?.map((image) => image?.image);
    }

    return [service.service_images]?.map((image) => (image as any)?.image);
  }, [service]);

  console.log('service', serviceImages);

  useEffect(() => {
    if (service) {
      setValue('hours', service.duration_hour || '00');
      setValue('minutes', service.duration_minutes || '00');
      setValue('name', service.name || '');
      setValue('description', service.description || '');
      setValue('price', service.cost || 0);
      setValue('priceType', service.cost_type || PriceType.FIXED);
      setValue('serviceType', service.service_type);
      setValue('startsAt', service.cost_type === 'PROGRESSIVE');
      setValue('color', service.service_color || '#000000');
      setValue('serviceCategory', service.service_category);
      setValue('photos', serviceImages);
      setValue('target', service.service_target || '');
    }
  }, [service, setValue, serviceImages]);

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = formMethods;

  const { updateBusinessService } = useUpdateBusinessService();
  const { executeImageUpload } = useUploadImage();

  const onSubmit = async (data: Service) => {
    try {
      const payload: CreateBusinessService = {
        name: data.name,
        description: data.description as string,
        service_type: data.serviceType as any,
        cost: Number(data.price),
        cost_type: data.priceType,
        service_category: data.serviceCategory as any,
        service_color: data.color as string,
        service_images: data?.photos || [],
        service_target: data?.target,
        duration_hour: String(data.hours),
        duration_minutes: String(data.minutes),
      };

      if (data.photos) {
        const hasNewUploads = data?.photos.some((photo) => typeof photo !== 'string');

        if (hasNewUploads) {
          const newFiles = data.photos.filter((photo) => typeof photo !== 'string') as {
            file: File;
          }[];

          await executeImageUpload(
            newFiles.map((photo) => photo.file),
            {
              onSuccess: (urls) => {
                payload.service_images = [
                  ...(data?.photos || [])?.filter((photo) => typeof photo === 'string'),
                  ...urls?.data?.map((url) => url?._id),
                ];
              },
              onError: (error) => {
                const errMsg = getServerError(error);
                toast.error({ message: errMsg });
                console.error('Error uploading images:', error);
                return;
              },
            },
          );
        }
      }

      await updateBusinessService(
        { id: serviceId as string, serviceType: payload },
        {
          onSuccess: () => {
            toast.success({ message: 'Service updated successfully' });
            router.push('/dashboard/settings/business-services');
          },
          onError: (error) => {
            const errMsg = getServerError(error);
            toast.error({ message: errMsg });
          },
        },
      );
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const onCancel = () => {
    reset();
  };
  const router = useRouter();

  const goBack = () => {
    router.push('/dashboard/settings/business-services');
    reset();
  };

  const isLoading = isSubmitting || isServicesLoading;

  if (isServicesLoading) {
    return (
      <div className='h-full min-h-screen flex justify-center items-center'>
        <Loader text='Loading...' />
      </div>
    );
  }
  if (!service) {
    return (
      <div className='h-full min-h-screen flex flex-col justify-center items-center'>
        <p className='mb-4'>Service not found</p>
        <Button
          type='button'
          variant='ghost'
          onClick={goBack}
          leftNode={<ArrowLeft className='h-5 w-5' />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <FadeIn className='max-w-7xl mx-auto py-8 space-y-10 px-5'>
      <div className='flex items-center justify-between gap-x-3'>
        <div className='flex items-center gap-x-3'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={goBack}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-xl font-semibold'>Edit Service</h1>
        </div>

        {/* <Button
          type='button'
          className='bg-red-200 text-red-500 hover:bg-red-300 hover:text-red-600'
          onClick={() => console.log('delete')}
        >
          <Trash2 />
        </Button> */}
      </div>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <ServicesForm />
          <div className='flex justify-end gap-x-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              isLoading={isLoading}
            >
              Update Service
            </Button>
          </div>
        </form>
      </FormProvider>
    </FadeIn>
  );
};
