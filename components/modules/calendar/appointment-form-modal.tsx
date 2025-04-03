'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/select/searchable-select';
import { TextArea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { addMinutes, format, setHours, setMinutes } from 'date-fns';
import { CalendarIcon, Pencil, Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { dummyServices } from '../dashboard/settings/services/constants';
import { formatTo12Hour } from '../onboarding/business-hours/constant';
import { formatDuration, formatPrice } from '../onboarding/services/constants';
import { AppointmentEvent } from './appointment-drawer';
import { Customer, MOCK_CUSTOMERS } from './customer-data';
import type { Service } from './types';

// Appointment form schema definition
const appointmentFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start: z.date(),
  end: z.date(),
  color: z.string().default('#d1d5f0'),
  textColor: z.string().default('#000000'),
  location: z.string().optional(),
  description: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  services: z.array(z.string()).min(1, 'At least one service is required'),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

// Default appointment values
const DEFAULT_APPOINTMENT_VALUES: AppointmentFormData = {
  title: '',
  start: new Date(),
  end: new Date(),
  color: '#d1d5f0',
  textColor: '#000000',
  location: '',
  description: '',
  customerId: '',
  services: [],
};

interface AppointmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentEvent | null;
  timeSlot?: { start: Date; end: Date } | null;
  onSave: (appointment: AppointmentEvent) => void;
  onDelete?: (appointmentId: string) => void;
  services?: Service[]; // Optional prop to pass services
  customers?: Customer[]; // Optional prop to pass customers
  mode: 'create' | 'edit';
}

export function AppointmentFormModal({
  open,
  onOpenChange,
  appointment,
  timeSlot,
  onSave,
  onDelete,
  services = dummyServices, // Default to mock services if not provided
  customers = MOCK_CUSTOMERS, // Default to mock customers if not provided
  mode,
}: AppointmentFormModalProps) {
  const isEditing = mode === 'edit';

  // Convert services to options for the multi-select
  const serviceOptions = useMemo(() => {
    return services.map((service) => ({
      value: service.id,
      label: service.name,
      description: `${formatDuration(service.hours, service.minutes)} - ${formatPrice(service.price)}`,
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

  // Watch for changes to key fields
  const selectedServices = useWatch({
    control: form.control,
    name: 'services',
    defaultValue: [],
  });

  // const selectedCustomerId = useWatch({
  //   control: form.control,
  //   name: 'customerId',
  //   defaultValue: '',
  // });

  // Reset form values when dialog opens or appointment/timeSlot changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialFormValues(appointment, timeSlot));
    }
  }, [form, appointment, timeSlot, open]);

  useEffect(() => {
    if (!selectedServices || selectedServices.length === 0) return;

    // Calculate total duration
    let totalDuration = 0;

    selectedServices.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        // Add duration
        const hours = parseInt(service.hours) || 0;
        const minutes = parseInt(service.minutes) || 0;
        totalDuration += hours * 60 + minutes;
      }
    });

    // Update end time based on start time + total duration
    if (totalDuration > 0) {
      const startTime = form.getValues('start');
      const newEndTime = addMinutes(new Date(startTime), totalDuration);
      form.setValue('end', newEndTime);
    }
  }, [selectedServices, services, form]);

  // Generate time options (memoized to prevent recalculation)
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push({
          label: formatTo12Hour(timeValue),
          value: timeValue,
        });
      }
    }
    return options;
  }, []);

  // Handle form submission
  const handleSubmit = (data: AppointmentFormData) => {
    // Find the customer
    const customer = customers.find((c) => c.id === data.customerId);
    if (!customer) return;

    // Find the full service objects for the selected service IDs
    const selectedServiceObjects = services.filter((service) => data.services?.includes(service.id));

    // Calculate total price
    const totalPrice = selectedServiceObjects.reduce((sum, service) => sum + parseFloat(service.price), 0);

    // Create updated or new appointment
    const updatedAppointment: AppointmentEvent = {
      id: appointment?.id || crypto.randomUUID(),
      ...data,
      customerName: customer.name,
      customerPhone: customer.phone,
      services: selectedServiceObjects,
      totalPrice,
      status: appointment?.status || 'scheduled',
      beforeImage: appointment?.beforeImage,
      afterImage: appointment?.afterImage,
    };

    onSave(updatedAppointment);
    onOpenChange(false);
  };

  // Handle event deletion with confirmation
  const handleDelete = () => {
    if (appointment?.id && onDelete) {
      onDelete(appointment.id);
      onOpenChange(false);
    }
  };

  // Helper function to update time for a date field
  const updateTimeForDate = (field: any, timeValue: string) => {
    const [hourStr, minuteStr] = timeValue.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const newDate = new Date(field.value);
    const updatedDate = setMinutes(setHours(newDate, hour), minute);
    field.onChange(updatedDate);
  };

  // Helper function to update dates while preserving time
  const updateDatesWithSameTime = (selectedDate: Date) => {
    // For start date: preserve time but update date
    const startDate = form.getValues('start');
    const newStartDate = new Date(selectedDate);
    newStartDate.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
    form.setValue('start', newStartDate);

    // For end date: keep same time but use the new selected date
    const endDate = form.getValues('end');
    const newEndDate = new Date(selectedDate);
    newEndDate.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
    form.setValue('end', newEndDate);
  };

  // Check if appointment can be edited (not completed or cancelled)
  const canEditAppointment = () => {
    if (!isEditing) return true;
    return appointment?.status !== 'completed' && appointment?.status !== 'cancelled';
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
                name='title'
                render={({ field }) => (
                  <FloatingLabelInput
                    label='Appointment title'
                    className='!h-10'
                    error={form.formState.errors.title?.message}
                    {...field}
                  />
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='customerId'
                render={({ field }) => (
                  <SearchableSelect
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
                  />
                )}
              />
            </div>

            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FloatingLabelInput
                    label='Location'
                    placeholder='Enter location'
                    className='!h-10'
                    {...field}
                  />
                )}
              />
            </div>

            <div className='space-y-1 w-full'>
              <Label
                htmlFor='startDate'
                className='text-sm'
              >
                Date
              </Label>
              <Controller
                control={form.control}
                name='start'
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
                    {form.formState.errors.start && <p className='text-sm font-medium text-red-500'>{form.formState.errors.start.message}</p>}
                  </div>
                )}
              />
            </div>
            <div className='grid sm:grid-cols-2 gap-4'>
              {/* Start Time */}
              <Controller
                control={form.control}
                name='start'
                render={({ field }) => (
                  <div>
                    <Select
                      label='Start Time'
                      options={timeOptions}
                      value={`${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}`}
                      className='!h-11'
                      onChange={(value) => {
                        if (value) {
                          updateTimeForDate(field, value);
                        }
                      }}
                      error={form.formState.errors.start?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name='end'
                render={({ field }) => (
                  <div>
                    <Select
                      label='End Time'
                      options={timeOptions}
                      value={`${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}`}
                      className='!h-11'
                      onChange={(value) => {
                        if (value) {
                          updateTimeForDate(field, value);
                        }
                      }}
                      error={form.formState.errors.end?.message}
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

            {selectedServices.length > 0 && (
              <div className='mt-4 p-3 bg-gray-50 rounded-md border border-gray-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium text-gray-700'>Total Price:</span>
                  <span className='font-bold text-lg'>
                    $
                    {selectedServices
                      .reduce((sum, serviceId) => {
                        const service = services.find((s) => s.id === serviceId);
                        return sum + (service ? parseFloat(service.price) : 0);
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <DialogFooter className='gap-2 sm:gap-0 flex flex-col'>
              <div className='flex gap-x-3 w-full'>
                {isEditing && onDelete ? (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={handleDelete}
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
                >
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <div className='p-4 bg-muted/50 rounded-lg text-center'>
            <p className='text-muted-foreground'>
              {appointment?.status === 'completed'
                ? 'This appointment has been completed and cannot be modified.'
                : 'This appointment has been cancelled and cannot be modified.'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get initial form values
function getInitialFormValues(appointment: AppointmentEvent | null, timeSlot?: { start: Date; end: Date } | null): AppointmentFormData {
  if (appointment) {
    // Editing existing appointment
    return {
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      color: appointment.color || '#d1d5f0',
      textColor: appointment.textColor || '#000000',
      location: appointment.location || '',
      description: appointment.description || '',
      customerId: MOCK_CUSTOMERS.find((c) => c.name === appointment.customerName)?.id || '',
      services: appointment.services?.map((service) => service.id) || [],
    };
  } else if (timeSlot) {
    // Creating appointment with pre-selected time slot
    return {
      ...DEFAULT_APPOINTMENT_VALUES,
      start: timeSlot.start,
      end: timeSlot.end,
    };
  }

  // Default values for new appointment
  return DEFAULT_APPOINTMENT_VALUES;
}
