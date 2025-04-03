import { LocationSetupForm } from '@/components/modules/onboarding/location/page';

const LocationSetupPage = () => {
  return (
    <div className='flex flex-col items-center justify-start h-full min-h-screen bg-stone-100 py-10'>
      <LocationSetupForm />
    </div>
  );
};

export default LocationSetupPage;
