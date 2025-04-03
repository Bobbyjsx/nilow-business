'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter } from 'next/navigation';
import { Progress_Step } from '../constants';
import { GoalPages } from './constants';
import { GoalForm } from './GoalForm';

export const GoalsPage = () => {
  const router = useRouter();
  const handleNextPage = () => {
    router.push('/onboarding/other-tools');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: GoalPages.GOAL,
      progress: Progress_Step.STEP_NINE,
      pageNode: <GoalForm onFormSubmit={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<GoalPages>
      pages={pages}
      currentPage={GoalPages.GOAL}
      onLastPage={onNoPrevPage}
    />
  );
};
