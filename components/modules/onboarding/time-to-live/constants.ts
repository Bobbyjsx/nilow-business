import { capitalizeFirstLetter } from '@/lib/utils';

enum TimeToLiveKeys {
  TTL = 'ttl',
}

enum TimeToLive {
  NOW = '0',
  TOMORROW = '24',
  THREE_DAYS = '72',
  FIVE_DAYS = '120',
  SEVEN_DAYS = '168',
}

const timeToLiveOptions = Object.entries(TimeToLive)
  .filter(([key]) => isNaN(Number(key))) // Filter out reverse mappings
  .map(([key, value]) => ({
    value: value, // Use the enum value as the option value
    label: capitalizeFirstLetter(key.split('_').join(' ').toLowerCase()), // Format the key as readable text
  }));

type TimeToLiveType = keyof typeof TimeToLive;

export { TimeToLive, TimeToLiveKeys, timeToLiveOptions };

export type { TimeToLiveType };
