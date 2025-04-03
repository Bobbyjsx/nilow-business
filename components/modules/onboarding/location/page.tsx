'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddressPage } from '../../address/page';
import { Progress_Step } from '../constants';
import { LocationSetupPageKeys } from './constants';

export const LocationSetupForm = () => {
  const router = useRouter();
  const params = useSearchParams();

  const handleNextPage = () => {
    if (params.get('homeService')) {
      router.push('/onboarding/travel-fee');
    }
  };

  const onNoPrevPage = () => {
    router.push('/onboarding/auth');
  };

  const pages = [
    {
      key: LocationSetupPageKeys.STORE_LOCATION,
      progress: Progress_Step.STEP_FOUR,
      pageNode: <AddressPage onNextPage={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<LocationSetupPageKeys>
      pages={pages}
      currentPage={LocationSetupPageKeys.STORE_LOCATION}
      onLastPage={onNoPrevPage}
    />
  );
};
