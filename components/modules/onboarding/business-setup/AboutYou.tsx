import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { CustomPhoneInput } from '@/components/ui/phone-input';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { BusinessSetupFormValues } from './constants';

type Props = {
  onFormSubmit: () => void;
};

export default function AboutYou({ onFormSubmit }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext<BusinessSetupFormValues>();

  console.log(errors);
  const onSubmit: SubmitHandler<BusinessSetupFormValues> = (data) => {
    console.log(data);
    onFormSubmit?.();
  };

  return (
    <main className='flex flex-col justify-center items-center w-full'>
      <h1 className='text-2xl font-bold text-custom-black-700'>About You </h1>
      <p className='text-custom-black-300 text-sm mt-4 mb-7'>Tell us more about you and your business.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=' w-full space-y-4'
      >
        <Controller
          name='businessName'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Business Name'
              error={errors?.businessName?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='yourName'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Your Name'
              error={errors?.yourName?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='phoneNumber'
          control={control}
          render={({ field }) => (
            <CustomPhoneInput
              label='Phone Number'
              error={errors?.phoneNumber?.message}
              className='!h-12'
              {...field}
            />
          )}
        />
        <Button
          type='submit'
          className='w-full mt-5'
          size={'lg'}
        >
          Continue
        </Button>
      </form>
    </main>
  );
}
