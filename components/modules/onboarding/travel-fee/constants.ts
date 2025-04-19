import { capitalizeFirstLetter } from '@/lib/utils';
import { z } from 'zod';

enum TravelFeeKeys {
  HOME_SERVICE_RATES = 'home-service-rates',
}

enum PriceType {
  FIXED = 'FIXED',
  STARTS_AT = 'PROGRESSIVE',
  VARIES = 'FLEXIBLE',
  FREE = 'FREE',
}

const TravelFeeSchema = z
  .object({
    priceType: z.nativeEnum(PriceType),
    travelFee: z.string().min(0).optional(),
    maximumTravelDistance: z.string().min(0).optional(),
    travelPolicy: z.string().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.priceType !== PriceType.FREE && data.priceType !== PriceType.VARIES) {
        return data.travelFee !== undefined;
      }
      return true;
    },
    {
      message: 'Required',
      path: ['travelFee'],
    },
  );

type TravelFeeFormValues = z.infer<typeof TravelFeeSchema>;

const priceTypeOptions = Object.values(PriceType).map((type) => ({
  value: type,
  label: capitalizeFirstLetter(type.split('_').join(' ').toLowerCase()),
}));

export { PriceType, priceTypeOptions, TravelFeeKeys, TravelFeeSchema };
export type { TravelFeeFormValues };
