import classNames from 'classnames';
import React, { forwardRef } from 'react';

export type BaseInputProps = {
  label?: string;
  helpText?: string | React.ReactNode;
  error?: string;
  optional?: boolean;
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  isLoading?: boolean;
  isRequired?: boolean;
} & React.ComponentProps<'input'>;

export const Input = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, type = 'text', label, helpText, error, optional, leftNode, rightNode, isLoading, isRequired, ...props }, ref) => {
    return (
      <div>
        {/* Label Section */}
        {label && (
          <div className='flex justify-between mb-2'>
            <label
              className='leading-6 text-gray-900 flex flex-1 items-center text-sm sm:text-base'
              htmlFor={props.id || props.name}
            >
              {label}
              {isRequired && <span className='text-red-500'>*</span>}
            </label>
            {optional && <span className='text-sm text-gray-500'>Optional</span>}
          </div>
        )}

        {/* Input Wrapper */}
        <div className='relative rounded-md shadow-sm'>
          {leftNode && <div className='absolute inset-y-0 left-0 flex items-center pl-3'>{leftNode}</div>}

          <input
            ref={ref}
            type={type}
            className={classNames(
              'block w-full rounded-md border-0 py-1.5 focus:ring-custom-black-300 ring-1 focus:outline-0  focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6',
              {
                'pl-10': leftNode,
                'pl-3': !leftNode,
                'pr-10': rightNode || error,
                'pr-3': !rightNode && !error,
                'text-gray-900 ring-gray-300 placeholder:text-gray-400  ': !error,
                'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
              },
              className,
            )}
            {...props}
          />

          {rightNode && <div className='absolute inset-y-0 right-0 flex items-center pr-3'>{rightNode}</div>}

          {/* Loading Indicator */}
          {isLoading && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              <span className='animate-spin h-5 w-5 border-t-2 border-gray-500 rounded-full'></span>
            </div>
          )}
        </div>

        {/* Error & Help Text */}
        {error && <div className='mt-2 text-sm text-red-600'>{error}</div>}
        {helpText && <div className='mt-2 text-sm text-gray-500'>{helpText}</div>}
      </div>
    );
  },
);

Input.displayName = 'Input';
