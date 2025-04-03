'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { addDays, subDays } from 'date-fns';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CalendarDayView } from './calendar-day-view';
import { CalendarHeader } from './calendar-header';
import { isTimeSlotDisabled } from './calendar-utils';
import { CalendarWeekView } from './calendar-week-view';
import { SettingsDialog } from './settings-dialog';
import { TimeZoneSelector } from './time-zone-selector';
import { CalendarSettings, Event, ViewType } from './types';

export function CalendarScheduler({
  onEventSelect,
  onTimeSlotSelect,
  events: externalEvents,
}: {
  onEventSelect?: (event: Event) => void;
  onTimeSlotSelect?: (start: Date, end: Date) => void;
  events?: Event[];
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('day');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Daily Standup Meeting',
      start: new Date(currentDate.setHours(12, 15)),
      end: new Date(currentDate.setHours(13, 0)),
      color: '#d1d5f0',
      textColor: '#000000',
      allDay: false,
      location: 'Conference Room A',
      description: 'Daily team sync-up meeting',
      recurrence: null,
    },
    {
      id: '2',
      title: 'Counselor Meetup',
      start: new Date(currentDate.setHours(18, 0)),
      end: new Date(currentDate.setHours(18, 45)),
      color: '#d1f0d5',
      textColor: '#000000',
      allDay: false,
      location: 'Office 302',
      description: 'Weekly counseling session',
      recurrence: null,
    },
  ]);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<CalendarSettings>({
    startHour: 9,
    endHour: 21,
    timeZone: 'America/New_York',
    dateFormat: 'MMMM dd, yyyy',
    timeFormat: 'h:mm a',
    disabledDays: [],
    disabledTimeSlots: [],
    workWeek: [1, 2, 3, 4, 5], // Monday to Friday
  });

  // Use external events if provided
  useEffect(() => {
    if (externalEvents) {
      setEvents(externalEvents);
    }
  }, [externalEvents]);

  const isMobile = useIsMobile();

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handlePrevious = () => {
    if (view === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subDays(currentDate, 7));
    }
  };

  const handleNext = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotSelect = (start: Date, end: Date) => {
    if (isTimeSlotDisabled(start, end, settings.disabledTimeSlots)) {
      toast('Time slot unavailable', {
        description: 'This time slot is disabled and cannot be selected.',
      });
      return;
    }

    if (onTimeSlotSelect) {
      onTimeSlotSelect(start, end);
    }
  };

  const handleEventSelect = (event: Event) => {
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const handleSettingsSave = (newSettings: CalendarSettings) => {
    setSettings(newSettings);
    setIsSettingsDialogOpen(false);
    toast('Settings updated', {
      description: 'Your calendar settings have been updated.',
    });
  };

  return (
    <Card className='border shadow-sm rounded-none pb-0'>
      <div className='flex flex-col h-full'>
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          dateFormat={settings.dateFormat}
        />

        {!isMobile && (
          <div className='flex justify-between items-center px-4 py-2 border-b'>
            <div className='flex items-center gap-2'>
              <Tabs
                value={view}
                onValueChange={(v) => handleViewChange(v as ViewType)}
              >
                <TabsList>
                  <TabsTrigger value='day'>Day</TabsTrigger>
                  <TabsTrigger value='week'>Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className='flex items-center gap-2 '>
              <TimeZoneSelector
                value={settings.timeZone}
                onChange={(tz) => setSettings({ ...settings, timeZone: tz })}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsSettingsDialogOpen(true)}
              >
                <Settings className='h-4 w-4 mr-2' />
                Settings
              </Button>
            </div>
          </div>
        )}

        <div className='flex-1 overflow-auto'>
          {view === 'day' && (
            <CalendarDayView
              date={currentDate}
              events={events}
              settings={settings}
              onEventSelect={handleEventSelect}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          )}

          {view === 'week' && (
            <CalendarWeekView
              date={currentDate}
              events={events}
              settings={settings}
              onEventSelect={handleEventSelect}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          )}
        </div>
      </div>

      {/* <EventDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        event={selectedEvent}
        timeSlot={selectedTimeSlot}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        settings={settings}
      /> */}

      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        settings={settings}
        onSave={handleSettingsSave}
      />
    </Card>
  );
}
