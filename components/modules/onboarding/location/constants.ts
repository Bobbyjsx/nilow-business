import { z } from 'zod';

enum LocationSetupPageKeys {
  STORE_LOCATION = 'store-location',
  HOME_SERVICE_RATES = 'home-service-rates',
}

const StoreLocationSchema = z
  .object({
    city: z.string().min(1).max(100),
    street: z.string().min(1).max(100),
    street1: z.string().optional(),
    zipCode: z.string().min(1).max(100),
    isSharedLocation: z.boolean().default(false),
    sharedLocationName: z.string().optional(),
    sharedLocationSuiteNumber: z.string().optional(),
  })
  .refine((data) => !data.isSharedLocation || !!data.sharedLocationName, {
    message: 'Required',
    path: ['sharedLocationName'],
  });

type StoreLocationFormValues = z.infer<typeof StoreLocationSchema>;

const homeServiceRatesSchema = z.array(z.number().min(0).max(100));

const LocationSetupPageSchema = z.object({
  storeLocation: StoreLocationSchema,
  homeServiceRates: homeServiceRatesSchema,
});

type LocationSetupPageFormValues = z.infer<typeof LocationSetupPageSchema>;

export { homeServiceRatesSchema, LocationSetupPageKeys, LocationSetupPageSchema, StoreLocationSchema };
export type { LocationSetupPageFormValues, StoreLocationFormValues };
