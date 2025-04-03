import { StaffNumbersForm } from '@/components/modules/onboarding/staff-numbers/page';

const StaffCountPage = () => {
  return (
    <div className='flex flex-col items-center justify-start h-full min-h-screen bg-stone-100 py-10'>
      <StaffNumbersForm />
    </div>
  );
};

export default StaffCountPage;
