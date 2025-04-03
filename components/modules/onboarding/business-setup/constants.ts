import { z } from 'zod';

enum BusinessSetupPageKeys {
  CATEGORY = 'business-category',
  CONTACT = 'contactInfo',
  PAYMENT = 'paymentInfo',
}

const BusinessSetupFormSchema = z.object({
  category: z.string().min(2).max(100),
  yourName: z.string().min(2).max(100),
  businessName: z.string().min(2).max(100),
  phoneNumber: z.string().min(10, 'Requires at least 10 digits').max(15),
  physicalStore: z.boolean(),
  homeService: z.boolean(),
});

type BusinessSetupFormValues = z.infer<typeof BusinessSetupFormSchema>;

export { BusinessSetupFormSchema, BusinessSetupPageKeys };
export type { BusinessSetupFormValues };
