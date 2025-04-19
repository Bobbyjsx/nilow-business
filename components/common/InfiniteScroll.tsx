import classNames from 'classnames';
import { ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollProps {
  // isLoading: boolean;
  isFetchingNextPage: boolean;
  // hasNextPage: boolean;
  fetchNextPage: () => void;
  children: ReactNode;
  className?: string;
}

const InfiniteScrollList = ({ isFetchingNextPage, fetchNextPage, children, className }: InfiniteScrollProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // if (isLoading) {
  // 	return <div className="text-center py-6 text-gray-600">Loading...</div>;
  // }

  return (
    <div className={classNames('h-full flex flex-col justify-between', className)}>
      {children}

      <div
        ref={ref}
        className='text-center py-4 text-gray-500'
      >
        {isFetchingNextPage && 'Loading more...'}
        {/* // : hasNextPage ? 'Scroll to load more...' : '' */}
      </div>
    </div>
  );
};

export default InfiniteScrollList;
