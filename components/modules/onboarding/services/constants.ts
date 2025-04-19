import { z } from 'zod';

enum ServicesPages {
  SERVICES = 'services',
}

// Define the service schema
const serviceSchema = z
  .object({
    name: z.string().min(1, 'Service name is required'),
    serviceType: z.string().min(1, 'Service type is required'),
    hours: z.string().min(1, 'Hours is required'),
    minutes: z.string().min(1, 'Minutes is required'),
    price: z.string({ invalid_type_error: 'Price must be a number' }),
    startsAt: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.startsAt && (!data.price || data.price.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Price is required when "Starts At" is not selected',
      path: ['price'],
    },
  );

// Define the form schema
const servicesFormSchema = z.object({
  services: z.array(serviceSchema),
});

// Type definitions
export type Service = z.infer<typeof serviceSchema>;
export type ServicesFormValues = z.infer<typeof servicesFormSchema>;

// Format duration from hours and minutes
export const formatDuration = (hours: string, minutes: string): string => {
  const hoursNum = parseInt(hours, 10);
  const minutesNum = parseInt(minutes, 10);

  if (hoursNum > 0 && minutesNum > 0) {
    return `${hoursNum}h ${minutesNum}m`;
  } else if (hoursNum > 0) {
    return `${hoursNum}h`;
  } else if (minutesNum > 0) {
    return `${minutesNum}m`;
  }

  return '';
};

// Parse duration string into hours and minutes
export const parseDuration = (duration?: string): { hours: string; minutes: string } => {
  if (!duration) {
    return { hours: '0', minutes: '00' };
  }

  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);

  return {
    hours: hoursMatch ? hoursMatch[1] : '1',
    minutes: minutesMatch ? minutesMatch[1] : '00',
  };
};

export const hoursOptions = Array.from({ length: 24 }, (_, i) => {
  const value = i.toString().padStart(2, '0');
  return {
    value,
    label: value,
  };
});

// Minutes options (5-55 in increments of 5)
export const minutesOptions = Array.from({ length: 11 }, (_, i) => {
  const value = ((i + 1) * 5).toString().padStart(2, '0');
  return {
    value,
    label: value,
  };
});

const serviceTypeOptions = [
  { value: 'haircut', label: 'Haircut' },
  { value: 'shampoo', label: 'Shampoo' },
  { value: 'trim', label: 'Trim' },
  { value: 'unassigned', label: 'Unassigned' },
];

export { serviceSchema, servicesFormSchema, ServicesPages, serviceTypeOptions };
