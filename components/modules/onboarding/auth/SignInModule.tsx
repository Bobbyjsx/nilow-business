'use client';
import { useSendOtp, useVerifyOtp, VerifyOtp } from '@/app/api/auth';
import { signIn } from '@/app/auth';
import { FadeIn } from '@/components/common/fade-in';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { authenticate } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, Info, Mail } from 'lucide-react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email').min(2, 'Email is too short').max(100, 'Email is too long'),
});

const otpSchema = z.object({
  email: z.string().email('Please enter a valid email').min(2).max(100),
  otp: z.string().length(4, { message: 'OTP must be 4 digits' }),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

const RESEND_COOLDOWN = 60; // 60 seconds

const SignInModule = () => {
  // State management
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const router = useRouter();

  // API hooks
  const { executeSendOtp, isSendOtpExecuting } = useSendOtp();
  const [state, formAction, pending] = useActionState(authenticate, { status: 0, message: '' });

  // Form management
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (lastSentTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - lastSentTime.getTime()) / 1000);
        const remaining = Math.max(0, RESEND_COOLDOWN - diffSeconds);

        setCooldownRemaining(remaining);

        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lastSentTime]);

  // Handler functions
  const sendOtp = async (data: EmailFormData) => {
    try {
      const res = await executeSendOtp({ email: data.email });
      if (!res.status) throw new Error(res?.response?.message || res.message);

      setEmail(data.email);
      setStep('otp');
      setLastSentTime(new Date());
      setCooldownRemaining(RESEND_COOLDOWN);
      otpForm.setValue('email', data.email);
      toast.success({
        message: res.message,
      });
    } catch (error: any) {
      if (isRedirectError(error)) return;
      toast.error({
        message: error?.response?.data?.response?.message || error?.message || 'Failed to send code',
      });
      console.error('Failed to send OTP:', error);
    }
  };

  const verifyOtp = async (data: VerifyOtp) => {
    try {
      const authFormData = new FormData();
      authFormData.append('email', email);
      authFormData.append('password', data.otp);

      formAction(authFormData);
      //
      // const res = await signInUser({ email, password: data.otp });
      // console.log('res', res);
    } catch (error: any) {
      console.log('err', error);
      if (isRedirectError(error)) return;
      toast.error({
        title: 'Error',
        message: error?.response?.data?.response?.message || error?.message || 'Failed to verify OTP',
      });
      console.error('Failed to verify OTP:', error);
    }
  };

  useEffect(() => {
    if (!pending && state?.status) {
      if (state.status !== 200) {
        toast.error({ message: state.message || 'Something went wrong' });
      } else {
        toast.success({ message: 'Success' });
        router.push('/dashboard');
      }
    }
  }, [state?.status, pending]);
  const handleResendCode = () => {
    if (cooldownRemaining > 0) return;
    sendOtp({ email });
  };

  const handleChangeEmail = () => {
    setStep('email');
    emailForm.setValue('email', email);
  };

  // Render helpers
  const renderEmailForm = () => (
    <form
      onSubmit={emailForm.handleSubmit(sendOtp)}
      className='space-y-6'
    >
      <Controller
        name='email'
        control={emailForm.control}
        render={({ field }) => (
          <FloatingLabelInput
            {...field}
            label='Email'
            placeholder='Enter your email'
            error={emailForm.formState.errors.email?.message}
          />
        )}
      />

      <Button
        type='submit'
        disabled={emailForm.formState.isSubmitting || isSendOtpExecuting}
        size='lg'
        className='w-full bg-custom-black-500 text-white'
        isLoading={emailForm.formState.isSubmitting || isSendOtpExecuting}
        leftNode={<Mail size={18} />}
      >
        Send Verification Code
      </Button>
    </form>
  );

  const renderOtpForm = () => (
    <form
      onSubmit={otpForm.handleSubmit(verifyOtp)}
      className='space-y-6'
    >
      {/* Email Sent Banner */}
      <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-start'>
        <CheckCircle2
          className='text-green-500 mr-3 mt-0.5 flex-shrink-0'
          size={18}
        />
        <div>
          <h3 className='font-medium text-green-800 text-sm'>Verification code sent!</h3>
          <p className='text-sm text-green-700 mt-1'>
            We've sent a 4-digit verification code to <span className='font-medium'>{email}</span>. Please check your inbox and spam folder.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-y-4'>
        <Controller
          name='otp'
          control={otpForm.control}
          render={({ field }) => (
            <div className='flex flex-col items-center'>
              <label className='text-sm font-medium text-custom-black-700 mb-2'>Enter verification code</label>
              <Input
                {...field}
                className='text-center text-2xl tracking-widest w-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-black-500'
                maxLength={4}
                placeholder='0000'
                inputMode='numeric'
                pattern='[0-9]*'
                error={otpForm?.formState?.errors?.otp?.message}
              />
              {otpForm?.formState?.errors?.otp?.message && <p className='text-red-500 text-xs mt-1'>{otpForm.formState.errors.otp.message}</p>}
            </div>
          )}
        />

        <div className='text-center mt-4 flex flex-col items-center gap-2'>
          <div className='flex items-center gap-3 text-sm'>
            <button
              type='button'
              onClick={handleChangeEmail}
              className='text-custom-black-500 hover:underline focus:outline-none focus:ring-2 focus:ring-custom-black-500 focus:ring-offset-2 rounded'
            >
              Change email
            </button>
            <span className='text-gray-400'>•</span>
            <button
              type='button'
              onClick={handleResendCode}
              disabled={cooldownRemaining > 0 || isSendOtpExecuting}
              className={`focus:outline-none focus:ring-2 focus:ring-custom-black-500 focus:ring-offset-2 rounded ${
                cooldownRemaining > 0 || isSendOtpExecuting ? 'text-gray-400 cursor-not-allowed' : 'text-custom-black-500 hover:underline'
              }`}
            >
              {cooldownRemaining > 0 ? `Resend code (${cooldownRemaining}s)` : 'Resend code'}
            </button>
          </div>

          {cooldownRemaining > 0 && (
            <div className='flex items-center text-xs text-gray-500 mt-1'>
              <Info
                size={12}
                className='mr-1'
              />
              You can request a new code after the cooldown period
            </div>
          )}
        </div>
      </div>

      <Button
        type='submit'
        disabled={otpForm.formState.isSubmitting || !otpForm.watch('otp') || otpForm.watch('otp').length !== 4}
        size='lg'
        className='w-full bg-custom-black-500 text-white mt-6'
        isLoading={otpForm.formState.isSubmitting}
        rightNode={<ArrowRight size={18} />}
      >
        Continue
      </Button>
    </form>
  );

  return (
    <FadeIn duration={10}>
      <div className='w-full'>
        <h1 className='text-2xl font-bold text-center mb-8 text-custom-black-700'>Welcome Back</h1>
        {step === 'email' ? renderEmailForm() : renderOtpForm()}
      </div>
    </FadeIn>
  );
};

export default SignInModule;
