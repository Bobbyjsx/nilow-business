'use client';

import { Appointment, useAppointments as useAppoint } from '@/app/api/appointments';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

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
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  isAppointmentsLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
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

  const { appointments, isLoading: isAppointmentsLoading } = useAppoint({ range: getMonthRange });

  const selectedAppointment = useMemo(() => {
    return appointments.find((app) => app._id === selectedAppointmentId) ?? null;
  }, [appointments, selectedAppointmentId]);

  const openAppointmentDrawer = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsDrawerOpen(true);
  };

  const closeAppointmentDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedAppointmentId(null), 300);
  };

  const openCreateModal = (timeSlot?: { start: Date; end: Date }) => {
    setSelectedAppointmentId(null);
    setSelectedTimeSlot(timeSlot || null);
    setFormModalMode('create');
    setIsFormModalOpen(true);
  };

  const openEditModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedTimeSlot(null);
    setFormModalMode('edit');
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    if (!isDrawerOpen) {
      setTimeout(() => {
        setSelectedAppointmentId(null);
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
