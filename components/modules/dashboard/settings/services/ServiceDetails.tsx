'use client';
import { FadeIn } from '@/components/common/fade-in';
import type { Service } from '@/components/modules/calendar/types';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { dummyServices } from './constants';
import { ServicesForm } from './ServicesForm';

export const ServiceDetails = () => {
  const { serviceId } = useParams();
  const service = useMemo(() => {
    const filteredService = dummyServices.find((service) => service.id === serviceId);
    return filteredService;
  }, [serviceId]);

  const formMethods = useForm<Service>({
    values: service,
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = formMethods;

  const onSubmit = (data: Service) => {
    console.log(data);
  };

  const onCancel = () => {
    console.log('canceled');
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
          <h1 className='text-xl font-semibold'>Edit Service</h1>
        </div>

        <Button
          type='button'
          className='bg-red-200 text-red-500 hover:bg-red-300 hover:text-red-600'
          onClick={() => console.log('delete')}
        >
          <Trash2 />
        </Button>
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
