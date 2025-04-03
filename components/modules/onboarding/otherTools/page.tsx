'use client';
import { MultiPartForm } from '@/components/common/MultiPartForm';
import { useRouter } from 'next/navigation';
import { Progress_Step } from '../constants';
import ToolsForm from './otherToolsForm';

enum ToolsUsedPageKeys {
  TOOLS_USED = 'tools',
}

export const OtherToolsPage = () => {
  const router = useRouter();
  const handleNextPage = () => {
    router.push('/onboarding/time-to-live');
  };

  const onNoPrevPage = () => {
    router.back();
  };

  const pages = [
    {
      key: ToolsUsedPageKeys.TOOLS_USED,
      progress: Progress_Step.STEP_TEN,
      pageNode: <ToolsForm onNextPage={handleNextPage} />,
    },
  ];

  return (
    <MultiPartForm<ToolsUsedPageKeys>
      pages={pages}
      currentPage={ToolsUsedPageKeys.TOOLS_USED}
      onLastPage={onNoPrevPage}
    />
  );
};
