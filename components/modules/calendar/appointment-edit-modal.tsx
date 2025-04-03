'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { Label } from '@/components/ui/label';
import { Popover } from '@/components/ui/popover';
import { Select } from '@/components/ui/select';
import { TextArea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { addMinutes, format, setHours, setMinutes } from 'date-fns';
import { CalendarIcon, Pencil, Phone, User } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { dummyServices } from '../dashboard/settings/services/constants';
import { formatTo12Hour } from '../onboarding/business-hours/constant';
import { formatDuration, formatPrice } from '../onboarding/services/constants';
import { AppointmentEvent } from './appointment-drawer';
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
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  services: z.array(z.string()).optional(),
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
  customerName: '',
  customerPhone: '',
  services: [],
};

interface AppointmentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentEvent | null;
  onSave: (appointment: AppointmentEvent) => void;
  services?: Service[]; // Optional prop to pass services
}

export function AppointmentEditModal({
  open,
  onOpenChange,
  appointment,
  onSave,
  services = dummyServices, // Default to mock services if not provided
}: AppointmentEditModalProps) {
  // Convert services to options for the multi-select
  const serviceOptions = useMemo(() => {
    return services.map((service) => ({
      value: service.id,
      label: service.name,
      description: `${formatDuration(service.hours, service.minutes)} - ${formatPrice(service.price)}`,
    }));
  }, [services]);

  // Initialize form with default values
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getInitialFormValues(appointment),
  });

  // Watch for changes to the services field
  const selectedServices = useWatch({
    control: form.control,
    name: 'services',
    defaultValue: [],
  });

  // Reset form values when dialog opens or appointment changes
  useEffect(() => {
    if (open && appointment) {
      form.reset(getInitialFormValues(appointment));
    }
  }, [form, appointment, open]);

  // Update end time when services change
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
    if (!appointment) return;

    // Find the full service objects for the selected service IDs
    const selectedServiceObjects = services.filter((service) => data.services?.includes(service.id));

    // Calculate total price
    const totalPrice = selectedServiceObjects.reduce((sum, service) => sum + parseFloat(service.price), 0);

    // Create updated appointment
    const updatedAppointment: AppointmentEvent = {
      ...appointment,
      ...data,
      services: selectedServiceObjects,
      totalPrice,
    };

    onSave(updatedAppointment);
    onOpenChange(false);
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
    return appointment?.status !== 'completed' && appointment?.status !== 'cancelled';
  };

  if (!appointment) return null;

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
            <Pencil className='h-5 w-5' />
            Edit Appointment
          </DialogTitle>
          <DialogDescription>
            {canEditAppointment() ? 'Make changes to this appointment.' : 'This appointment cannot be edited because it is completed or cancelled.'}
          </DialogDescription>
        </DialogHeader>

        {canEditAppointment() ? (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            {/* Title Field */}
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

            {/* Customer Information */}
            <div className='grid grid-cols-1 gap-4'>
              <Controller
                control={form.control}
                name='customerName'
                render={({ field }) => (
                  <div className='relative'>
                    <FloatingLabelInput
                      label='Customer name'
                      className='!h-10 pl-9'
                      {...field}
                    />
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name='customerPhone'
                render={({ field }) => (
                  <div className='relative'>
                    <FloatingLabelInput
                      label='Customer phone'
                      className='!h-10 pl-9'
                      {...field}
                    />
                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                )}
              />
            </div>

            {/* Date Field */}
            <div className='space-y-1 w-full'>
              <Label htmlFor='startDate'>Date</Label>
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
                        className='w-full p-0 bg-white relative z-20'
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.start && <p className='text-sm font-medium text-red-500'>{form.formState.errors.start.message}</p>}
                  </div>
                )}
              />
            </div>

            {/* Time Fields */}
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

              {/* End Time */}
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

            {/* Location Field */}
            <div className='space-y-1'>
              <Controller
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FloatingLabelInput
                    label='Location'
                    className='!h-10'
                    {...field}
                  />
                )}
              />
            </div>

            {/* Services Field */}
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

            {/* Description Field */}
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

            {/* Footer Buttons */}
            <DialogFooter className='gap-2 sm:gap-0'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Save Changes</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className='p-4 bg-muted/50 rounded-lg text-center'>
            <p className='text-muted-foreground'>
              {appointment.status === 'completed'
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
function getInitialFormValues(appointment: AppointmentEvent | null): AppointmentFormData {
  if (!appointment) return DEFAULT_APPOINTMENT_VALUES;

  return {
    title: appointment.title,
    start: appointment.start,
    end: appointment.end,
    color: appointment.color || '#d1d5f0',
    textColor: appointment.textColor || '#000000',
    location: appointment.location || '',
    description: appointment.description || '',
    customerName: appointment.customerName || '',
    customerPhone: appointment.customerPhone || '',
    services: appointment.services?.map((service) => service.id) || [],
  };
}
