'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
}

export function TimePickerDemo({ date, setDate, className }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  const [hour, setHour] = React.useState<number>(date ? date.getHours() : 0);
  const [minute, setMinute] = React.useState<number>(date ? date.getMinutes() : 0);
  const [second, setSecond] = React.useState<number>(date ? date.getSeconds() : 0);

  React.useEffect(() => {
    if (date) {
      setHour(date.getHours());
      setMinute(date.getMinutes());
      setSecond(date.getSeconds());
    }
  }, [date]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (isNaN(value)) {
      return;
    }

    const newHour = Math.max(0, Math.min(23, value));
    setHour(newHour);

    const newDate = new Date(date);
    newDate.setHours(newHour);
    setDate(newDate);

    if (value > 2) {
      minuteRef.current?.focus();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (isNaN(value)) {
      return;
    }

    const newMinute = Math.max(0, Math.min(59, value));
    setMinute(newMinute);

    const newDate = new Date(date);
    newDate.setMinutes(newMinute);
    setDate(newDate);

    if (value > 5) {
      secondRef.current?.focus();
    }
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (isNaN(value)) {
      return;
    }

    const newSecond = Math.max(0, Math.min(59, value));
    setSecond(newSecond);

    const newDate = new Date(date);
    newDate.setSeconds(newSecond);
    setDate(newDate);
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className='flex items-center gap-1'>
        <Input
          ref={hourRef}
          type='number'
          value={hour}
          onChange={handleHourChange}
          className='w-16 text-center'
          max={23}
          min={0}
        />
        <span className='text-sm'>:</span>
        <Input
          ref={minuteRef}
          type='number'
          value={minute}
          onChange={handleMinuteChange}
          className='w-16 text-center'
          max={59}
          min={0}
        />
        {/* <span className='text-sm'>:</span>
        <Input
          ref={secondRef}
          type='number'
          value={second}
          onChange={handleSecondChange}
          className='w-16 text-center'
          max={59}
          min={0}
        />
        <Clock className='ml-2 h-4 w-4 text-muted-foreground' /> */}
      </div>
    </div>
  );
}
