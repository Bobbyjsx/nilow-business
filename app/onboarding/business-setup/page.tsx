import { BusinessSetupForms } from '@/components/modules/onboarding/business-setup/page';

const BusinessSetupPage = () => {
  return (
    <div className='flex flex-col items-center justify-start h-full min-h-screen bg-stone-100 py-10'>
      <BusinessSetupForms />
    </div>
  );
};

export default BusinessSetupPage;
