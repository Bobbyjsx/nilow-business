'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { timeZones } from './time-zones';

interface TimeZoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeZoneSelector({ value, onChange }: TimeZoneSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedTimeZone = timeZones.find((tz) => tz.value === value);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full max-w-fit justify-between'
        >
          {selectedTimeZone ? selectedTimeZone.label : 'Select timezone...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput placeholder='Search timezone...' />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup className='max-h-[300px] overflow-auto'>
              {timeZones.map((tz) => (
                <CommandItem
                  key={tz.value}
                  value={tz.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === tz.value ? 'opacity-100' : 'opacity-0')} />
                  {tz.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
