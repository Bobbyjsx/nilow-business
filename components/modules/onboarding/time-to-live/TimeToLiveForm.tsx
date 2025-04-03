import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select';
import { Controller, useForm } from 'react-hook-form';
import { timeToLiveOptions, TimeToLiveType } from './constants';

type TimeToLiveFormProps = {
  onSubmit: () => void;
};

type TimeToLiveFormValues = {
  time: TimeToLiveType;
};

export const TimeToLiveForm = ({ onSubmit }: TimeToLiveFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TimeToLiveFormValues>();

  return (
    <main>
      <section className='text-center my-4'>
        <h1 className='text-xl sm:text-2xl font-bold text-custom-black-700'>When do you want your profile to go live?</h1>
        <div className='text-sm text-muted-foreground mt-2'>You can choose when your profile will be visible to others.</div>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-10 space-y-5'
      >
        <Controller
          name='time'
          control={control}
          render={({ field }) => (
            <CustomSelect
              label='Make my profile live'
              error={errors.time?.message}
              options={timeToLiveOptions}
              {...field}
            />
          )}
        />

        <Button
          type='submit'
          isLoading={isSubmitting}
          size='lg'
          className='w-full'
        >
          Save
        </Button>
      </form>
    </main>
  );
};
