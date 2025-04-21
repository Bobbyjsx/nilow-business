import OnboardingLayout from '@/layouts/OnboardingLayout';
import { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login or register to access your account and manage your business',
};

export default function OnboardingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
