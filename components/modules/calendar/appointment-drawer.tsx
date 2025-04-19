'use client';

import { addMinutes, format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Play,
  ThumbsDown,
  ThumbsUp,
  User,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Appointment, APPOINTMENT_STATUS_ENUM, getStatusDisplay, statusMap, useUpdateAppointment } from '@/app/api/appointments';
import { useUploadImage } from '@/app/api/images';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAppointments } from './appointment-context';
import { AppointmentImageUpload } from './appointment-image-upload';
import { convertHHMMToDate } from './constants';

interface AppointmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export function AppointmentDrawer({ open, onOpenChange, appointment }: AppointmentDrawerProps) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [localUploading, setIsUploading] = useState(false);
  const { openEditModal } = useAppointments();
  const { executeImageUpload, isImageUploading } = useUploadImage();
  const { executeUpdateAppointment, isPending } = useUpdateAppointment();

  const isUploading = isImageUploading || localUploading || isPending;

  const statusConfig = {
    scheduled: {
      label: 'Scheduled',
      color: 'bg-amber-100 text-amber-800',
      icon: <Calendar className='h-4 w-4 mr-1.5' />,
      progress: 25,
    },
    'in-progress': {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-800',
      icon: <Play className='h-4 w-4 mr-1.5' />,
      progress: 75,
    },
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className='h-4 w-4 mr-1.5' />,
      progress: 10,
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className='h-4 w-4 mr-1.5' />,
      progress: 100,
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className='h-4 w-4 mr-1.5' />,
      progress: 0,
    },
  };

  // Handle phone call
  const handlePhoneCall = useCallback(() => {
    // if (appointment?.customerPhone) {
    window.location.href = `tel:+2348025242524`;
    // }
  }, [appointment]);

  // Handle status change with validation
  const handleStatusChange = useCallback(
    async (status: APPOINTMENT_STATUS_ENUM, reason?: string) => {
      if (!appointment) return;

      // if (status === APPOINTMENT_STATUS_ENUM.STARTED && !appointment.beforeImage) {
      //   toast.error('Before image required', {
      //     description: 'Please upload a before image to start this appointment',
      //   });
      //   return;
      // }

      if (status === APPOINTMENT_STATUS_ENUM.COMPLETED && !appointment.afterImage) {
        toast.error('After image required', {
          description: 'Please upload an after image to complete this appointment',
        });
        return;
      }

      try {
        setIsUploading(true);
        await executeUpdateAppointment({
          id: appointment._id,
          appointment: {
            status,
            ...(reason && { cancellationReason: reason }),
          },
        });

        const statusText = statusMap[status].replace('-', ' ');
        toast.success(`Appointment ${statusText}`, {
          description: status === APPOINTMENT_STATUS_ENUM.COMPLETED ? 'Great job! The appointment has been completed successfully.' : undefined,
        });

        // Reset states
        setIsConfirmingCancel(false);
        setIsConfirmingReject(false);
        setRejectionReason('');
      } catch (error) {
        toast.error('Failed to update appointment status');
        console.error('Error updating appointment status:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [appointment, executeUpdateAppointment],
  );

  const handleImageUpload = async (image: File, type: 'beforeImage' | 'afterImage') => {
    if (!appointment) return;

    // Validate image upload based on appointment status
    if (type === 'beforeImage' && appointment.status !== APPOINTMENT_STATUS_ENUM.STARTED) {
      toast.error('Cannot upload before image', {
        description: 'Before images can only be uploaded after an appointment has started',
      });
      return;
    }

    if (type === 'afterImage' && appointment.status !== APPOINTMENT_STATUS_ENUM.STARTED) {
      toast.error('Cannot upload after image', {
        description: 'After images can only be uploaded when an appointment is in progress',
      });
      return;
    }

    try {
      setIsUploading(true);
      const uploadResult = await executeImageUpload([image]);

      if (uploadResult) {
        await executeUpdateAppointment({
          id: appointment._id,
          appointment: {
            [type]: uploadResult?.data[0]?._id,
          },
        });

        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.log('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel with confirmation
  const handleCancel = useCallback(async () => {
    if (!appointment) return;

    if (!isConfirmingCancel) {
      setIsConfirmingCancel(true);
      return;
    }

    await handleStatusChange(APPOINTMENT_STATUS_ENUM.CANCELED);
  }, [isConfirmingCancel, appointment, handleStatusChange]);

  // Handle reject with confirmation and reason
  const handleReject = useCallback(async () => {
    if (!appointment) return;

    if (!isConfirmingReject) {
      setIsConfirmingReject(true);
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error('Rejection reason required', {
        description: 'Please provide a reason for rejecting this appointment',
      });
      return;
    }

    await handleStatusChange(APPOINTMENT_STATUS_ENUM.REJECTED, rejectionReason);
  }, [isConfirmingReject, appointment, rejectionReason, handleStatusChange]);

  const handleEditAppointment = useCallback(() => {
    if (!appointment) return;
    openEditModal(appointment._id);
  }, [appointment, openEditModal]);

  const canEditAppointment = useCallback(() => {
    if (!appointment) return false;
    return (
      appointment.status !== APPOINTMENT_STATUS_ENUM.COMPLETED &&
      appointment.status !== APPOINTMENT_STATUS_ENUM.REJECTED &&
      appointment.status !== APPOINTMENT_STATUS_ENUM.CANCELED
    );
  }, [appointment]);

  const total = (appointment?.appointment_fee || 0).toFixed(2);

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
            <SheetTitle className='text-lg sm:text-xl font-bold text-business-slate truncate'>Appointment Details</SheetTitle>
            <Badge
              className={cn(
                'flex items-center justify-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium w-fit',
                getStatusDisplay(appointment.status, statusConfig).color,
              )}
            >
              {getStatusDisplay(appointment.status, statusConfig).icon}
              {getStatusDisplay(appointment.status, statusConfig).label}
            </Badge>
          </div>
          <SheetDescription className='text-business-gray mt-1 text-xs sm:text-sm'>Appointment details and management</SheetDescription>

          {/* Progress indicator */}
          <div className='mt-3 sm:mt-4'>
            <Progress
              value={getStatusDisplay(appointment.status, statusConfig).progress}
              className={cn(appointment.status === APPOINTMENT_STATUS_ENUM.CANCELED ? 'bg-red-200' : 'bg-blue-100', 'h-1 sm:h-1.5 rounded-full')}
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
                <h3 className='font-medium text-business-slate text-base'>{appointment?.customer || 'No name provided'}</h3>
                {/* {appointment.customerPhone && ( */}
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-business-gray'>{appointment.customer}</p>
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
                {/* )} */}
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
                      <span className='text-sm font-medium text-business-slate'>{format(appointment.appointment_date, 'MMM dd, yyyy')}</span>
                    </div>

                    <div className='flex items-center gap-3 bg-business-slate/5 p-3 rounded-md'>
                      <Clock className='h-5 w-5 text-business-primary' />
                      <span className='text-sm font-medium text-business-slate'>
                        {format(convertHHMMToDate(appointment.start_time), 'h:mm a')} -{' '}
                        {format(
                          new Date(
                            appointment?.end_time
                              ? appointment.end_time
                              : addMinutes(convertHHMMToDate(appointment.start_time), appointment?.appointment_duration),
                          ),
                          'h:mm:a',
                        )}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 bg-business-slate/5 p-3 rounded-md'>
                    <MapPin className='h-5 w-5 text-business-primary' />
                    <span className='text-sm font-medium text-business-slate'>{appointment.isHomeService ? 'Main store' : 'Clients location'}</span>
                  </div>

                  {appointment.additional_notes && (
                    <div className='mt-4 pt-4 border-t border-business-slate/10'>
                      <h4 className='text-xs uppercase text-business-gray font-medium mb-2'>Notes</h4>
                      <p className='text-sm text-business-slate bg-business-slate/5 p-3 rounded-md leading-relaxed'>{appointment.additional_notes}</p>
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
                        <div key={service._id}>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-business-slate'>{service.name}</span>
                            <span className='text-sm font-medium text-business-slate'>
                              ${Number.parseFloat(String(service?.cost || 0)).toFixed(2)}
                            </span>
                          </div>
                          {index < (appointment.services?.length || 0) - 1 && <Separator className='my-2 bg-business-slate/10' />}
                        </div>
                      ))}

                      {total !== null && (
                        <div className='flex justify-between items-center pt-3 mt-3 border-t border-business-slate/20'>
                          <span className='text-sm font-medium text-business-slate'>Total</span>
                          <span className='text-base font-bold text-business-primary'>${total}</span>
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
                      onUpload={(file) => handleImageUpload(file, 'beforeImage')}
                      disabled={!canEditAppointment() || appointment.status !== APPOINTMENT_STATUS_ENUM.STARTED || isUploading}
                    />
                  </div>

                  {/* After Image */}
                  <div className='relative'>
                    <div className='absolute -top-2 -left-2 bg-business-primary text-white text-xs px-2 py-1 rounded-md font-medium z-[2]'>After</div>
                    <AppointmentImageUpload
                      imageUrl={appointment.afterImage}
                      onUpload={(file) => handleImageUpload(file, 'afterImage')}
                      disabled={!canEditAppointment() || appointment.status !== APPOINTMENT_STATUS_ENUM.STARTED || isUploading}
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
                  {/* PENDING status - Accept/Reject buttons */}
                  {appointment.status === APPOINTMENT_STATUS_ENUM.PENDING && (
                    <>
                      <div className='flex flex-col sm:flex-row gap-3 w-full'>
                        <Button
                          className='w-full sm:w-auto bg-business-primary hover:bg-business-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-200'
                          onClick={() => handleStatusChange(APPOINTMENT_STATUS_ENUM.ACCEPTED)}
                          disabled={isUploading}
                        >
                          <ThumbsUp className='h-4 w-4 mr-2' />
                          Accept Appointment
                        </Button>

                        <div className='flex flex-col w-full sm:w-auto'>
                          {isConfirmingReject && (
                            <div className='mb-2'>
                              <Label htmlFor='rejection-reason'>Rejection Reason</Label>
                              <Input
                                id='rejection-reason'
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder='Provide a reason for rejection'
                                className='mb-2'
                              />
                            </div>
                          )}

                          <Button
                            variant='outline'
                            className='w-full sm:w-auto border-business-secondary text-business-secondary hover:bg-business-secondary/10 hover:text-business-secondary transition-all duration-200'
                            onClick={handleReject}
                            disabled={isUploading || (isConfirmingReject && !rejectionReason.trim())}
                          >
                            <ThumbsDown className='h-4 w-4 mr-2' />
                            {isConfirmingReject ? 'Confirm Reject' : 'Reject Appointment'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SCHEDULED status - Start/Cancel buttons */}
                  {appointment.status === APPOINTMENT_STATUS_ENUM.ACCEPTED && (
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
                        onClick={() => handleStatusChange(APPOINTMENT_STATUS_ENUM.STARTED)}
                        disabled={isUploading}
                      >
                        <Play className='h-4 w-4 mr-2' />
                        Begin Appointment
                      </Button>
                    </>
                  )}

                  {/* STARTED status - Complete button */}
                  {appointment.status === APPOINTMENT_STATUS_ENUM.STARTED && (
                    <Button
                      className='w-full sm:w-auto bg-business-primary hover:bg-business-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-200'
                      onClick={() => handleStatusChange(APPOINTMENT_STATUS_ENUM.COMPLETED)}
                      disabled={isUploading}
                    >
                      <CheckCircle className='h-4 w-4 mr-2' />
                      Complete Appointment
                    </Button>
                  )}
                </section>

                {/* Edit button - not shown for STARTED status */}
                {/* {appointment.status !== APPOINTMENT_STATUS_ENUM.STARTED && (
                  <Button
                    variant='outline'
                    className='w-full sm:w-auto border-business-secondary text-business-secondary hover:bg-business-secondary/10 hover:text-business-secondary transition-all duration-200'
                    onClick={handleEditAppointment}
                    disabled={isUploading}
                  >
                    <Edit className='h-4 w-4 mr-2' />
                    Edit
                  </Button>
                )} */}
              </div>
            ) : (
              <div className='w-full p-4 bg-business-slate/5 rounded-lg text-center'>
                <p className='text-sm text-business-gray'>
                  {appointment.status === APPOINTMENT_STATUS_ENUM.COMPLETED
                    ? 'This appointment has been completed and cannot be modified.'
                    : appointment.status === APPOINTMENT_STATUS_ENUM.REJECTED
                      ? 'This appointment has been rejected and cannot be modified.'
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
