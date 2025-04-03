import React from 'react';

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full min-h-screen font-[family-name:var(--font-geist-sans)] w-full dark:bg-whitei dark:text-black- '>
      <main className='w-full'>{children}</main>
    </div>
  );
};

export default OnboardingLayout;
