'use client';
import { UpdateBusinessPayload, useUpdateBusiness } from '@/app/api/business';
import { useValidatePhone, useValidateUsername } from '@/app/api/validate';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { CustomPhoneInput } from '@/components/ui/phone-input';
import { useEffect, useRef } from 'react';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { BusinessSetupFormValues } from './constants';

type Props = {
  onFormSubmit: (data: Partial<UpdateBusinessPayload>) => void;
};

export default function AboutYou({ onFormSubmit }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    trigger,
  } = useFormContext<BusinessSetupFormValues>();

  const { executeValidatePhone, isValidatePhoneExecuting, isPhoneValidated, resetPhoneValidation, phoneValidationMessage } = useValidatePhone();

  const { executeValidateName, isValidateNameExecuting, isNameValidated, resetNameValidation, nameValidationMessage } = useValidateUsername();

  const { executeUpdateBusiness, isBusinessUpdateExecuting } = useUpdateBusiness();

  const businessName = watch('businessName');
  const phoneNumber = watch('phoneNumber');

  const prevBusinessName = useRef('');
  const prevPhoneNumber = useRef('');

  // Reset remote validation state when value changes
  useEffect(() => {
    if (isNameValidated && businessName !== prevBusinessName.current) {
      resetNameValidation();
      clearErrors('businessName');
    }
    prevBusinessName.current = businessName;
  }, [businessName, isNameValidated, resetNameValidation, clearErrors]);

  useEffect(() => {
    if (isPhoneValidated && phoneNumber !== prevPhoneNumber.current) {
      resetPhoneValidation();
      clearErrors('phoneNumber');
    }
    prevPhoneNumber.current = phoneNumber;
  }, [phoneNumber, isPhoneValidated, resetPhoneValidation, clearErrors]);

  const validateFields = async (): Promise<boolean> => {
    // run built-in validation
    const isLocalValid = await trigger(['businessName', 'phoneNumber']);
    if (!isLocalValid) return false;

    let isValid = true;

    try {
      // Business name uniqueness
      if (businessName) {
        const validName = await executeValidateName(businessName);
        if (!validName) {
          setError('businessName', {
            type: 'validate',
            message: nameValidationMessage || 'Business name already exists',
          });
          isValid = false;
        } else {
          clearErrors('businessName');
        }
      }

      // Phone number validity
      if (phoneNumber) {
        const validPhone = await executeValidatePhone(phoneNumber);
        if (!validPhone) {
          setError('phoneNumber', {
            type: 'validate',
            message: phoneValidationMessage || 'Invalid phone number',
          });
          isValid = false;
        } else {
          clearErrors('phoneNumber');
        }
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      isValid = false;
    }

    return isValid;
  };

  const onSubmit: SubmitHandler<BusinessSetupFormValues> = async (data) => {
    const valid = await validateFields();
    if (!valid) return;

    const payload: Partial<UpdateBusinessPayload> = {
      business: { business_name: data.businessName },
      user: { username: data.yourName, phone_number: data.phoneNumber, device_token: '' },
    };

    try {
      await executeUpdateBusiness(payload);
      onFormSubmit(payload);
    } catch (err) {
      console.error('Failed to update business:', err);
    }
  };

  // Only allow continue when remote checks passed and not in progress
  const canContinue = !isValidateNameExecuting && !isValidatePhoneExecuting && isNameValidated && isPhoneValidated;

  return (
    <main className='flex flex-col justify-center items-center w-full'>
      <h1 className='text-2xl font-bold text-custom-black-700'>About You</h1>
      <p className='text-custom-black-300 text-sm mt-4 mb-7'>Tell us more about you and your business.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full space-y-4'
      >
        <Controller
          name='businessName'
          control={control}
          rules={{
            required: 'Business name is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          }}
          render={({ field }) => (
            <FloatingLabelInput
              label='Business Name'
              error={errors.businessName?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='yourName'
          control={control}
          rules={{
            required: 'Your name is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          }}
          render={({ field }) => (
            <FloatingLabelInput
              label='Your Name'
              error={errors.yourName?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='phoneNumber'
          control={control}
          rules={{ required: 'Phone number is required' }}
          render={({ field }) => (
            <CustomPhoneInput
              label='Phone Number'
              error={errors.phoneNumber?.message}
              className='!h-12'
              {...field}
            />
          )}
        />

        {!canContinue && (
          <Button
            type='button'
            onClick={validateFields}
            disabled={isValidateNameExecuting || isValidatePhoneExecuting || !businessName || !phoneNumber}
            className='w-full mt-5'
          >
            {isValidateNameExecuting || isValidatePhoneExecuting ? 'Verifying...' : 'Verify'}
          </Button>
        )}

        {canContinue && (
          <Button
            type='submit'
            className='w-full mt-5'
            size='lg'
            disabled={isBusinessUpdateExecuting}
            isLoading={isBusinessUpdateExecuting}
          >
            {isBusinessUpdateExecuting ? 'Saving...' : 'Continue'}
          </Button>
        )}
      </form>
    </main>
  );
}
