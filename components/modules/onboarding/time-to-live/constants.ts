import { capitalizeFirstLetter } from '@/lib/utils';

enum TimeToLiveKeys {
  TTL = 'ttl',
}

enum TimeToLive {
  NOW = 'now',
  TOMORROW = 'tomorrow',
  THREE_DAYS = 'in 3 days',
  FIVE_DAYS = 'in 5 days',
  SEVEN_DAYS = 'in 7 days',
}

const timeToLiveOptions = Object.entries(TimeToLive).map((time) => ({
  value: time[0],
  label: capitalizeFirstLetter(time[1]),
}));

type TimeToLiveType = keyof typeof TimeToLive;

export { TimeToLive, TimeToLiveKeys, timeToLiveOptions };

export type { TimeToLiveType };
