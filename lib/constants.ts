export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || '';

export type ResponseWithPagination<T> = {
  data: T;
  meta: {
    totalItems: number;
    perPage: number;
    totalPages: number;
    currentPage: number;
    nextPage: number;
    prevPage: number;
  };
};

export const TOKEN_KEY = '@acs_token';

export const formatPrice = (price: string | number): string => {
  if (!price) return '$0.00';
  const formattedPrice = `$${parseFloat(price.toString()).toFixed(2)}`;
  return `${formattedPrice}+`;
};

export const getDateFromValue = (value: any): Date | null => {
  if (value instanceof Date) {
    return value;
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const updateTimeForDate = (field: any, timeValue: string) => {
  const [hours, minutes] = timeValue.split(':').map(Number);
  const date = getDateFromValue(field.value) ?? new Date();

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  field.onChange(date);
};
