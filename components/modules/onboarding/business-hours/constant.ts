import { z } from 'zod';


enum BusinessHoursPages {
  BUSINESS_HOURS  = 'business-hours',
}
const BreakSchema = z.object({
  start: z.string(),
  end: z.string()
});

const BusinessHourSchema = z.object({
  open: z.boolean(),
  hours: z.object({
    open: z.string(),
    close: z.string(),
    breaks: z.array(BreakSchema).optional()
  })
});

const BusinessHoursSchema = z.object({
  monday: BusinessHourSchema,
  tuesday: BusinessHourSchema,
  wednesday: BusinessHourSchema,
  thursday: BusinessHourSchema,
  friday: BusinessHourSchema,
  saturday: BusinessHourSchema,
  sunday: BusinessHourSchema
});

type BusinessHoursFormValues = z.infer<typeof BusinessHoursSchema>;

enum HOURS_OF_THE_DAY {
  MIDNIGHT = '00:00',
  ONE_AM = '01:00',
  TWO_AM = '02:00',
  THREE_AM = '03:00',
  FOUR_AM = '04:00',
  FIVE_AM = '05:00',
  SIX_AM = '06:00',
  SEVEN_AM = '07:00',
  EIGHT_AM = '08:00',
  NINE_AM = '09:00',
  TEN_AM = '10:00',
  ELEVEN_AM = '11:00',
  NOON = '12:00',
  ONE_PM = '13:00',
  TWO_PM = '14:00',
  THREE_PM = '15:00',
  FOUR_PM = '16:00',
  FIVE_PM = '17:00',
  SIX_PM = '18:00',
  SEVEN_PM = '19:00',
  EIGHT_PM = '20:00',
  NINE_PM = '21:00',
  TEN_PM = '22:00',
  ELEVEN_PM = '23:00'
};

const DAYS_OF_THE_WEEK = ['sunday','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const DEFAULT_HOURS = {
  open: HOURS_OF_THE_DAY.NINE_AM,
  close: HOURS_OF_THE_DAY.NINE_PM,
  // breaks: [
  //   {
  //     start: HOURS_OF_THE_DAY.TEN_AM,
  //     end: HOURS_OF_THE_DAY.ONE_PM,
  //   },
  //   {
  //     start: HOURS_OF_THE_DAY.FOUR_PM,
  //     end: HOURS_OF_THE_DAY.FIVE_PM,
  //   },
  // ],
};

const hoursOptions = Object.values(HOURS_OF_THE_DAY).map((hour) => ({
  value: hour,
  label: hour,
}));

// Convert 24-hour format to 12-hour format with AM/PM
const formatTo12Hour = (time24h: string): string => {
  if (!time24h) return '';

  const [hour, minute] = time24h.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

const parseTime = (time: string): number => {
  const [hour, min] = time.split(':').map(Number);
  return hour * 60 + min;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const addFiveMinutes = (time: string): string => formatTime(parseTime(time) + 5);

const generateTimeOptions = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return [];
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  if (end <= start) return [];

  const options = [];
  for (let mins = start; mins <= end; mins += 5) {
    const timeValue = formatTime(mins);
    options.push({
      label: formatTo12Hour(timeValue),
      value: timeValue
    });
  }
  return options;
};


export {
    addFiveMinutes, BreakSchema, BusinessHourSchema, BusinessHoursPages, BusinessHoursSchema, DAYS_OF_THE_WEEK, DEFAULT_HOURS, formatTime, formatTo12Hour, generateTimeOptions, HOURS_OF_THE_DAY, hoursOptions, parseTime
};
export type { BusinessHoursFormValues };

