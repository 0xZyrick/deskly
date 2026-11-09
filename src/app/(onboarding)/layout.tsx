import { OnboardingProvider } from "@/lib/onboarding/context";

export default function OnboardingGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
