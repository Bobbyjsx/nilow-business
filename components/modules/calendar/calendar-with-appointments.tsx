'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppointmentProvider, useAppointments } from './appointment-context';
import { AppointmentDrawer } from './appointment-drawer';
import { AppointmentFormModal } from './appointment-form-modal';
import { CalendarScheduler } from './calendar-scheduler';
import { Event } from './types';

// Wrapper component that connects the calendar with the appointment drawer
function CalendarWithAppointmentsInner() {
  const {
    appointments,
    selectedAppointment,
    selectedTimeSlot,
    isDrawerOpen,
    isFormModalOpen,
    formModalMode,
    openAppointmentDrawer,
    closeAppointmentDrawer,
    openCreateModal,
    openEditModal,
    closeFormModal,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    uploadBeforeImage,
    uploadAfterImage,
  } = useAppointments();

  // Handle event selection from the calendar
  const handleEventSelect = (event: Event) => {
    openAppointmentDrawer(event.id);
  };

  // Handle time slot selection from the calendar
  const handleTimeSlotSelect = (start: Date, end: Date) => {
    openCreateModal({ start, end });
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-end mr-1 sm:mr-0'>
        <Button
          onClick={() => openCreateModal()}
          className='flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          New Appointment
        </Button>
      </div>

      {/* Modified CalendarScheduler that passes the handleEventSelect function */}
      <CalendarScheduler
        onEventSelect={handleEventSelect}
        onTimeSlotSelect={handleTimeSlotSelect}
        events={appointments}
      />

      {/* Appointment Drawer */}
      <AppointmentDrawer
        open={isDrawerOpen}
        onOpenChange={closeAppointmentDrawer}
        appointment={selectedAppointment}
        onStatusChange={updateAppointmentStatus}
        onCancel={cancelAppointment}
        onUploadBeforeImage={uploadBeforeImage}
        onUploadAfterImage={uploadAfterImage}
      />

      {/* Appointment Form Modal (for both create and edit) */}
      <AppointmentFormModal
        open={isFormModalOpen}
        onOpenChange={closeFormModal}
        appointment={selectedAppointment}
        timeSlot={selectedTimeSlot}
        onSave={formModalMode === 'create' ? createAppointment : updateAppointment}
        onDelete={formModalMode === 'edit' ? deleteAppointment : undefined}
        mode={formModalMode}
      />
    </div>
  );
}

// Main component that wraps everything with the AppointmentProvider
export function CalendarWithAppointments() {
  return (
    <AppointmentProvider>
      <CalendarWithAppointmentsInner />
    </AppointmentProvider>
  );
}
