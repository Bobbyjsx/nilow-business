import { useUpdateBusiness } from '@/app/api/business';
import { UserStatus } from '@/app/api/me';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { getServerError } from '@/lib/https';
import { useSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { timeToLiveOptions, TimeToLiveType } from './constants';

type TimeToLiveFormProps = {
  onSubmit: () => void;
};

type TimeToLiveFormValues = {
  time: TimeToLiveType;
};

export const TimeToLiveForm = ({ onSubmit }: TimeToLiveFormProps) => {
  const { update: updateSession, data: session } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TimeToLiveFormValues>();

  const { executeUpdateBusiness, isBusinessUpdateExecuting } = useUpdateBusiness();

  const onFormSubmit = (data: TimeToLiveFormValues) => {
    try {
      executeUpdateBusiness(
        {
          business: {
            when_to_live: Number(data.time),
          },
          is_complete: true,
        },
        {
          onSuccess: (data) => {
            const userStatus = data?.data?.data?.user?.status || UserStatus.NEW;
            const businessName = data?.data?.data?.business?.business_name;

            updateSession({
              ...session,
              user: {
                ...session?.user,
                isCompleted: true,
                businessName: businessName,
                status: userStatus,
                businessId: data?.data?.data?.business?._id,
              },
            });
            toast.success({ message: 'Profile created successfully' });
            onSubmit();
          },
          onError: (error) => {
            const errMsg = getServerError(error);
            toast.error({ message: errMsg });
            console.error(error);
          },
        },
      );
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <main>
      <section className='text-center my-4'>
        <h1 className='text-xl sm:text-2xl font-bold text-custom-black-700'>When do you want your profile to go live?</h1>
        <div className='text-sm text-muted-foreground mt-2'>You can choose when your profile will be visible to others.</div>
      </section>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
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
          isLoading={isSubmitting || isBusinessUpdateExecuting}
          disabled={isSubmitting || isBusinessUpdateExecuting}
          size='lg'
          className='w-full'
        >
          Save
        </Button>
      </form>
    </main>
  );
};
