'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FloatingLabelInput } from '../ui/floating-label-input';
import { BaseInputProps } from '../ui/input';

type PasswordInputProps = Omit<BaseInputProps, 'type' | 'size'> & { label?: string; size?: 'xs' | 'sm' | 'lg' };

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FloatingLabelInput
      className={cn('h-12', className)}
      id='password'
      type={showPassword ? 'text' : 'password'}
      rightNode={
        <button
          onClick={togglePasswordVisibility}
          type='button'
          className='cursor-pointer text-custom-black-300 text-xs'
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      }
      {...props}
    />
  );
};
