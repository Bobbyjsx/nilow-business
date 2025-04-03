'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TimeZoneSelector } from './time-zone-selector';
import { CalendarSettings } from './types';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: CalendarSettings;
  onSave: (settings: CalendarSettings) => void;
}

export function SettingsDialog({ open, onOpenChange, settings, onSave }: SettingsDialogProps) {
  // Define form schema
  const formSchema = z.object({
    startHour: z.number().min(0).max(23),
    endHour: z.number().min(1).max(24),
    timeZone: z.string(),
    dateFormat: z.string(),
    timeFormat: z.string(),
    disabledDays: z.array(z.number()),
    workWeek: z.array(z.number()),
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startHour: settings.startHour,
      endHour: settings.endHour,
      timeZone: settings.timeZone,
      dateFormat: settings.dateFormat,
      timeFormat: settings.timeFormat,
      disabledDays: settings.disabledDays,
      workWeek: settings.workWeek,
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      ...settings,
      ...data,
    });
  };

  const weekdays = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Calendar Settings</DialogTitle>
          <DialogDescription>Customize your calendar view and preferences.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Time Range</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='startHour'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Hour</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          max={23}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>First hour to display (0-23)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='endHour'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Hour</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          max={24}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Last hour to display (1-24)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Localization</h3>
              <FormField
                control={form.control}
                name='timeZone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <FormControl>
                      <TimeZoneSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='dateFormat'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Format</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>e.g., &quot;MMMM dd, yyyy&quot;</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='timeFormat'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Format</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>e.g., &quot;h:mm a&quot; or &quot;HH:mm&quot;</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Work Week</h3>
              <FormField
                control={form.control}
                name='workWeek'
                render={() => (
                  <FormItem>
                    <div className='mb-4'>
                      <FormLabel>Working Days</FormLabel>
                      <FormDescription>Select the days that make up your work week</FormDescription>
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                      {weekdays.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name='workWeek'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className='flex flex-row items-start space-x-3 space-y-0'
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.value])
                                        : field.onChange(field.value?.filter((value) => value !== day.value));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className='font-normal'>{day.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Disabled Days</h3>
              <FormField
                control={form.control}
                name='disabledDays'
                render={() => (
                  <FormItem>
                    <div className='mb-4'>
                      <FormLabel>Disabled Days</FormLabel>
                      <FormDescription>Select days that should be disabled for scheduling</FormDescription>
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                      {weekdays.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name='disabledDays'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className='flex flex-row items-start space-x-3 space-y-0'
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.value])
                                        : field.onChange(field.value?.filter((value) => value !== day.value));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className='font-normal'>{day.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
