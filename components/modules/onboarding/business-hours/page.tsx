'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter } from 'next/navigation';
import { Progress_Step } from '../constants';
import { BusinessHoursForm } from './BusinessHoursForm';
import { BusinessHoursPages } from './constant';

export const BusinessHoursModule = () => {
  const router = useRouter();
  const handleNextPage = () => {
    router.push('/onboarding/services');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: BusinessHoursPages.BUSINESS_HOURS,
      progress: Progress_Step.STEP_SEVEN,
      pageNode: <BusinessHoursForm onSubmitForm={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<BusinessHoursPages>
      pages={pages}
      currentPage={BusinessHoursPages.BUSINESS_HOURS}
      onLastPage={onNoPrevPage}
    />
  );
};
