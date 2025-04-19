import { ServiceType } from '@/app/api/services';
import { PriceType } from '../onboarding/travel-fee/constants';

export type ViewType = 'day' | 'week' | 'month' | 'agenda';

export interface Service {
  id?: string;
  name: string;
  serviceType?: string | ServiceType;
  serviceCategory?: string | ServiceType;
  hours: string;
  minutes: string;
  price: number;
  startsAt: boolean;
  priceType: PriceType;
  duration?: number; // Duration in minutes
  description?: string;
  color?: string;
  photos?: string[];
  target: string;
}
export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  textColor?: string;
  allDay?: boolean;
  location?: string;
  description?: string;
  recurrence?: string | null;
  services?: Service[];
}

export interface DisabledTimeSlot {
  day?: number; // 0-6 for Sunday-Saturday
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  recurring?: boolean;
  date?: Date; // For non-recurring slots
}

export interface CalendarSettings {
  startHour: number;
  endHour: number;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  disabledDays: number[]; // 0-6 for Sunday-Saturday
  disabledTimeSlots: DisabledTimeSlot[];
  workWeek: number[]; // 0-6 for Sunday-Saturday
}
