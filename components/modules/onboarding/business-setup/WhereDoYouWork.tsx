import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { BusinessSetupFormValues } from './constants';

type Props = {
  onFormSubmit: () => void;
};

export default function WhereDoYouWork({ onFormSubmit }: Props) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<BusinessSetupFormValues>();

  const formValues = watch();

  const router = useRouter();
  const onSubmit: SubmitHandler<BusinessSetupFormValues> = (data) => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('physicalStore', formValues.physicalStore.toString());
      searchParams.append('homeService', formValues.homeService.toString());

      console.log(data);
      onFormSubmit?.();
      console.log('Form submitted successfully');
      router.push(`/onboarding/location?${searchParams.toString()}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className='flex flex-col justify-center items-center  w-full'>
      <h1 className='text-2xl font-bold text-custom-black-700'>Where Do You Work, {formValues.yourName}?</h1>
      <p className='text-custom-black-300 text-sm mt-4 mb-14'>Do your clients come to you, do you go to them, or both?</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=' w-full space-y-7'
      >
        <Controller
          name='physicalStore'
          control={control}
          render={({ field }) => (
            <div className='items-top flex space-x-2'>
              <Checkbox
                id='physicalStore'
                checked={field.value}
                onCheckedChange={field.onChange}
                className='size-6'
              />
              <div className='grid gap-1.5 leading-none'>
                <label
                  htmlFor='terms1'
                  className='text-lg text-custom-black-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  At my place
                </label>
                <p className='text-sm text-custom-black-300'>
                  My clients come to me. I own the place or work from a salon/suite alongside other professionals.
                </p>
              </div>
            </div>
          )}
        />
        <Separator />

        <Controller
          name='homeService'
          control={control}
          render={({ field }) => (
            <div className='items-top flex space-x-2'>
              <Checkbox
                id='homeService'
                checked={field.value}
                onCheckedChange={field.onChange}
                className=' size-6'
              />
              <div className='grid gap-1.5 leading-none'>
                <label
                  htmlFor='terms1'
                  className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  At the client's location
                </label>
                <p className='text-sm text-custom-black-300'>I'm on the go, my services are performed at the clients location.'</p>
              </div>
            </div>
          )}
        />
        <Button
          type='submit'
          className='w-full mt-5'
          size={'lg'}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Continue
        </Button>
      </form>
    </main>
  );
}
