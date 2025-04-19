import OnboardingLayout from '@/layouts/OnboardingLayout';
import '../globals.css';

export default function OnboardingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
