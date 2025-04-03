import { BusinessHoursModule } from '@/components/modules/onboarding/business-hours/page';

const BusinessHours = () => {
  return (
    <div className='flex flex-col items-center justify-start h-full min-h-screen bg-stone-100 py-10'>
      <BusinessHoursModule />
    </div>
  );
};

export default BusinessHours;
