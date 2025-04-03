'use client';

import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generateTimeSlots, isTimeSlotDisabled } from './calendar-utils';
import { ANIMATION_VARIANTS, CUSTOM_SCROLLBAR_STYLES, getTimeSlotBackground } from './constants';
import type { CalendarSettings, Event } from './types';

interface CalendarDayViewProps {
  date: Date;
  events: Event[];
  settings: CalendarSettings;
  onEventSelect: (event: Event) => void;
  onTimeSlotSelect: (start: Date, end: Date) => void;
}

export function CalendarDayView({ date, events, settings, onEventSelect, onTimeSlotSelect }: CalendarDayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState<number | null>(null);

  // Filter events for the current day
  const dayEvents = events.filter((event) => isSameDay(new Date(event.start), date));

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
  const handleTimeSlotClick = (hour: number, minute: number) => {
    const start = new Date(date);
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start);
    end.setHours(hour + 1, minute, 0, 0);

    if (!isTimeSlotDisabled(start, end, settings.disabledTimeSlots)) {
      onTimeSlotSelect(start, end);
    }
  };

  // Calculate event position and height
  const getEventStyle = (event: Event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const totalMinutes = (settings.endHour - settings.startHour) * 60;
    const startMinutes = (startDate.getHours() - settings.startHour) * 60 + startDate.getMinutes();
    const endMinutes = (endDate.getHours() - settings.startHour) * 60 + endDate.getMinutes();

    const top = (startMinutes / totalMinutes) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
      backgroundColor: event.color || 'rgba(59, 130, 246, 0.15)',
      borderLeft: '4px solid #3b82f6',
      color: event.textColor || '#374151',
    };
  };

  // Using getTimeSlotBackground from constants.ts

  // Determine if it's a current hour
  const isCurrentHour = (hour: number) => {
    const now = new Date();
    return isSameDay(date, now) && now.getHours() === hour;
  };

  return (
    <div
      className='flex flex-col h-full relative bg-white'
      ref={containerRef}
    >
      <div className='sticky top-0 z-20 bg-white px-4 py-3 border-b border-gray-100 rounded-t-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <LucideCalendar className='h-5 w-5 text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-800'>{format(date, 'EEEE, MMMM d')}</h2>
          </div>
          <div className='text-sm font-medium text-gray-500'>
            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        <div className='relative min-h-full'>
          {/* Time slots */}
          {timeSlots.map((_, index) => {
            const hour = settings.startHour + Math.floor(index / 1);
            const minute = (index % 1) * 60;
            const timeString = format(new Date().setHours(hour, minute), settings.timeFormat);

            const slotDate = new Date(date);
            slotDate.setHours(hour, minute, 0, 0);

            const slotEndDate = new Date(slotDate);
            slotEndDate.setHours(hour + 1, minute, 0, 0);

            const isDisabled = isTimeSlotDisabled(slotDate, slotEndDate, settings.disabledTimeSlots);
            const isCurrent = isCurrentHour(hour);

            return (
              <div
                key={`${hour}-${minute}`}
                className={cn(
                  'grid grid-cols-[80px_1fr] border-b border-gray-100 transition-all duration-200',
                  isDisabled ? 'bg-gray-50' : getTimeSlotBackground(hour),
                  isCurrent ? 'h-20' : 'h-16',
                )}
                onMouseEnter={() => setHoveredTimeSlot(index)}
                onMouseLeave={() => setHoveredTimeSlot(null)}
              >
                <div className='flex items-start justify-end pr-4 pt-2'>
                  <div className={cn('text-sm font-medium transition-all duration-300', isCurrent ? 'text-blue-600' : 'text-gray-500')}>
                    {timeString}
                  </div>
                </div>
                <div
                  className={cn(
                    'relative transition-all duration-200',
                    !isDisabled && 'cursor-pointer',
                    hoveredTimeSlot === index && !isDisabled && 'bg-blue-50',
                    isCurrent && 'bg-blue-50/40',
                  )}
                  onClick={() => !isDisabled && handleTimeSlotClick(hour, minute)}
                >
                  {hoveredTimeSlot === index && !isDisabled && (
                    <motion.div
                      initial={ANIMATION_VARIANTS.timeSlotHover.initial}
                      animate={ANIMATION_VARIANTS.timeSlotHover.animate}
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-500 bg-white px-2 py-1 rounded-full shadow-sm border border-blue-100'
                    >
                      + Add Event
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Current time indicator */}
          {isSameDay(date, new Date()) && (
            <div
              ref={currentTimeRef}
              className='absolute left-0 right-0 flex items-center pointer-events-none'
              style={{ zIndex: 30 }}
            >
              <div className='w-[80px] flex justify-end pr-2'>
                <div className='w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-300 animate-pulse' />
              </div>
              <div className='flex-1 h-[2px] bg-gradient-to-r from-red-500 via-red-500 to-transparent' />
            </div>
          )}

          {/* Events */}
          <AnimatePresence>
            {dayEvents.map((event) => (
              <motion.div
                {...ANIMATION_VARIANTS.event}
                className='absolute left-[80px] right-2 rounded-lg shadow-sm px-3 py-2 overflow-hidden cursor-pointer backdrop-blur-[2px]'
                style={getEventStyle(event)}
                onClick={() => onEventSelect(event)}
                key={event.id}
              >
                <div className='font-medium text-gray-800'>{event.title}</div>
                <div className='flex items-center gap-1 text-xs text-gray-600 mt-1'>
                  <LucideClock className='h-3 w-3' />
                  {format(new Date(event.start), settings.timeFormat)} - {format(new Date(event.end), settings.timeFormat)}
                </div>
                {event.location && (
                  <div className='flex items-center gap-1 text-xs text-gray-600 mt-1'>
                    <LucideMapPin className='h-3 w-3' />
                    <span className='truncate'>{event.location}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style
        jsx
        global
      >
        {CUSTOM_SCROLLBAR_STYLES}
      </style>
    </div>
  );
}
