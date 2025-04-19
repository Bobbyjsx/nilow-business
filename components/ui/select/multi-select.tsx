import { cn } from '@/lib/utils';
import { ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from 'use-debounce';
import { Badge } from '../badge';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Option } from './types';

export interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
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
  maxItems?: number;
  maxDisplayItems?: number;
  description?: string;
  loadOptions?: (search?: string) => void;
  onMenuScrollToBottom?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options',
  label,
  error,
  className,
  emptyMessage = 'No results found.',
  searchPlaceholder = 'Search options...',
  defaultOpen = false,
  disabled = false,
  triggerClassName,
  contentClassName,
  maxItems,
  maxDisplayItems = 3,
  description,
  isLoading,
  onMenuScrollToBottom,
  loadOptions,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { ref, inView } = useInView();
  const [debouncedSearch] = useDebounce(searchQuery, 200);

  useEffect(() => {
    if (debouncedSearch && loadOptions && !options.some((option) => option.label.toLowerCase().includes(debouncedSearch.toLowerCase()))) {
      loadOptions(debouncedSearch);
    }
  }, [debouncedSearch, loadOptions, options]);

  useEffect(() => {
    if (inView && onMenuScrollToBottom) {
      onMenuScrollToBottom();
    }
  }, [inView, onMenuScrollToBottom]);

  const selectedOptions = React.useMemo(() => options.filter((option) => value.includes(option.value)), [options, value]);
  const filteredOptions = React.useMemo(
    () =>
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) || option.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [options, searchQuery],
  );

  const handleSelection = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange?.(value.filter((v) => v !== optionValue));
    } else if (!maxItems || value.length < maxItems) {
      onChange?.([...value, optionValue]);
    }
    setSearchQuery('');
  };

  const handleRemove = (optionValue: string) => onChange?.(value.filter((v) => v !== optionValue));
  const handleClear = () => onChange?.([]);

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
        modal
      >
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'relative w-full border px-3 py-2 bg-white rounded-md transition min-h-14 justify-between hover:bg-white',
              error ? 'border-red-600 focus:ring-red-500' : 'border-custom-black-100',
              selectedOptions.length > 0 ? 'text-custom-black-500' : 'text-custom-black-200 hover:text-custom-black-200',
              disabled && 'opacity-50 cursor-not-allowed',
              triggerClassName,
            )}
          >
            <div className='flex flex-wrap gap-1 items-center'>
              {selectedOptions.length > 0 ? (
                <>
                  {selectedOptions.slice(0, maxDisplayItems).map((option) => (
                    <Badge
                      key={option.value}
                      variant='secondary'
                      className='mr-1 mb-1'
                    >
                      {option.label}
                      {!disabled && (
                        <button
                          className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemove(option.value);
                          }}
                        >
                          <X className='h-3 w-3' />
                          <span className='sr-only'>Remove {option.label}</span>
                        </button>
                      )}
                    </Badge>
                  ))}
                  {selectedOptions.length > maxDisplayItems && (
                    <Badge
                      variant='secondary'
                      className='mb-1'
                    >
                      +{selectedOptions.length - maxDisplayItems} more
                    </Badge>
                  )}
                </>
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50 flex' />
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
            {selectedOptions.length > 0 && (
              <div className='flex items-center justify-between p-2 border-b'>
                <div className='text-sm text-muted-foreground'>{selectedOptions.length} selected</div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault();
                    handleClear();
                  }}
                  className='h-auto p-1 text-xs'
                >
                  Clear all
                </Button>
              </div>
            )}
            <CommandList className='w-full max-h-[200px] overflow-y-auto'>
              <CommandEmpty className='p-2 text-sm text-gray-600'>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelection(option.value)}
                      keywords={[option.label, option.description ?? '']}
                      className='cursor-pointer py-1.5'
                    >
                      <Checkbox
                        checked={isSelected}
                        className='text-white'
                        onCheckedChange={() => handleSelection(option.value)}
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm text-gray-900'>{option.label}</span>
                        {option.description && <span className='text-xs text-gray-600'>{option.description}</span>}
                      </div>
                    </CommandItem>
                  );
                })}
                <div ref={ref}>
                  {isLoading && (
                    <span className='text-sm flex bg-business-gray/60 text-white font-semibold h-5 w-full justify-center items-center mb-5'>
                      Loading more...
                    </span>
                  )}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      {description && !error && <p className='mt-1 text-xs text-gray-500'>{description}</p>}
      {maxItems && value.length >= maxItems && <p className='mt-1 text-xs text-amber-600'>Maximum of {maxItems} items can be selected</p>}
    </div>
  );
}
