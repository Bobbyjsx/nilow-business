'use client';
import Link from 'next/link';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '../ui/button';

export const ErrorFallBackComponent = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className='!h-screen w-screen flex-1 bg-white py-20'>
      <div className='container mx-auto'>
        <div className='flex justify-center px-4 py-4'>
          <h1 className='text-4xl md:text-6xl font-medium text-center'>Oops</h1>
        </div>
        <div className='flex flex-col items-center justify-center py-10 pt-5'>
          <div className='flex items-center justify-center px-4 md:px-10'>
            <h1 className='text-center font-semibold md:text-3xl'>Something went wrong</h1>
          </div>
          <p className='py-6 pt-1 text-center text-sm text-slate-500 md:text-base'>
            Don't panic, An error report has been sent and we are working on a fix
          </p>
          <div className='flex gap-4 md:gap-6'>
            <Button
              className='bg-business-primary text-white'
              onClick={resetErrorBoundary}
            >
              Reset
            </Button>
            <Link href='/'>
              <Button
                variant='outline'
                className='border-business-secondary'
              >
                {' '}
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
