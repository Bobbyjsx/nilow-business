import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Service, ServicesFormValues, formatDuration, formatPrice, servicesFormSchema } from './constants';
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

  const handleSubmitService: SubmitHandler<ServicesFormValues> = (data) => {
    console.log('Form submitted with data:', data);
    onSubmitForm?.();
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
          hours: '1',
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
