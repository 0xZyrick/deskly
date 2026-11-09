"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding/context";
import { FullPageLoader } from "@/components/ui";

export default function OnboardingIndexPage() {
  const router = useRouter();
  const { state, isHydrated } = useOnboarding();

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(`/onboarding/${state.currentStep}`);
  }, [isHydrated, state.currentStep, router]);

  return <FullPageLoader label="Opening your setup…" />;
}
