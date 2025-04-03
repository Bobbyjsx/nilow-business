'use client';

import { AppointmentStatus } from '@/lib/constants';
import { createContext, ReactNode, useContext, useState } from 'react';
import { dummyServices } from '../dashboard/settings/services/constants';
import { AppointmentEvent } from './appointment-drawer';

interface AppointmentContextType {
  appointments: AppointmentEvent[];
  selectedAppointment: AppointmentEvent | null;
  selectedTimeSlot: { start: Date; end: Date } | null;
  isDrawerOpen: boolean;
  isFormModalOpen: boolean;
  formModalMode: 'create' | 'edit';
  openAppointmentDrawer: (appointmentId: string) => void;
  closeAppointmentDrawer: () => void;
  openCreateModal: (timeSlot?: { start: Date; end: Date }) => void;
  openEditModal: (appointmentId: string) => void;
  closeFormModal: () => void;
  createAppointment: (appointment: AppointmentEvent) => void;
  updateAppointment: (updatedAppointment: AppointmentEvent) => void;
  deleteAppointment: (appointmentId: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  cancelAppointment: (appointmentId: string) => void;
  uploadBeforeImage: (appointmentId: string, file: File) => Promise<void>;
  uploadAfterImage: (appointmentId: string, file: File) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  // Sample appointments data - in a real app, this would come from an API
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([
    {
      id: '1',
      title: 'Haircut - John Smith',
      start: new Date(new Date().setHours(10, 0)),
      end: new Date(new Date().setHours(10, 45)),
      color: '#d1d5f0',
      textColor: '#000000',
      status: 'scheduled',
      customerName: 'John Smith',
      customerPhone: '555-123-4567',
      location: 'Main Salon',
      description: 'Regular customer, prefers scissors over clippers',
      services: [dummyServices[0]],
      totalPrice: 25.0,
    },
    {
      id: '2',
      title: 'Hair Coloring - Sarah Johnson',
      start: new Date(new Date().setHours(13, 0)),
      end: new Date(new Date().setHours(14, 30)),
      color: '#d1f0d5',
      textColor: '#000000',
      status: 'in-progress',
      customerName: 'Sarah Johnson',
      customerPhone: '555-987-6543',
      location: 'Main Salon',
      description: 'Wants to go from brown to blonde',
      beforeImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=300',
      services: [dummyServices[1]],
      totalPrice: 75.0,
    },
    {
      id: '3',
      title: 'Full Treatment - Michael Brown',
      start: new Date(new Date().setHours(15, 0)),
      end: new Date(new Date().setHours(17, 0)),
      color: '#f0d1d5',
      textColor: '#000000',
      status: 'completed',
      customerName: 'Michael Brown',
      customerPhone: '555-456-7890',
      location: 'VIP Room',
      description: 'Complete makeover for wedding',
      beforeImage: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=300',
      afterImage: 'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?q=80&w=300',
      services: dummyServices.slice(0, 2),
      totalPrice: 145.0,
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEvent | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');

  const openAppointmentDrawer = (appointmentId: string) => {
    const appointment = appointments.find((app) => app.id === appointmentId);
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
    const appointment = appointments.find((app) => app.id === appointmentId);
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

  const createAppointment = (newAppointment: AppointmentEvent) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointment = (updatedAppointment: AppointmentEvent) => {
    setAppointments((prevAppointments) => prevAppointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app)));

    // Update the selected appointment if it's currently open
    if (selectedAppointment?.id === updatedAppointment.id) {
      setSelectedAppointment(updatedAppointment);
    }
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));

    // Close drawer if the deleted appointment was selected
    if (selectedAppointment?.id === appointmentId) {
      setIsDrawerOpen(false);
      setTimeout(() => setSelectedAppointment(null), 300);
    }
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prevAppointments) => prevAppointments.map((app) => (app.id === appointmentId ? { ...app, status } : app)));

    // Update the selected appointment if it's currently open
    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const cancelAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'cancelled');
  };

  // Simulate image upload with a promise
  const uploadBeforeImage = async (appointmentId: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // Create a URL for the image file
          const imageUrl = URL.createObjectURL(file);

          // Update appointments state
          setAppointments((prevAppointments) => prevAppointments.map((app) => (app.id === appointmentId ? { ...app, beforeImage: imageUrl } : app)));

          // Update selected appointment if it's open
          if (selectedAppointment?.id === appointmentId) {
            setSelectedAppointment((prev) => (prev ? { ...prev, beforeImage: imageUrl } : null));
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  };

  const uploadAfterImage = async (appointmentId: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // Create a URL for the image file
          const imageUrl = URL.createObjectURL(file);

          // Update appointments state
          setAppointments((prevAppointments) => prevAppointments.map((app) => (app.id === appointmentId ? { ...app, afterImage: imageUrl } : app)));

          // Update selected appointment if it's open
          if (selectedAppointment?.id === appointmentId) {
            setSelectedAppointment((prev) => (prev ? { ...prev, afterImage: imageUrl } : null));
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
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
