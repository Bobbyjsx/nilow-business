'use client';
import { FadeIn } from '@/components/common/fade-in';
import { PasswordInput } from '@/components/common/password-input';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().min(2).max(100),
  password: z.string().min(6).max(100),
});
type SignInFormValues = z.infer<typeof schema>;

const SignInModule = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <FadeIn duration={10}>
      <div className='w-full'>
        <h1 className='text-lg font-bold text-center mb-8 text-custom-black-700'>Welcome Back</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='flex flex-col gap-y-6'>
            <FloatingLabelInput
              placeholder='Enter your email'
              label='Email'
              type='email'
              {...register('email')}
              error={errors?.email?.message}
            />{' '}
            <PasswordInput
              placeholder='Enter your password'
              label='Password'
              {...register('password')}
              error={errors?.password?.message}
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
            Log In With Email
          </Button>
        </form>

        <div className='w-full mx-auto text-center mt-3'>
          <Link
            href='/auth/forgot-password'
            className='font-bold text-custom-black-900 underline underline-offset-4'
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </FadeIn>
  );
};

export default SignInModule;
