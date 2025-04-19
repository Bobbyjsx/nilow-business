'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BusinessHoursFormValues, BusinessHoursSchema, DAYS_OF_THE_WEEK, DEFAULT_HOURS } from './constant';
import { EditBusinessModal } from './EditBusinessModal';
import { useUpdateBusiness } from '@/app/api/business';
import { getServerError } from '@/lib/https';
import { toast } from '@/components/ui/toast';

type BusinessHoursFormProps = {
  onSubmitForm: () => void;
};

export const BusinessHoursForm = ({ onSubmitForm }: BusinessHoursFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dayEdit, setDayEdit] = useState<keyof BusinessHoursFormValues>('sunday');
  const form = useForm<BusinessHoursFormValues>({
    resolver: zodResolver(BusinessHoursSchema),
    defaultValues: {
      monday: {
        open: true,
        hours: DEFAULT_HOURS,
      },
      tuesday: {
        open: true,
        hours: DEFAULT_HOURS,
      },
      wednesday: {
        open: true,
        hours: DEFAULT_HOURS,
      },
      thursday: {
        open: true,
        hours: DEFAULT_HOURS,
      },
      friday: {
        open: true,
        hours: DEFAULT_HOURS,
      },
      saturday: {
        open: false,
        hours: DEFAULT_HOURS,
      },
      sunday: {
        open: false,
        hours: DEFAULT_HOURS,
      },
    },
  });
  const formValues = form.watch();
  const { executeUpdateBusiness, isBusinessUpdateExecuting } = useUpdateBusiness();

  const onSubmit = (data: BusinessHoursFormValues) => {
    try {
      executeUpdateBusiness(
        {
          business: {
            business_hours: data as any,
          },
        },
        {
          onSuccess: () => {
            onSubmitForm();
            console.log(data);
          },
          onError: (error) => {
            const errMsg = getServerError(error);
            toast.error({ message: errMsg });
            console.error(error);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (day: keyof BusinessHoursFormValues) => {
    setIsOpen(true);
    setDayEdit(day);
  };

  return (
    <div className='flex flex-col justify-start items-center w-full h-full gap-y-10 min-h-[60vh]'>
      <section className='w-full flex flex-col justify-between items-center gap-y-8'>
        <h1 className='text-2xl font-bold text-custom-black-700'>Your Business Hours</h1>
        <p className='text-custom-black-300 text-sm mb-7'>When can clients book with you?</p>
      </section>

      <Form {...form}>
        <form
          className='w-full flex flex-col justify-between items-center gap-y-8'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {DAYS_OF_THE_WEEK.map((day) => {
            return (
              <FormField
                key={day}
                control={form.control}
                name={`${day}.open` as keyof BusinessHoursFormValues}
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl className='w-full'>
                      <div className='flex items-center justify-between space-x-4'>
                        <section className='flex items-center space-x-4'>
                          <Switch
                            checked={field.value as any}
                            onCheckedChange={field.onChange}
                            id={day}
                            size='2xl'
                          />
                          <Label
                            htmlFor={day}
                            className='text-base'
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Label>
                        </section>

                        <section
                          className={classNames('w-1/2 flex justify-between', {
                            'cursor-pointer': field.value,
                          })}
                          onClick={() => (field.value ? handleOpenModal(day as keyof BusinessHoursFormValues) : null)}
                        >
                          <div className='flex items-center space-x-4 text-sm font-light '>
                            {field.value
                              ? `${formValues[day as keyof BusinessHoursFormValues]?.hours?.open} - ${formValues[day as keyof BusinessHoursFormValues]?.hours?.close}`
                              : 'Closed'}
                          </div>

                          {field.value && <ChevronRight className='text-custom-black-300 font-light size-5 stroke-1' />}
                        </section>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            );
          })}

          <Button
            type='submit'
            className='w-full'
            disabled={isBusinessUpdateExecuting}
            isLoading={isBusinessUpdateExecuting}
          >
            Continue
          </Button>
        </form>
      </Form>

      <FormProvider {...form}>
        <EditBusinessModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          dayEdit={dayEdit}
        />
      </FormProvider>
    </div>
  );
};
