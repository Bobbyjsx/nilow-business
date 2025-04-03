import { FadeIn } from '../../common/fade-in';

export default function OnboardingWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <FadeIn className={`bg-white py-10 rounded-md shadow px-3 w-full max-w-full sm:max-w-lg ${className}`}>{children}</FadeIn>;
}
