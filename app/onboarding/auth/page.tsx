import { AuthOptions } from '@/components/modules/onboarding/auth/AuthOptions';
import SignInModule from '@/components/modules/onboarding/auth/SignInModule';
import SignUpModule from '@/components/modules/onboarding/auth/SignUpModule';
import OnboardingWrapper from '@/components/modules/onboarding/OnboardingWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OnboardingAuthPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <OnboardingWrapper>
        <Tabs defaultValue='login'>
          <section className='w-full flex justify-center mb-6'>
            <TabsList className='w-[50%]'>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='signup'>Sign up</TabsTrigger>
            </TabsList>
          </section>
          <TabsContent value='login'>
            <SignInModule />
          </TabsContent>
          <TabsContent value='signup'>
            <SignUpModule />
          </TabsContent>
        </Tabs>

        <section className='flex relative max-w-full items-center gap-x-3 mt-3'>
          <div className='border-b w-1/2' />
          <p className='text-xs text-custom-black-400'>OR</p>
          <div className='border-b w-1/2' />
        </section>
        <section className='mt-7'>
          <AuthOptions />
        </section>
      </OnboardingWrapper>
    </div>
  );
};

export default OnboardingAuthPage;
