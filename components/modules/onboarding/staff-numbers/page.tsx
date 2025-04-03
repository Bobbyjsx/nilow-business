'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter } from 'next/navigation';
import { Progress_Step } from '../constants';
import StaffForm from './StaffForm';

enum StaffNumberPageKeys {
  STAFF_NUMBER = 'staffNumber',
}

export const StaffNumbersForm = () => {
  const router = useRouter();
  const handleNextPage = () => {
    router.push('/onboarding/business-hours');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: StaffNumberPageKeys.STAFF_NUMBER,
      progress: Progress_Step.STEP_SIX,
      pageNode: <StaffForm onNextPage={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<StaffNumberPageKeys>
      pages={pages}
      currentPage={StaffNumberPageKeys.STAFF_NUMBER}
      onLastPage={onNoPrevPage}
    />
  );
};
