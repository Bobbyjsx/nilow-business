'use client';

import { Appointment, useAppointments as useAppoint } from '@/app/api/appointments';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface AppointmentContextType {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedTimeSlot: { start: Date; end: Date } | null;
  isDrawerOpen: boolean;
  isFormModalOpen: boolean;
  formModalMode: 'create' | 'edit';
  openAppointmentDrawer: (appointmentId: string) => void;
  closeAppointmentDrawer: () => void;
  openCreateModal: (timeSlot?: { start: Date; end: Date }) => void;
  openEditModal: (appointmentId: string) => void;
  closeFormModal: () => void;
  refreshSelectedAppointment: () => void;
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  isAppointmentsLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedMonth = useMemo(() => {
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  }, [selectedDate]);

  const getMonthRange = useMemo(() => {
    const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

    return {
      dateFrom: firstDay.toISOString(),
      dateTo: lastDay.toISOString(),
    };
  }, [selectedMonth]);
  console.log(getMonthRange);
  const { appointments, isLoading: isAppointmentsLoading } = useAppoint({ range: getMonthRange });

  useEffect(() => {
    if (selectedAppointment) {
      refreshSelectedAppointment();

      setTimeout(() => {
        refreshSelectedAppointment();
      }, 1000);
    }
  }, [appointments]);

  const refreshSelectedAppointment = () => {
    if (selectedAppointment) {
      const updatedAppointment = appointments.find((app) => app._id === selectedAppointment._id);
      console.log('Refreshing appointment:', selectedAppointment._id);
      console.log('Found updated appointment:', updatedAppointment);

      if (updatedAppointment) {
        console.log('Setting selected appointment to:', updatedAppointment);
        setSelectedAppointment({ ...updatedAppointment });
      }
    }
  };

  const openAppointmentDrawer = (appointmentId: string) => {
    const appointment = appointments.find((app) => app._id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsDrawerOpen(true);
    }
  };

  const closeAppointmentDrawer = () => {
    setIsDrawerOpen(false);
    // Small delay to prevent visual glitches when closing
    setTimeout(() => setSelectedAppointment(null), 300);
  };

  const openCreateModal = (timeSlot?: { start: Date; end: Date }) => {
    setSelectedAppointment(null);
    setSelectedTimeSlot(timeSlot || null);
    setFormModalMode('create');
    setIsFormModalOpen(true);
  };

  const openEditModal = (appointmentId: string) => {
    const appointment = appointments.find((app) => app._id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setSelectedTimeSlot(null);
      setFormModalMode('edit');
      setIsFormModalOpen(true);
    }
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    // Don't clear selected appointment immediately if drawer is open
    if (!isDrawerOpen) {
      setTimeout(() => {
        setSelectedAppointment(null);
        setSelectedTimeSlot(null);
      }, 300);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isAppointmentsLoading,
        selectedDate,
        setSelectedDate,
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
        refreshSelectedAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
