'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

// Create icon components
const GoogleIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
  >
    <path
      d='M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z'
      fill='currentColor'
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
  >
    <path
      d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
      fill='currentColor'
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
  >
    <path
      d='M22.001 12c0 5.523-4.477 10-10 10-5.523 0-10-4.477-10-10 0-5.523 4.477-10 10-10 5.523 0 10 4.477 10 10zm-9.5-5.805c.413 0 1.298.246 1.904.749.605.503.89.392 1.171.392.282 0 1.283-.298 1.686-.994.403-.697.35-1.174.328-1.433-.022-.259-.386-.809-.838-1.035-.452-.226-1.088-.405-1.598-.405-.51 0-1.173.236-1.697.458-.524.223-1.087.811-1.087 1.189 0 .377.299.879.73 1.198.43.319.989-.12 1.402-.12zm1.24 5.805c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z'
      fill='currentColor'
    />
  </svg>
);

export const AuthOptions = () => {
  const options = {
    google: {
      label: 'Sign In with Google',
      icon: <GoogleIcon />,
      action: () => {},
    },
    facebook: {
      label: 'Sign In with Facebook',
      icon: <FacebookIcon />,
      action: () => {},
    },
    apple: {
      label: 'Sign In with Apple',
      icon: <AppleIcon />,
      action: () => {},
    },
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-3'>
      {Object.entries(options).map(([key, option]) => (
        <Button
          key={key}
          onClick={option.action}
          className='auth-button shadow-none !rounded-sm w-full'
          leftNode={option.icon}
          variant={'outline'}
        >
          <span className='auth-label'>{option.label}</span>
        </Button>
      ))}
    </div>
  );
};
