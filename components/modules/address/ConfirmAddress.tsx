import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { StoreLocationFormValues } from '../onboarding/location/constants';
import { StateSelect } from './StateInput';

interface Props {
  onReset: () => void;
  onFormSubmit: () => void;
}

const ConfirmAddress = ({ onReset, onFormSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<StoreLocationFormValues>();

  const formValues = watch();

  const onSubmit: SubmitHandler<StoreLocationFormValues> = (data) => {
    console.log(data);
    onFormSubmit();
  };

  return (
    <div className='flex flex-col justify-start items-center w-full h-full min-h-[60vh]'>
      <section className='w-full flex flex-col justify-between items-center gap-y-8'>
        <h1 className='text-2xl font-bold text-custom-black-700'>Confirm Your Address</h1>
        <p className='text-custom-black-300 text-sm mb-7'>Where can clients find you?</p>
      </section>

      <form
        className='w-full flex flex-col gap-y-6'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name='street'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Street address 1'
              {...field}
              error={errors?.street?.message}
              placeholder='Enter your address'
            />
          )}
        />
        <Controller
          name='street1'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Street address 2'
              {...field}
              error={errors?.street1?.message}
              placeholder='Enter your address'
            />
          )}
        />

        <Controller
          name='city'
          control={control}
          render={({ field }) => (
            <StateSelect
              label='City'
              {...field}
              error={errors?.city?.message}
            />
          )}
        />

        <Controller
          name='zipCode'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Zip Code'
              {...field}
              error={errors?.zipCode?.message}
              placeholder='Enter your zip code'
            />
          )}
        />

        {/* <div className='flex justify-between items-start'>
          <Controller
            name='isSharedLocation'
            control={control}
            render={({ field }) => (
              <Checkbox
                className='size-5 mt-1'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className='grid gap-1.5 leading-none w-11/12'>
            <label
              htmlFor='terms1'
              className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              This is a shared location
            </label>
            <p className='text-sm text-custom-black-300'>Check the box if other business owners work from here too.</p>
          </div>
        </div> */}

        {formValues.isSharedLocation && (
          <>
            <Controller
              name='sharedLocationName'
              control={control}
              render={({ field }) => (
                <FloatingLabelInput
                  label='Shared Location Name'
                  {...field}
                  error={errors?.sharedLocationName?.message?.toString()}
                  placeholder='Enter shared location name'
                />
              )}
            />

            <Controller
              name='sharedLocationSuiteNumber'
              control={control}
              render={({ field }) => (
                <FloatingLabelInput
                  label='Shared Location Suite Number'
                  {...field}
                  error={errors?.sharedLocationSuiteNumber?.message}
                  optional
                  placeholder='Enter shared location suite number (optional)'
                />
              )}
            />
          </>
        )}
        <Button
          type='submit'
          size='lg'
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Continue
        </Button>
      </form>
      <Button
        type='button'
        onClick={onReset}
        variant={'outline'}
        className='text-destructive mt-2 w-full hover:text-destructive'
        size={'lg'}
      >
        Reset
      </Button>
    </div>
  );
};

export default ConfirmAddress;
