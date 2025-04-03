'use client';
import { FadeIn } from '@/components/common/fade-in';
import type { Service } from '@/components/modules/calendar/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ServicesForm } from '../ServicesForm';

export const CreateServices = () => {
  const formMethods = useForm<Service>();

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = formMethods;

  const onSubmit = (data: Service) => {
    console.log('Creating new service:', data);
    reset();
    router.push('/dashboard/settings/business-services');
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
