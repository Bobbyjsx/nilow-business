'use client';

import type { Appointment, AppointmentCreate } from '@/app/api/appointments';
import { APPOINTMENT_STATUS_ENUM, useCreateAppointment, useUpdateAppointment } from '@/app/api/appointments';
import { useActiveBusiness } from '@/app/api/me';
import { fetchBusinessServicesInfiniteQuery } from '@/app/api/services';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TextArea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/constants';
import { getServerError } from '@/lib/https';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Pencil, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { convertHHMMToDate } from './constants';
import { Customer, MOCK_CUSTOMERS } from './customer-data';
import type { Service } from './types';

// Appointment form schema definition
const appointmentFormSchema = z.object({
  startDate: z.date(),
  startTime: z.string(),
  description: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  services: z.array(z.any()).min(1, 'At least one service is required'),
  isHomeService: z.boolean().default(false),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

// Default appointment values
const DEFAULT_APPOINTMENT_VALUES: AppointmentFormData = {
  startDate: new Date(),
  startTime: format(new Date(), 'HH:mm'),
  customerId: '',
  services: [],
  isHomeService: false,
  paymentMethod: 'checkout',
};

interface AppointmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  timeSlot?: { start: Date; end: Date } | null;
  services?: Service[]; // Optional prop to pass services
  customers?: Customer[]; // Optional prop to pass customers
  mode: 'create' | 'edit';
}

export function AppointmentFormModal({
  open,
  onOpenChange,
  appointment,
  timeSlot,
  customers = MOCK_CUSTOMERS, // Default to mock customers if not provided
  mode,
}: AppointmentFormModalProps) {
  const isEditing = mode === 'edit';
  const { createAppointment, isPending } = useCreateAppointment();
  const { executeUpdateAppointment, isPending: isUpdating } = useUpdateAppointment();
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchNextPage, services, hasNextPage, isLoading, refetch } = fetchBusinessServicesInfiniteQuery(1, 10, searchQuery);
  const { activeBusiness } = useActiveBusiness();

  const loadOptions = useCallback(async (inputValue?: string) => setSearchQuery(inputValue || ''), [refetch]);

  // Convert services to options for the multi-select
  const serviceOptions = useMemo(() => {
    return services.map((service) => ({
      value: service._id || '',
      label: service.name,
      description: `${service.duration} - ${formatPrice(service.cost)}`,
    }));
  }, [services]);

  // Convert customers to options for the searchable select
  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
      description: customer.phone,
    }));
  }, [customers]);

  // Initialize form with default values
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getInitialFormValues(appointment, timeSlot),
  });

  // Reset form values when dialog opens or appointment/timeSlot changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialFormValues(appointment, timeSlot));
    }
  }, [form, appointment, timeSlot, open]);

  // Generate time options (memoized)
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push({
          label: timeValue,
          value: timeValue,
        });
      }
    }
    return options;
  }, []);

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      // Parse time from HH:mm string
      const [hours, minutes] = data.startTime.split(':').map(Number);

      // Merge startDate and startTime
      const mergedDate = new Date(data.startDate);
      mergedDate.setHours(hours);
      mergedDate.setMinutes(minutes);

      const payload: AppointmentCreate = {
        customerId: data.customerId,
        isHomeService: data.isHomeService,
        additionalNotes: data.description || '',
        startTime: data.startTime,
        appointmentDate: mergedDate,
        payment_method: data.paymentMethod,
        servicesIds: data.services,
        businessId: activeBusiness?.business?._id || '',
      };

      if (isEditing && appointment) {
        await executeUpdateAppointment(
          { id: appointment._id, appointment: payload },
          {
            onSuccess: () => {
              toast.success({ message: 'Appointment updated successfully' });
              onOpenChange(false);
            },
            onError: (error) => {
              const errMsg = getServerError(error);
              toast.error({ message: errMsg });
            },
          },
        );
      } else {
        await createAppointment(payload, {
          onSuccess: () => {
            toast.success({ message: 'Appointment created successfully' });
            onOpenChange(false);
          },
          onError: (error) => {
            const errMsg = getServerError(error);
            toast.error({ message: errMsg });
          },
        });
      }
    } catch (error) {
      console.error('Error handling appointment submission:', error);
      toast.error({ message: 'Something went wrong. Please try again.' });
    }
  };

  const updateDatesWithSameTime = (selectedDate: Date) => {
    const time = form.getValues('startTime');
    form.setValue('startDate', selectedDate);
  };

  // Check if appointment can be edited (based on status)
  const canEditAppointment = () => {
    if (!isEditing) return true;
    return appointment?.status !== APPOINTMENT_STATUS_ENUM.COMPLETED && appointment?.status !== APPOINTMENT_STATUS_ENUM.CANCELED;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (canEditAppointment()) {
          onOpenChange(isOpen);
        } else if (!isOpen) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {isEditing ? (
              <>
                <Pencil className='h-5 w-5' />
                Edit Appointment
              </>
            ) : (
              <>
                <Plus className='h-5 w-5' />
                New Appointment
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? canEditAppointment()
                ? 'Make changes to this appointment.'
                : 'This appointment cannot be edited because it is completed or cancelled.'
              : 'Create a new appointment by filling out the details below.'}
          </DialogDescription>
        </DialogHeader>

        {canEditAppointment() ? (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='customerId'
                render={({ field }) => (
                  <Select
                    variant='searchable'
                    label='Customer'
                    options={customerOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Search for a customer...'
                    searchPlaceholder='Search by name or phone...'
                    emptyMessage='No customers found'
                    error={form.formState.errors.customerId?.message}
                    triggerClassName='!h-11'
                  />
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='services'
                render={({ field }) => (
                  <Select
                    variant='multi'
                    label='Services'
                    options={serviceOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='Select services'
                    triggerClassName='!min-h-11'
                    error={form.formState.errors.services?.message}
                    loadOptions={(input) => loadOptions(input)}
                    onMenuScrollToBottom={() => {
                      if (!isLoading && hasNextPage) {
                        fetchNextPage();
                      }
                    }}
                    isLoading={isLoading}
                  />
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='paymentMethod'
                render={({ field }) => (
                  <Select
                    label='Payment Method'
                    options={[
                      { value: 'card', label: 'Card' },
                      { value: 'checkout', label: 'Checkout' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Select payment method'
                    triggerClassName='!h-11'
                    error={form.formState.errors.paymentMethod?.message}
                  />
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='isHomeService'
                render={({ field }) => (
                  <div className='flex flex-row items-center justify-between rounded-lg border py-1 pb-2 px-3 shadow-sm'>
                    <div className='space-y-0.5'>
                      <label
                        htmlFor='homeService'
                        className='text-gray-500 text-sm font-medium'
                      >
                        Home service
                      </label>
                      <div className='text-xs text-gray-500'>If checked, the appointment will be scheduled for the customer's location.</div>
                    </div>
                    <Switch
                      id='homeService'
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>

            <div className='space-y-1 w-full'>
              <label
                htmlFor='startDate'
                className='text-sm'
              >
                Date
              </label>
              <Controller
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <div className='flex flex-col'>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className='w-full'
                      >
                        <Button
                          size='lg'
                          variant='outline'
                          className={cn('pl-3 text-left font-normal flex justify-start items-center', !field.value && 'text-muted-foreground')}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-full p-0 bg-white'
                        align='start'
                      >
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              updateDatesWithSameTime(date);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.startDate && <p className='text-sm font-medium text-red-500'>{form.formState.errors.startDate.message}</p>}
                  </div>
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <div>
                    <Select
                      label='Start Time'
                      options={timeOptions}
                      value={field.value}
                      className='!h-11'
                      onChange={field.onChange}
                      error={form.formState.errors.startTime?.message}
                    />
                  </div>
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='description'
                render={({ field }) => (
                  <TextArea
                    label='Notes'
                    className='!h-20'
                    {...field}
                  />
                )}
              />
            </div>

            <div className='mt-4 p-3 bg-gray-50 rounded-md border border-gray-200'>
              <div className='flex justify-between items-center'>
                <span className='font-medium text-gray-700'>Total Price:</span>
                <span className='font-bold text-lg'>${appointment?.appointment_fee.toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter className='gap-2 sm:gap-0 flex flex-col'>
              <div className='flex gap-x-3 w-full'>
                {isEditing ? (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => onOpenChange(false)}
                    className='w-1/2'
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onOpenChange(false)}
                    className='w-1/2'
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type='submit'
                  className='w-1/2'
                  disabled={isPending || isUpdating}
                  isLoading={isPending || isUpdating}
                >
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <div className='p-4 bg-muted/50 rounded-lg text-center'>
            <p className='text-muted-foreground'>
              {appointment?.status === APPOINTMENT_STATUS_ENUM.COMPLETED
                ? 'This appointment has been completed and cannot be modified.'
                : 'This appointment has been cancelled and cannot be modified.'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get initial form values (appointment object is used only for defaults)
function getInitialFormValues(appointment: Appointment | null, timeSlot?: { start: Date; end: Date } | null): AppointmentFormData {
  const parseDate = (value: unknown): Date => {
    if (value instanceof Date) return value;
    return new Date(value as string);
  };

  if (appointment) {
    const startTime = convertHHMMToDate(appointment.start_time);
    return {
      startDate: startTime,
      startTime: format(startTime, 'HH:mm'),
      isHomeService: appointment.isHomeService || false,
      description: appointment.additional_notes || '',
      customerId: appointment.customer,
      services: [],
      paymentMethod: appointment.payment_method || 'checkout',
    };
  } else if (timeSlot) {
    const startTime = parseDate(timeSlot.start);
    return {
      startDate: startTime,
      startTime: format(startTime, 'HH:mm'),
      isHomeService: false,
      description: '',
      customerId: '',
      services: [],
      paymentMethod: 'checkout',
    };
  }

  const now = new Date();
  return {
    startDate: now,
    startTime: format(now, 'HH:mm'),
    isHomeService: false,
    description: '',
    customerId: '',
    services: [],
    paymentMethod: 'checkout',
  };
}
