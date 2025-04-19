import { BusinessServiceDetails, useUpdateBusiness } from '@/app/api/business';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/constants';
import { getServerError } from '@/lib/https';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { PriceType } from '../travel-fee/constants';
import { Service, ServicesFormValues, formatDuration, servicesFormSchema } from './constants';
import { ServicesModal } from './ServicesModal';

type ServicesProps = {
  onSubmitForm: () => void;
};

export const Services = ({ onSubmitForm }: ServicesProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      services: [],
    },
  });

  const [activeService, setActiveService] = useState<Service | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'services',
  });

  const { executeUpdateBusiness, isBusinessUpdateExecuting } = useUpdateBusiness();

  const handleSubmitService: SubmitHandler<ServicesFormValues> = (data) => {
    try {
      const constructedServicePayload = data?.services?.map(
        (service): Partial<BusinessServiceDetails> => ({
          name: service.name,
          service_type: service.serviceType,
          duration_hour: String(service.hours).padStart(2, '0'),
          duration_minutes: String(service.minutes),
          cost: Number(service.price),
          cost_type: service.startsAt ? PriceType.STARTS_AT : PriceType.FIXED,
          service_target: 'everyone',
        }),
      );
      executeUpdateBusiness(
        { services: constructedServicePayload },
        {
          onSuccess: () => {
            onSubmitForm();
            console.log('Form submitted with data:', data);
          },
          onError: (error) => {
            const errMsg = getServerError(error);
            toast.error({ message: errMsg });
            console.error(error);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveService = (service: Service, index?: number) => {
    if (index !== undefined) {
      // Edit existing service
      update(index, service);
    } else {
      // Add new service
      append(service);
    }
  };

  const handleRemoveService = (index: number) => {
    remove(index);
  };

  const openServiceModal = (service?: Service, index?: number) => {
    setActiveService(
      service ||
        ({
          name: '',
          serviceType: '',
          hours: '00',
          minutes: '00',
          price: '',
          startsAt: false,
        } as Service),
    );
    setEditingIndex(index);
    setServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setServiceModalOpen(false);
    setActiveService(null);
    setEditingIndex(undefined);
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit(handleSubmitService)}
        className='flex flex-col gap-y-8 w-full'
      >
        <section>
          <h1 className='text-2xl font-bold text-custom-black-700'>Add your services</h1>
          <p className='text-custom-black-300 text-sm mb-7'>Add services you offer, this can be edited later on.</p>
        </section>

        <section className='flex justify-start gap-y-6 flex-col'>
          {fields.length === 0 ? (
            <p className='text-custom-black-300 text-sm italic'>No services added yet. Click "Add Service" below to get started.</p>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className='w-full flex justify-between items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-center gap-x-3'>
                  <Button
                    variant='ghost'
                    onClick={() => handleRemoveService(index)}
                    type='button'
                    aria-label='Remove service'
                  >
                    <Trash2 className='size-6 text-gray-500 hover:text-red-500' />
                  </Button>
                  <div className='flex flex-col items-start'>
                    <p className='font-medium'>{field.name}</p>
                    <p className='text-custom-black-300 text-xs'>{formatDuration(field.hours, field.minutes)}</p>
                  </div>
                </div>

                <div
                  className='flex items-center gap-x-3 cursor-pointer'
                  onClick={() => openServiceModal(field, index)}
                >
                  <p className='font-semibold'>{formatPrice(field.price)}</p>
                  <ChevronRight className='text-gray-400' />
                </div>
              </div>
            ))
          )}
        </section>

        <section className='flex justify-start'>
          <Button
            variant='ghost'
            onClick={() => openServiceModal()}
            type='button'
            className='flex items-center gap-x-2 text-primary'
          >
            <Plus className='size-5' /> Add Service
          </Button>
        </section>

        <section>
          <Button
            type='submit'
            className='w-full'
            disabled={isSubmitting || fields.length === 0}
            isLoading={isSubmitting || isBusinessUpdateExecuting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </section>
      </form>

      <ServicesModal
        isOpen={serviceModalOpen}
        onClose={closeServiceModal}
        activeService={activeService}
        onSave={handleSaveService}
        serviceIndex={editingIndex}
      />
    </main>
  );
};
