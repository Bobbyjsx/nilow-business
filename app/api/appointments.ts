import { useAppointments as useAppointmentsContext } from '@/components/modules/calendar/appointment-context';
import { ResponseWithPagination } from '@/lib/constants';
import http from '@/lib/https';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BusinessService } from './services';

export type AppointmentStatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Appointment = {
  _id: string;
  customer: string;
  business: string;
  isHomeService: boolean;
  services: BusinessService[];
  beforeImage?: string;
  afterImage?: string;
  status: AppointmentStatusType;
  start_time: string;
  end_time: Date;
  appointment_date: Date;
  additional_notes: string;
  cancellationReason: string;
  payment_method: string;
  appointment_duration: number;
  appointment_fee: number;
};
export type AppointmentCreate = {
  businessId: string;
  customerId: string;
  servicesIds: string[];
  isHomeService: boolean;
  appointmentDate: Date;
  additionalNotes: string;
  startTime: string;
  payment_method: string;
  status?: AppointmentStatusType;
};

export type AppointmentDateRange = {
  dateFrom: string;
  dateTo: string;
};

export enum APPOINTMENT_STATUS_ENUM {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  STARTED = 3,
  CANCELED = 4,
  COMPLETED = 5,
  FINISHED = 6,
}

export const statusMap: Record<APPOINTMENT_STATUS_ENUM, any> = {
  [APPOINTMENT_STATUS_ENUM.PENDING]: 'pending',
  [APPOINTMENT_STATUS_ENUM.ACCEPTED]: 'scheduled',
  [APPOINTMENT_STATUS_ENUM.REJECTED]: 'cancelled',
  [APPOINTMENT_STATUS_ENUM.STARTED]: 'in-progress',
  [APPOINTMENT_STATUS_ENUM.CANCELED]: 'cancelled',
  [APPOINTMENT_STATUS_ENUM.COMPLETED]: 'completed',
  [APPOINTMENT_STATUS_ENUM.FINISHED]: 'completed',
};

export const getStatusDisplay = (status: APPOINTMENT_STATUS_ENUM, statusConfig: any) => {
  const key = statusMap[status];
  return statusConfig[key];
};

const getAppointments = async (range: AppointmentDateRange) => {
  const res = await http.get<ResponseWithPagination<Appointment[]>>('/appointments', {
    params: {
      from_date: range.dateFrom,
      to_date: range.dateTo,
      limit: 500,
    },
  });
  return res;
};

const createAppointment = async (appointment: AppointmentCreate) => {
  const res = await http.post<Appointment>('/appointments/create', appointment);
  return res;
};

const updateAppointment = async (payload: { id: string; appointment: Partial<AppointmentCreate> }) => {
  const res = await http.post<Appointment>(`/appointments/update/${payload.id}`, payload.appointment);
  return res;
};

export const useAppointments = ({ range }: { range: AppointmentDateRange }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['get-appointments', range.dateFrom, range.dateTo],
    queryFn: async () => await getAppointments(range),
  });

  return {
    appointments: data?.data?.data || [],
    isLoading,
    error,
  };
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-appointments'] });
    },
  });

  return {
    createAppointment: mutateAsync,
    isPending,
    error,
  };
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const { refreshSelectedAppointment } = useAppointmentsContext();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: async () => {
      // First invalidate the query to refetch the data
      await queryClient.invalidateQueries({ queryKey: ['get-appointments'] });

      // Force a refetch to ensure we have the latest data
      await queryClient.refetchQueries({ queryKey: ['get-appointments'] });

      // Then refresh the selected appointment with the updated data
      setTimeout(() => {
        refreshSelectedAppointment();
      }, 300); // Increased delay to ensure the query has completed
    },
  });

  return {
    executeUpdateAppointment: mutateAsync,
    isPending,
    error,
  };
};
