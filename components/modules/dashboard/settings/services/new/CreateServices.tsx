'use client';
import { useUploadImage } from '@/app/api/images';
import { CreateBusinessService, useCreateBusinessService } from '@/app/api/services';
import { FadeIn } from '@/components/common/fade-in';
import type { Service } from '@/components/modules/calendar/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { getServerError } from '@/lib/https';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ServicesForm } from '../ServicesForm';

export const CreateServices = () => {
  const { createBusinessService, isPending } = useCreateBusinessService();
  const formMethods = useForm<Service>();

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = formMethods;

  const { executeImageUpload } = useUploadImage();
  const onSubmit = async (data: Service) => {
    try {
      const payload: CreateBusinessService = {
        // ...data,
        name: data.name,
        description: data.description as string,
        service_type: data.serviceType as any,
        cost: Number(data.price),
        cost_type: data.priceType,
        service_category: data.serviceCategory as any,
        service_color: data.color as string,
        service_images: [],
        service_target: data?.target,
        duration_hour: String(data.hours ?? '00'),
        duration_minutes: String(data.minutes ?? '00'),
      };

      if (data?.photos && data.photos.length > 0) {
        await executeImageUpload(
          data.photos?.map((photo) => (photo as unknown as { file: File }).file),
          {
            onSuccess: (urls) => {
              payload.service_images = urls?.data?.map((url) => url?._id);
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

      await createBusinessService(payload, {
        onSuccess: () => {
          reset();
          toast.success({ message: 'Service created successfully' });
          router.push('/dashboard/settings/business-services');
        },
        onError: (error) => {
          const errMsg = getServerError(error);
          toast.error({ message: errMsg });
        },
      });
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const onCancel = () => {
    reset();
    router.push('/dashboard/settings/business-services');
  };

  const router = useRouter();

  const goBack = () => {
    router.push('/dashboard/settings/business-services');
  };

  const isLoading = isSubmitting;

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
          <h1 className='text-xl font-semibold'>Create New Service</h1>
        </div>
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
              Create Service
            </Button>
          </div>
        </form>
      </FormProvider>
    </FadeIn>
  );
};
