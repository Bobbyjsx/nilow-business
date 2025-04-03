'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter } from 'next/navigation';
import { Progress_Step } from '../constants';
import { ServicesPages } from './constants';
import { Services } from './Services';

export const ServicesPage = () => {
  const router = useRouter();
  const handleNextPage = () => {
    router.push('/onboarding/goals');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: ServicesPages.SERVICES,
      progress: Progress_Step.STEP_EIGHT,
      pageNode: <Services onSubmitForm={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<ServicesPages>
      pages={pages}
      currentPage={ServicesPages.SERVICES}
      onLastPage={onNoPrevPage}
    />
  );
};
