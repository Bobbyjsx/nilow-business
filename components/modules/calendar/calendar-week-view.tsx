'use client';

import { Appointment } from '@/app/api/appointments';
import { cn } from '@/lib/utils';
import { addHours, eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useAppointments } from './appointment-context';
import { generateTimeSlots, isTimeSlotDisabled } from './calendar-utils';
import type { CalendarSettings } from './types';
import { CalendarSkeleton } from './week-skeleton';

interface CalendarWeekViewProps {
  date: Date;
  events: Appointment[];
  settings: CalendarSettings;
  onEventSelect: (event: Appointment) => void;
  onTimeSlotSelect: (start: Date, end: Date) => void;
}

export function CalendarWeekView({ date, events, settings, onEventSelect, onTimeSlotSelect }: CalendarWeekViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);

  // Get days of the week
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter days based on workWeek setting
  const displayDays = settings.workWeek ? daysOfWeek.filter((day) => settings.workWeek.includes(day.getDay() === 0 ? 7 : day.getDay())) : daysOfWeek;

  // Generate time slots based on settings
  const timeSlots = generateTimeSlots(settings.startHour, settings.endHour);

  // Update current time indicator position
  useEffect(() => {
    const updateCurrentTimePosition = () => {
      if (!currentTimeRef.current || !containerRef.current) return;

      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(settings.startHour, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setHours(settings.endHour, 0, 0, 0);

      const totalMinutes = (settings.endHour - settings.startHour) * 60;
      const currentMinutes = (now.getHours() - settings.startHour) * 60 + now.getMinutes();

      const percentage = (currentMinutes / totalMinutes) * 100;

      if (percentage >= 0 && percentage <= 100) {
        currentTimeRef.current.style.top = `${percentage}%`;
        currentTimeRef.current.style.display = 'block';
      } else {
        currentTimeRef.current.style.display = 'none';
      }
    };

    updateCurrentTimePosition();
    const interval = setInterval(updateCurrentTimePosition, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [settings.startHour, settings.endHour]);

  // Handle time slot click
  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    const start = new Date(day);
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start);
    end.setHours(hour + 1, minute, 0, 0);

    if (!isTimeSlotDisabled(start, end, settings.disabledTimeSlots)) {
      onTimeSlotSelect(start, end);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start_time), day));
  };

  // Calculate event position and height
  const getEventStyle = (event: Appointment) => {
    const startDate = new Date(event.start_time);
    const endDate = event?.end_time ? new Date(event.end_time) : addHours(event?.start_time, 1.5);

    const totalMinutes = (settings.endHour - settings.startHour) * 60;
    const startMinutes = (startDate.getHours() - settings.startHour) * 60 + startDate.getMinutes();
    const endMinutes = (endDate.getHours() - settings.startHour) * 60 + endDate.getMinutes();

    const top = (startMinutes / totalMinutes) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
      backgroundColor: '#d1d5f0',
      color: '#000000',
    };
  };

  const { isAppointmentsLoading } = useAppointments();

  if (isAppointmentsLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div
      className='flex flex-col h-full'
      ref={containerRef}
    >
      {/* Week header */}
      <div className='grid grid-cols-[80px_1fr] border-b'>
        <div className='border-r border-border' />
        <div
          className='grid'
          style={{ gridTemplateColumns: `repeat(${displayDays.length}, 1fr)` }}
        >
          {displayDays.map((day) => (
            <div
              key={day.toString()}
              className={cn('text-center py-2 border-r border-border last:border-r-0', isSameDay(day, new Date()) && 'bg-accent/10 font-medium')}
            >
              <div className='text-sm text-muted-foreground'>{format(day, 'EEE')}</div>
              <div className='text-xl'>{format(day, 'd')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time grid */}
      <div className='flex-1 overflow-y-auto'>
        <div className='relative min-h-full'>
          {/* Time slots */}
          {timeSlots.map((slot, index) => {
            const hour = settings.startHour + Math.floor(index / 1);
            const minute = (index % 1) * 60;
            const timeString = format(new Date().setHours(hour, minute), settings.timeFormat);

            return (
              <div
                key={`${hour}-${minute}`}
                className='grid grid-cols-[80px_1fr] border-b border-border h-16'
              >
                <div className='flex items-start justify-end pr-4 pt-1 text-sm text-muted-foreground'>{timeString}</div>
                <div
                  className='grid border-l border-border'
                  style={{ gridTemplateColumns: `repeat(${displayDays.length}, 1fr)` }}
                >
                  {displayDays.map((day) => {
                    const slotDate = new Date(day);
                    slotDate.setHours(hour, minute, 0, 0);

                    const slotEndDate = new Date(slotDate);
                    slotEndDate.setHours(hour + 1, minute, 0, 0);

                    const isDisabled =
                      isTimeSlotDisabled(slotDate, slotEndDate, settings.disabledTimeSlots) || settings.disabledDays.includes(day.getDay());

                    return (
                      <div
                        key={day.toString()}
                        className={cn(
                          'border-r border-border last:border-r-0 relative',
                          isDisabled ? 'bg-muted/30' : 'hover:bg-accent/10 cursor-pointer',
                          isSameDay(day, new Date()) && 'bg-accent/5',
                        )}
                        onClick={() => !isDisabled && handleTimeSlotClick(day, hour, minute)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Current time indicator */}
          {displayDays.some((day) => isSameDay(day, new Date())) && (
            <div
              ref={currentTimeRef}
              className='absolute left-0 right-0 flex items-center pointer-events-none'
              style={{ zIndex: 10 }}
            >
              <div className='w-[80px] flex justify-end pr-2'>
                <div className='w-2 h-2 rounded-full bg-red-500' />
              </div>
              <div className='flex-1 h-[1px] bg-red-500' />
            </div>
          )}

          {/* Events */}
          {displayDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);

            return dayEvents.map((event) => {
              const left = `calc(${(100 / displayDays.length) * dayIndex}% + 80px)`;
              const width = `calc(${100 / displayDays.length}% - 4px)`;

              return (
                <div
                  key={`${day}-${event._id}`}
                  className='absolute rounded-md px-2 py-1 overflow-hidden text-sm cursor-pointer hover:opacity-90 transition-opacity'
                  style={{
                    ...getEventStyle(event),
                    left,
                    width,
                  }}
                  onClick={() => onEventSelect(event)}
                >
                  {/* <div className='font-medium truncate'>{event.title}</div> */}
                  <div className='text-xs'>
                    {format(new Date(event.start_time), settings.timeFormat)} -
                    {format(new Date(event?.end_time ? event.end_time : addHours(event?.start_time, 1.5)), settings.timeFormat)}
                  </div>
                  {event?.isHomeService ? 'Home Service' : 'Clients location'}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
