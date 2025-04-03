import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { CustomSelect } from '@/components/ui/select';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { addFiveMinutes, BusinessHoursFormValues, formatTo12Hour, generateTimeOptions, hoursOptions, parseTime } from './constant';

type EditBusinessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dayEdit: keyof BusinessHoursFormValues;
};

type BreakTime = {
  start: string;
  end: string;
};

// Validation schema for break times
const breakTimeSchema = z.object({
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
});

export const EditBusinessModal = ({ isOpen, onClose, dayEdit }: EditBusinessModalProps) => {
  const { control, watch, setValue, setError, clearErrors, trigger, reset, handleSubmit } = useFormContext<BusinessHoursFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${dayEdit}.hours.breaks` as const,
  });

  const handleOnCancel = () => {
    onClose();
    reset();
  };

  const [previousBusinessHours, setPreviousBusinessHours] = useState<{
    open: string;
    close: string;
  }>({ open: '', close: '' });

  const selectedBreaks = watch(`${dayEdit}.hours.breaks`) as BreakTime[];
  const businessOpen = watch(`${dayEdit}.hours.open`);
  const businessClose = watch(`${dayEdit}.hours.close`);

  // Check if all breaks are valid
  const areAllBreaksValid = () => {
    if (!selectedBreaks || selectedBreaks.length === 0) return true;

    return selectedBreaks.every((breakItem) => {
      const result = breakTimeSchema.safeParse(breakItem);
      return result.success;
    });
  };

  // Determine if adding a new break is allowed
  const canAddBreak = businessOpen && businessClose && areAllBreaksValid();

  // Validate a single break time
  const validateBreakTime = (index: number) => {
    const fieldPathStart = `${dayEdit}.hours.breaks.${index}.start` as const;
    const fieldPathEnd = `${dayEdit}.hours.breaks.${index}.end` as const;

    const breakStart = watch(fieldPathStart);
    const breakEnd = watch(fieldPathEnd);
    let hasError = false;

    if (breakStart && businessOpen && businessClose) {
      // Check if breakStart is outside new business hours
      if (parseTime(breakStart) < parseTime(businessOpen) || parseTime(breakStart) >= parseTime(businessClose)) {
        setError(fieldPathStart, {
          type: 'manual',
          message: 'Conflict with hours',
        });
        // Set the same error for end time when start time is invalid
        setError(fieldPathEnd, {
          type: 'manual',
          message: 'Conflict with hours',
        });
        hasError = true;
      } else {
        clearErrors(fieldPathStart);
      }
    }

    if (breakEnd && businessOpen && businessClose && !hasError) {
      // Check if breakEnd is outside new business hours
      if (parseTime(breakEnd) <= parseTime(businessOpen) || parseTime(breakEnd) > parseTime(businessClose)) {
        setError(fieldPathEnd, {
          type: 'manual',
          message: 'Conflict with hours',
        });
      } else {
        clearErrors(fieldPathEnd);
      }
    } else if (!hasError) {
      clearErrors(fieldPathEnd);
    }
  };

  // Check if breaks are still valid after business hours change
  useEffect(() => {
    if (previousBusinessHours.open !== businessOpen || previousBusinessHours.close !== businessClose) {
      // Update business hours state for future comparisons
      setPreviousBusinessHours({ open: businessOpen, close: businessClose });

      // Validate each break
      fields.forEach((_, index) => {
        validateBreakTime(index);
      });
    }
  }, [businessOpen, businessClose, fields, dayEdit, watch, setError, clearErrors, previousBusinessHours]);

  // Watch for changes in break times to revalidate
  useEffect(() => {
    fields.forEach((_, index) => {
      const fieldPathStart = `${dayEdit}.hours.breaks.${index}.start` as const;
      const fieldPathEnd = `${dayEdit}.hours.breaks.${index}.end` as const;

      // Trigger validation when break times change
      watch(fieldPathStart);
      watch(fieldPathEnd);
      validateBreakTime(index);
      // Trigger revalidation to ensure we don't have stale errors
      trigger(fieldPathStart);
      trigger(fieldPathEnd);
    });
  }, [watch(`${dayEdit}.hours.breaks`), trigger, fields, dayEdit]);

  // Auto-set end time when start time is selected
  useEffect(() => {
    fields.forEach((_, index) => {
      const fieldPathStart = `${dayEdit}.hours.breaks.${index}.start` as const;
      const fieldPathEnd = `${dayEdit}.hours.breaks.${index}.end` as const;

      const startValue = watch(fieldPathStart);
      const endValue = watch(fieldPathEnd);

      if (startValue && (!endValue || endValue === '')) {
        setValue(fieldPathEnd, addFiveMinutes(startValue));
        // Trigger validation after setting a new value
        trigger(fieldPathEnd);
      }
    });
  }, [fields, watch, setValue, dayEdit, trigger]);

  const onSubmit: SubmitHandler<BusinessHoursFormValues> = (data) => {
    console.log(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCancelButton={false}
      modalContainerClassName='h-full max-h-[60vh] sm:w-[600px] w-full flex flex-col justify-between overflow-y-auto'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <section className='w-full flex items-start'>
          <div className='flex gap-x-5 items-center'>
            <ArrowLeft
              className='stroke-[1.5] text-custom-black-400 cursor-pointer'
              onClick={onClose}
            />
            <h2 className='text-2xl font-bold'>{capitalizeFirstLetter(dayEdit)}</h2>
          </div>
        </section>

        <section className='w-full flex items-start'>
          <p className='text-sm text-gray-500'>Update your business hours for a single day.</p>
        </section>

        <section className='w-full flex gap-x-4 items-center'>
          <p className='w-full'>Opening Hours</p>
          <Controller
            name={`${dayEdit}.hours.open`}
            control={control}
            render={({ field, fieldState }) => (
              <CustomSelect
                options={hoursOptions.map((opt) => ({
                  ...opt,
                  label: formatTo12Hour(opt.value),
                }))}
                {...field}
                placeholder='Select'
                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name={`${dayEdit}.hours.close`}
            control={control}
            render={({ field, fieldState }) => (
              <CustomSelect
                options={hoursOptions.map((opt) => ({
                  ...opt,
                  label: formatTo12Hour(opt.value),
                }))}
                {...field}
                placeholder='Select'
                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                error={fieldState.error?.message}
              />
            )}
          />
        </section>

        <section className='w-full flex flex-col gap-2 mt-4'>
          {fields.length > 0 && <h3 className='text-md font-semibold'>Breaks</h3>}
          {fields.map((breakItem, index) => {
            const fieldPathStart = `${dayEdit}.hours.breaks.${index}.start` as const;
            const fieldPathEnd = `${dayEdit}.hours.breaks.${index}.end` as const;

            const startValue = watch(fieldPathStart);

            const allStartOptions = generateTimeOptions(businessOpen, businessClose);
            const availableStartOptions = allStartOptions.filter((opt) => !selectedBreaks?.some((b, i) => i !== index && b.start === opt.value));
            const availableEndOptions = startValue ? generateTimeOptions(addFiveMinutes(startValue), businessClose) : [];

            return (
              <div
                key={breakItem.id}
                className='flex flex-col gap-1'
              >
                <div className='flex gap-x-4 items-center'>
                  <Controller
                    name={fieldPathStart}
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomSelect
                        options={availableStartOptions}
                        {...field}
                        placeholder='Start'
                        className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name={fieldPathEnd}
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomSelect
                        options={availableEndOptions}
                        {...field}
                        disabled={!startValue}
                        placeholder='End'
                        className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Trash2
                    className='cursor-pointer text-red-500 h-10 w-10'
                    onClick={() => remove(index)}
                    size={20}
                  />
                </div>
              </div>
            );
          })}
          <Button
            variant='outline'
            className='mt-2'
            onClick={() => append({ start: '', end: '' })}
            type='button'
            disabled={!canAddBreak}
          >
            <PlusCircle
              className='mr-2'
              size={16}
            />{' '}
            Add Break
          </Button>
        </section>

        <section className='w-full flex justify-end mt-20 gap-x-3'>
          <Button
            variant='outline'
            className='w-20'
            size='lg'
            onClick={handleOnCancel}
            type='button'
          >
            Cancel
          </Button>
          <Button
            className='w-20 h-10'
            type='submit'
          >
            Save
          </Button>
        </section>
      </form>
    </Modal>
  );
};
