'use client';
import { cva } from 'class-variance-authority';
import { useRef, useState } from 'react';
import { BaseInputProps, Input } from './input';

const floatingLabelInputVariants = cva('w-full ring-0 focus:ring-0 !focus-visible:ring-0 !focus-visible:outline-none', {
  variants: {
    size: {
      xs: 'h-12',
      sm: 'h-14',
      lg: 'h-16',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export const FloatingLabelInput = ({
  label,
  type = 'text',
  className,
  ref,
  size,
  ...props
}: Omit<BaseInputProps, 'size'> & {
  label?: string;
  size?: 'xs' | 'sm' | 'lg';
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    props?.onBlur?.();
  };

  const handleLabelClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <label
        onClick={handleLabelClick}
        className={`
          absolute left-4 px-1 text-gray-500 bg-background transition-all duration-300 z-10 cursor-text
          ${isFocused || props?.value ? '-top-3 text-sm font-medium' : 'top-1/2 -translate-y-1/2 text-base'}
          ${props?.disabled ? '!bg-gray-50' : ''}
        `}
      >
        {label}
      </label>

      <Input
        ref={inputRef}
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={floatingLabelInputVariants({ size, className })}
        {...props}
        placeholder={isFocused ? props.placeholder : ''}
      />
    </div>
  );
};
