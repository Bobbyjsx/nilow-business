import { TimeToLiveSetupForms } from '@/components/modules/onboarding/time-to-live/page';

const TimeToLive = () => {
  return (
    <div className='flex flex-col items-center justify-start h-full min-h-screen bg-stone-100 py-10'>
      <TimeToLiveSetupForms />
    </div>
  );
};

export default TimeToLive;
