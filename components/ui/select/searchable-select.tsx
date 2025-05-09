'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useInView } from 'react-intersection-observer';

import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import { Button } from '../button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Option } from './types';

export interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  fallbackOption?: Option;
  loadOptions?: (search?: string) => void;
  onMenuScrollToBottom?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  description?: string;
}

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  className,
  emptyMessage = 'No results found.',
  searchPlaceholder = 'Search options...',
  defaultOpen = false,
  disabled = false,
  triggerClassName,
  contentClassName,
  fallbackOption,
  description,
  isLoading,
  onMenuScrollToBottom,
  loadOptions,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 200);
  const { ref, inView } = useInView();

  // Load options based on debounced search
  React.useEffect(() => {
    if (loadOptions) {
      loadOptions(debouncedSearch);
    }
  }, [debouncedSearch, loadOptions]);

  // Trigger infinite scroll when in view
  React.useEffect(() => {
    if (inView) {
      onMenuScrollToBottom?.();
    }
  }, [inView, onMenuScrollToBottom]);

  const selectedOption = React.useMemo(() => options.find((option) => option.value === value), [options, value]);

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => {
      const search = searchQuery.toLowerCase();
      return option.label.toLowerCase().includes(search) || option.description?.toLowerCase().includes(search);
    });
  }, [options, searchQuery]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      onChange?.(currentValue);
      setOpen(false);
      setSearchQuery('');
    },
    [onChange],
  );

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <span
          className={cn(
            'absolute -top-2 left-3 bg-background h-5 max-w-fit w-full px-1 text-sm font-medium z-10',
            error ? 'text-red-600' : 'text-custom-black-300',
          )}
        >
          {label}
        </span>
      )}
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'relative w-full border px-3 py-2 bg-white rounded-md transition !h-14 justify-between hover:bg-white',
              error ? 'border-red-600 focus:ring-red-500' : 'border-custom-black-100',
              selectedOption?.label ? 'text-custom-black-500' : 'text-custom-black-200 hover:text-custom-black-200',
              disabled && 'opacity-50 cursor-not-allowed',
              triggerClassName,
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('w-[var(--radix-popover-trigger-width)] p-0', contentClassName)}>
          <Command className='w-full'>
            <CommandInput
              placeholder={searchPlaceholder}
              className='text-sm text-gray-900'
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className='w-full max-h-[200px] overflow-y-auto'>
              <CommandEmpty className='p-2 text-sm text-gray-600'>
                {emptyMessage}
                {fallbackOption && (
                  <CommandItem
                    value={fallbackOption.value}
                    onSelect={() => handleSelect(fallbackOption.value)}
                    className='mt-2 cursor-pointer'
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === fallbackOption.value ? 'opacity-100' : 'opacity-0')} />
                    <div className='flex flex-col'>
                      <span className='text-sm text-gray-900'>{fallbackOption.label}</span>
                      {fallbackOption.description && <span className='text-xs text-gray-600'>{fallbackOption.description}</span>}
                    </div>
                  </CommandItem>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className='cursor-pointer py-1.5'
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                    <div className='flex flex-col'>
                      <span className='text-sm text-gray-900'>{option.label}</span>
                      {option.description && <span className='text-xs text-gray-600'>{option.description}</span>}
                    </div>
                  </CommandItem>
                ))}
                {isLoading ? (
                  <div
                    ref={ref}
                    className='py-2 text-sm text-gray-500 text-center'
                  >
                    Loading more...
                  </div>
                ) : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      {description && !error && <p className='mt-1 text-xs text-gray-500'>{description}</p>}
    </div>
  );
}
