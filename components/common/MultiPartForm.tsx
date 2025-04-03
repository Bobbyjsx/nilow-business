import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import OnboardingWrapper from '../modules/onboarding/OnboardingWrapper';

export type MultiPartFormPage<T extends string> = {
  pageNode: React.ReactNode;
  key: T;
  progress: number;
};

interface Props<T extends string> {
  pages: MultiPartFormPage<T>[];
  currentPage: T;
  setCurrentPage?: React.Dispatch<React.SetStateAction<T>>;
  onLastPage?: () => void;
}

export const MultiPartForm = <T extends string>({ pages, currentPage, setCurrentPage, onLastPage }: Props<T>) => {
  const activePage = useMemo(() => pages.find((page) => page.key === currentPage), [pages, currentPage]);

  const currentPageIndex = useMemo(() => pages.findIndex((page) => page.key === currentPage), [pages, currentPage]);

  const progress = useMemo(() => activePage?.progress || 0, [activePage]);

  const hasPreviousPage = currentPageIndex > 0;

  const handlePrevious = useCallback(() => {
    if (!hasPreviousPage) {
      onLastPage?.();
      return;
    }

    const previousPage = pages[currentPageIndex - 1];
    setCurrentPage?.(previousPage.key);
  }, [currentPageIndex, hasPreviousPage, pages, setCurrentPage, onLastPage]);

  const renderCurrentPage = useMemo(() => {
    return activePage?.pageNode || null;
  }, [activePage]);

  return (
    <OnboardingWrapper className='px-0'>
      <div className='flex flex-col items-center justify-start h-full'>
        <section className='flex flex-row items-center justify-between w-full pb-10 px-3'>
          <Button
            variant='ghost'
            onClick={handlePrevious}
            className='mr-4 cursor-pointer'
          >
            <ArrowLeft />
          </Button>
          <div className='w-full'>
            <Progress
              value={progress || 1}
              className='w-full bg-custom-black-100'
            />
          </div>
        </section>
        <Separator className='mb-10' />
        <section className='px-10 w-full'>{renderCurrentPage}</section>
      </div>
    </OnboardingWrapper>
  );
};
