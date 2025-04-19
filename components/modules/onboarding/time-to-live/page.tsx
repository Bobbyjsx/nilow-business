'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { Progress_Step } from '../constants';
import { TimeToLiveKeys } from './constants';
import { TimeToLiveForm } from './TimeToLiveForm';

export const TimeToLiveSetupForms = () => {
  const router = useRouter();

  const handleNextPage = () => {
    router.push('/dashboard/appointments');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: TimeToLiveKeys.TTL,
      progress: Progress_Step.STEP_ELEVEN,
      pageNode: <TimeToLiveForm onSubmit={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<TimeToLiveKeys>
      pages={pages}
      currentPage={TimeToLiveKeys.TTL}
      onLastPage={onNoPrevPage}
    />
  );
};
