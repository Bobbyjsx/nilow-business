'use client';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type CustomPhoneInputProps = PhoneInputProps & { label?: string; className?: string; error?: string; ref: any };

export const CustomPhoneInput = ({ label, className, ref, ...props }: CustomPhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);

  const handleLabelClick = () => {
    if (inputRef.current?.numberInputRef) {
      inputRef.current.numberInputRef?.focus();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <label
        onClick={handleLabelClick}
        className={`
          absolute left-4 px-1 text-gray-500 bg-white transition-all duration-300 cursor-text z-10
          ${isFocused || props?.value ? '-top-3 text-sm font-medium' : 'top-1/2 -translate-y-1/2 text-base'}
        `}
      >
        {label}
      </label>

      <PhoneInput
        enableSearch={true}
        country={'ng'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(!!props?.value)}
        inputClass={classNames(
          '!w-full !pl-14 !pr-4 !text-gray-900 !border !border-custom-black-100 !rounded-md focus:!border-custom-black-200 !h-14',
          { '!border-red-500': !!props?.error },
        )}
        buttonClass='!bg-transparent !border-none !absolute !left-2 !top-1/2 !-translate-y-1/2'
        dropdownClass='!bg-white !border !border-gray-300'
        containerClass='!relative w-full'
        {...props}
        //@ts-ignore Do not move the ref
        ref={inputRef}
      />
      {props?.error && <div className='text-red-500 text-sm mt-1'>{props?.error}</div>}
    </div>
  );
};
