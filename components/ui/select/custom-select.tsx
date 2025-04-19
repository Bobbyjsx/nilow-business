'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './base';
import { Option } from './types';

export interface CustomSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  description?: string;
  onScrollBottom?: () => void;
  loadOptions?: () => Promise<Option[]>;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  className,
  disabled = false,
  description,
  onScrollBottom,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        onScrollBottom?.();
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScrollBottom]);
  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <span
          className={cn(
            'absolute -top-2 left-3 bg-background h-5 max-w-fit w-full px-1 text-sm font-medium z-10',
            error ? 'text-red-600' : 'text-gray-600',
          )}
        >
          {label}
        </span>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            'relative w-full border px-3 py-2 text-gray-900 bg-white rounded-md transition !h-12',
            error ? 'border-red-600 focus:ring-red-500' : 'border-custom-black-100',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
        >
          <SelectValue
            placeholder={placeholder}
            className='w-full'
          />
        </SelectTrigger>
        <SelectContent className='w-full'>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                <div className='flex flex-col'>
                  <span>{option.label}</span>
                  {option.description && <span className='text-xs text-gray-500'>{option.description}</span>}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      {description && !error && <p className='mt-1 text-xs text-gray-500'>{description}</p>}
    </div>
  );
};
