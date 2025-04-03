'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { Progress_Step } from '../constants';
import { TravelFeeKeys } from './constants';
import { TravelFeeForm } from './TravelFeeForm';

export const TravelFeeSetupForms = () => {
  const router = useRouter();
  const params = useSearchParams();

  const handleNextPage = () => {
    router.push('/onboarding/staff-count');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: TravelFeeKeys.HOME_SERVICE_RATES,
      progress: Progress_Step.STEP_FIVE,
      pageNode: <TravelFeeForm onNextPage={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<TravelFeeKeys>
      pages={pages}
      currentPage={TravelFeeKeys.HOME_SERVICE_RATES}
      onLastPage={onNoPrevPage}
    />
  );
};
