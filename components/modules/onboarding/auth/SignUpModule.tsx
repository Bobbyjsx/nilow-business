'use client';
import { FadeIn } from '@/components/common/fade-in';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().min(2).max(100),
});

type SignUpFormData = z.infer<typeof schema>;

const SignUpModule = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    console.log(data);
    router.push('/onboarding/business-setup');
  };

  return (
    <FadeIn duration={10}>
      <div className='w-full'>
        <h1 className='text-lg font-bold text-center mb-8 text-custom-black-700'>Create an account</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='flex flex-col gap-y-6'>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <FloatingLabelInput
                  {...field}
                  label='Email'
                  placeholder='Enter your email'
                  error={errors.email?.message}
                />
              )}
            />
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            size={'lg'}
            className='w-full bg-custom-black-500 text-white'
            isLoading={isSubmitting}
            leftNode={<Mail />}
          >
            Continue With Email
          </Button>
        </form>
      </div>
    </FadeIn>
  );
};

export default SignUpModule;
