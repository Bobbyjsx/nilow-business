'use client';

import { format } from 'date-fns';
import { AlertCircle, Calendar, Camera, CheckCircle, Clock, DollarSign, Edit, MapPin, Phone, Play, User, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { AppointmentStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAppointments } from './appointment-context';
import { AppointmentImageUpload } from './appointment-image-upload';
import type { Event } from './types';

export interface AppointmentEvent extends Event {
  status: AppointmentStatus;
  customerName?: string;
  customerPhone?: string;
  beforeImage?: string;
  afterImage?: string;
  totalPrice?: number;
}

interface AppointmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentEvent | null;
  onStatusChange: (appointmentId: string, status: AppointmentStatus) => void;
  onCancel: (appointmentId: string) => void;
  onUploadBeforeImage: (appointmentId: string, file: File) => Promise<void>;
  onUploadAfterImage: (appointmentId: string, file: File) => Promise<void>;
}

export function AppointmentDrawer({
  open,
  onOpenChange,
  appointment,
  onStatusChange,
  onCancel,
  onUploadBeforeImage,
  onUploadAfterImage,
}: AppointmentDrawerProps) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { openEditModal } = useAppointments();

  // Status badge configuration with business colors
  const statusConfig = {
    scheduled: {
      color: 'bg-amber-100 text-amber-800',
      icon: <Calendar className='h-4 w-4 mr-1.5' />,
      progress: 25,
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-800',
      icon: <Play className='h-4 w-4 mr-1.5' />,
      progress: 75,
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className='h-4 w-4 mr-1.5' />,
      progress: 100,
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className='h-4 w-4 mr-1.5' />,
      progress: 0,
    },
  };

  // Format status text for display
  const formatStatus = (status: AppointmentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  // Handle phone call
  const handlePhoneCall = useCallback(() => {
    if (appointment?.customerPhone) {
      window.location.href = `tel:${appointment.customerPhone}`;
    }
  }, [appointment?.customerPhone]);

  // Handle before image upload
  const handleBeforeImageUpload = useCallback(
    async (file: File) => {
      if (!appointment) return;

      try {
        setIsUploading(true);
        await onUploadBeforeImage(appointment.id, file);
        toast.success('Before image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [appointment, onUploadBeforeImage],
  );

  // Handle after image upload
  const handleAfterImageUpload = useCallback(
    async (file: File) => {
      if (!appointment) return;

      try {
        setIsUploading(true);
        await onUploadAfterImage(appointment.id, file);
        toast.success('After image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [appointment, onUploadAfterImage],
  );

  // Handle status change with validation
  const handleStatusChange = useCallback(
    (status: AppointmentStatus) => {
      if (!appointment) return;

      if (status === 'in-progress' && !appointment.beforeImage) {
        toast.error('Before image required', {
          description: 'Please upload a before image to start this appointment',
        });
        return;
      }

      if (status === 'completed' && !appointment.afterImage) {
        toast.error('After image required', {
          description: 'Please upload an after image to complete this appointment',
        });
        return;
      }

      onStatusChange(appointment.id, status);
      toast.success(`Appointment ${status.replace('-', ' ')}`, {
        description: status === 'completed' ? 'Great job! The appointment has been completed successfully.' : undefined,
      });
    },
    [appointment, onStatusChange],
  );

  // Handle cancel with confirmation
  const handleCancel = useCallback(() => {
    if (!appointment) return;

    if (!isConfirmingCancel) {
      setIsConfirmingCancel(true);
      return;
    }

    onCancel(appointment.id);
    setIsConfirmingCancel(false);
    toast.success('Appointment cancelled');
  }, [isConfirmingCancel, appointment, onCancel]);

  const handleEditAppointment = useCallback(() => {
    if (!appointment) return;
    openEditModal(appointment.id);
  }, [appointment, openEditModal]);

  const canEditAppointment = useCallback(() => {
    if (!appointment) return false;
    return appointment.status !== 'completed' && appointment.status !== 'cancelled';
  }, [appointment]);

  // Calculate total from services if available
  const calculateTotal = useCallback(() => {
    if (!appointment) return null;

    if (appointment.totalPrice) return appointment.totalPrice;
    if (!appointment.services || appointment.services.length === 0) return null;

    return appointment.services.reduce((sum, service) => sum + Number.parseFloat(service.price), 0);
  }, [appointment]);

  const total = calculateTotal();

  // Handle responsive drawer positioning
  const [side, setSide] = useState<'bottom' | 'right'>(typeof window !== 'undefined' && window.innerWidth < 640 ? 'bottom' : 'right');

  useEffect(() => {
    const handleResize = () => {
      setSide(window.innerWidth < 640 ? 'bottom' : 'right');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!appointment) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsConfirmingCancel(false);
        }
        onOpenChange(!isOpen);
      }}
    >
      <SheetContent
        side={side}
        className='sm:max-w-md md:max-w-lg overflow-y-auto p-0 h-full max-h-lvh'
      >
        {/* Header with status badge */}
        <SheetHeader className='p-4 sm:p-6 pb-2 sm:pb-4 sm:sticky sm:top-0 sm:z-10 border-b sm:bg-background'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <SheetTitle className='text-lg sm:text-xl font-bold text-business-slate truncate'>{appointment.title}</SheetTitle>
            <Badge
              className={cn(
                'flex items-center justify-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium w-fit',
                statusConfig[appointment.status].color,
              )}
            >
              {statusConfig[appointment.status].icon}
              {formatStatus(appointment.status)}
            </Badge>
          </div>
          <SheetDescription className='text-business-gray mt-1 text-xs sm:text-sm'>Appointment details and management</SheetDescription>

          {/* Progress indicator */}
          <div className='mt-3 sm:mt-4'>
            <Progress
              value={statusConfig[appointment.status].progress}
              className={cn(appointment.status === 'cancelled' ? 'bg-red-200' : 'bg-blue-100', 'h-1 sm:h-1.5 rounded-full')}
            />
          </div>
        </SheetHeader>

        <div className='px-6 py-4 space-y-6'>
          {/* Customer Information Card */}
          <div className='bg-gradient-to-r from-business-slate/5 to-business-primary/5 rounded-lg p-5 shadow-sm'>
            <div className='flex items-start gap-4'>
              <div className='bg-business-primary/10 p-3 rounded-full shrink-0'>
                <User className='h-5 w-5 text-business-primary' />
              </div>
              <div className='space-y-2 flex-1'>
                <h3 className='font-medium text-business-slate text-base'>{appointment.customerName || 'No name provided'}</h3>
                {appointment.customerPhone && (
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-business-gray'>{appointment.customerPhone}</p>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 px-3 text-business-primary hover:text-business-primary hover:bg-business-primary/10 transition-all duration-200'
                      onClick={handlePhoneCall}
                    >
                      <Phone className='h-3.5 w-3.5 mr-2' />
                      Call
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <Accordion
            type='multiple'
            defaultValue={['details', 'images', 'services']}
            className='w-full'
          >
            <AccordionItem
              value='details'
              className='border-none'
            >
              <AccordionTrigger className='py-3 hover:no-underline text-business-slate group'>
                <div className='flex items-center gap-2 text-sm font-medium group-hover:text-business-primary transition-colors'>
                  <Calendar className='h-4 w-4' />
                  Appointment Details
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-4 pl-6 pt-2'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3 bg-business-slate/5 p-3 rounded-md'>
                      <Calendar className='h-5 w-5 text-business-primary' />
                      <span className='text-sm font-medium text-business-slate'>{format(appointment.start, 'MMM dd, yyyy')}</span>
                    </div>

                    <div className='flex items-center gap-3 bg-business-slate/5 p-3 rounded-md'>
                      <Clock className='h-5 w-5 text-business-primary' />
                      <span className='text-sm font-medium text-business-slate'>
                        {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}
                      </span>
                    </div>
                  </div>

                  {appointment.location && (
                    <div className='flex items-center gap-3 bg-business-slate/5 p-3 rounded-md'>
                      <MapPin className='h-5 w-5 text-business-primary' />
                      <span className='text-sm font-medium text-business-slate'>{appointment.location}</span>
                    </div>
                  )}

                  {appointment.description && (
                    <div className='mt-4 pt-4 border-t border-business-slate/10'>
                      <h4 className='text-xs uppercase text-business-gray font-medium mb-2'>Notes</h4>
                      <p className='text-sm text-business-slate bg-business-slate/5 p-3 rounded-md leading-relaxed'>{appointment.description}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Services Section */}
            {appointment.services && appointment.services.length > 0 && (
              <AccordionItem
                value='services'
                className='border-none'
              >
                <AccordionTrigger className='py-3 hover:no-underline text-business-slate group'>
                  <div className='flex items-center gap-2 text-sm font-medium group-hover:text-business-primary transition-colors'>
                    <DollarSign className='h-4 w-4' />
                    Services & Pricing
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-3 pl-6 pt-2'>
                    <div className='space-y-3 bg-business-slate/5 p-4 rounded-md'>
                      {appointment.services.map((service, index) => (
                        <div key={service.id}>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-business-slate'>{service.name}</span>
                            <span className='text-sm font-medium text-business-slate'>${Number.parseFloat(service.price).toFixed(2)}</span>
                          </div>
                          {index < (appointment.services?.length || 0) - 1 && <Separator className='my-2 bg-business-slate/10' />}
                        </div>
                      ))}

                      {total !== null && (
                        <div className='flex justify-between items-center pt-3 mt-3 border-t border-business-slate/20'>
                          <span className='text-sm font-medium text-business-slate'>Total</span>
                          <span className='text-base font-bold text-business-primary'>${total.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Before & After Images */}
            <AccordionItem
              value='images'
              className='border-none'
            >
              <AccordionTrigger className='py-3 hover:no-underline text-business-slate group'>
                <div className='flex items-center gap-2 text-sm font-medium group-hover:text-business-primary transition-colors'>
                  <Camera className='h-4 w-4' />
                  Before & After Images
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pl-6 pt-2'>
                  {/* Before Image */}
                  <div className='relative'>
                    <div className='absolute -top-2 -left-2 bg-business-secondary text-white text-xs px-2 py-1 rounded-md font-medium z-[2]'>
                      Before
                    </div>
                    <AppointmentImageUpload
                      imageUrl={appointment.beforeImage}
                      onUpload={handleBeforeImageUpload}
                      disabled={!canEditAppointment() || isUploading}
                    />
                  </div>

                  {/* After Image */}
                  <div className='relative'>
                    <div className='absolute -top-2 -left-2 bg-business-primary text-white text-xs px-2 py-1 rounded-md font-medium z-[2]'>After</div>
                    <AppointmentImageUpload
                      imageUrl={appointment.afterImage}
                      onUpload={handleAfterImageUpload}
                      disabled={!canEditAppointment() || appointment.status !== 'in-progress' || isUploading}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer with action buttons */}
        <div className='sticky bottom-0 bg-background border-t z-[3]'>
          <SheetFooter className='p-6 flex flex-col sm:flex-row gap-3'>
            {canEditAppointment() ? (
              <div className='flex w-full justify-between items-center'>
                <section className='space-x-3'>
                  {appointment.status === 'scheduled' && (
                    <>
                      <Button
                        variant='outline'
                        className='w-full sm:w-auto order-1 sm:order-none border-business-primary text-business-primary hover:bg-business-primary/10 hover:text-business-primary transition-all duration-200'
                        onClick={handleCancel}
                        disabled={isUploading}
                      >
                        {isConfirmingCancel ? (
                          <>
                            <AlertCircle className='h-4 w-4 mr-2' />
                            Confirm Cancel
                          </>
                        ) : (
                          <>
                            <XCircle className='h-4 w-4 mr-2' />
                            Cancel
                          </>
                        )}
                      </Button>

                      <Button
                        className='w-full sm:w-auto bg-business-secondary hover:bg-business-secondary/90 text-white shadow-sm hover:shadow-md transition-all duration-200'
                        onClick={() => handleStatusChange('in-progress')}
                        disabled={isUploading}
                      >
                        <Play className='h-4 w-4 mr-2' />
                        Begin Appointment
                      </Button>
                    </>
                  )}

                  {appointment.status === 'in-progress' && (
                    <Button
                      className='w-full sm:w-auto bg-business-primary hover:bg-business-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-200'
                      onClick={() => handleStatusChange('completed')}
                      disabled={isUploading}
                    >
                      <CheckCircle className='h-4 w-4 mr-2' />
                      Complete Appointment
                    </Button>
                  )}
                </section>

                {appointment.status !== 'in-progress' && (
                  <Button
                    variant='outline'
                    className='w-full sm:w-auto border-business-secondary text-business-secondary hover:bg-business-secondary/10 hover:text-business-secondary transition-all duration-200'
                    onClick={handleEditAppointment}
                    disabled={isUploading}
                  >
                    <Edit className='h-4 w-4 mr-2' />
                    Edit
                  </Button>
                )}
              </div>
            ) : (
              <div className='w-full p-4 bg-business-slate/5 rounded-lg text-center'>
                <p className='text-sm text-business-gray'>
                  {appointment.status === 'completed'
                    ? 'This appointment has been completed and cannot be modified.'
                    : 'This appointment has been cancelled and cannot be modified.'}
                </p>
              </div>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
