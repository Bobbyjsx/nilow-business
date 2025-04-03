'use client';
import { Search } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { BaseInputProps, Input } from './input';

interface SearchInputProps extends Omit<BaseInputProps, 'onChange'> {
  debounce?: number;
  onChange?: (value: string) => void;
}

export const SearchInput = ({ className, debounce = 300, value, onChange, ...props }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [debouncedValue] = useDebounce(inputValue, debounce);

  useEffect(() => {
    onChange?.(debouncedValue as any);
  }, [debouncedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <Input
      type='text'
      leftNode={
        <Search
          size={20}
          className='cursor-text h-4 w-4 text-primary'
        />
      }
      value={inputValue}
      onChange={handleChange}
      {...props}
    />
  );
};
