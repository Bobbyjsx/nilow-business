'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { ViewType } from './types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onDateChange: (date: Date) => void;
  onViewChange: (view: ViewType) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  dateFormat: string;
}

export function CalendarHeader({ currentDate, view, onDateChange, onViewChange, onPrevious, onNext, onToday, dateFormat }: CalendarHeaderProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center p-2- pb-4 border-b gap-2 px-2 sm:px-5'>
      <div className='flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-start'>
        <div className='flex items-center gap-1 sm:gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={onPrevious}
            className='h-8 w-8 sm:h-9 sm:w-9'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={onNext}
            className='h-8 w-8 sm:h-9 sm:w-9'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={onToday}
            className='text-xs sm:text-sm'
          >
            Today
          </Button>
        </div>
      </div>
      <Popover
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none'
          >
            <CalendarIcon className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
            <span className='truncate'>{format(currentDate, isMobile ? 'MMM d' : dateFormat)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'
        >
          <Calendar
            mode='single'
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setCalendarOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {isMobile && (
        <div className='flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end'>
          <div className='flex gap-1 sm:hidden'>
            <Tabs
              value={view}
              onValueChange={(v) => onViewChange(v as ViewType)}
            >
              <TabsList>
                <TabsTrigger value='day'>Day</TabsTrigger>
                <TabsTrigger value='week'>Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
