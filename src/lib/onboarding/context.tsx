"use client";

import * as React from "react";
import type { OnboardingState, OnboardingStepId } from "./types";
import {
  defaultOnboardingState,
  loadOnboardingState,
  saveOnboardingState,
  clearOnboardingState,
} from "./storage";
import { getNextStep, STEP_ORDER } from "./types";

type OnboardingContextValue = {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  completeStep: (step: OnboardingStepId) => void;
  skipStep: (step: OnboardingStepId) => void;
  goToStep: (step: OnboardingStepId) => void;
  reset: () => void;
  isHydrated: boolean;
};

const OnboardingContext = React.createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<OnboardingState>(defaultOnboardingState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(loadOnboardingState());
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (isHydrated) {
      saveOnboardingState(state);
    }
  }, [state, isHydrated]);

  const completeStep = React.useCallback((step: OnboardingStepId) => {
    setState((prev) => {
      const completed = prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step];
      const skipped = prev.skippedSteps.filter((s) => s !== step);
      const next = getNextStep(step);
      return {
        ...prev,
        completedSteps: completed,
        skippedSteps: skipped,
        currentStep: next ?? step,
      };
    });
  }, []);

  const skipStep = React.useCallback((step: OnboardingStepId) => {
    setState((prev) => {
      const skipped = prev.skippedSteps.includes(step)
        ? prev.skippedSteps
        : [...prev.skippedSteps, step];
      const completed = prev.completedSteps.filter((s) => s !== step);
      const next = getNextStep(step);
      return {
        ...prev,
        skippedSteps: skipped,
        completedSteps: completed,
        currentStep: next ?? step,
      };
    });
  }, []);

  const goToStep = React.useCallback((step: OnboardingStepId) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const reset = React.useCallback(() => {
    clearOnboardingState();
    setState(defaultOnboardingState);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{ state, setState, completeStep, skipStep, goToStep, reset, isHydrated }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}

export function useStepProgress() {
  const { state } = useOnboarding();
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);
  return {
    currentIndex,
    total: STEP_ORDER.length,
    completed: state.completedSteps,
    skipped: state.skippedSteps,
    isComplete: (id: OnboardingStepId) => state.completedSteps.includes(id),
    isSkipped: (id: OnboardingStepId) => state.skippedSteps.includes(id),
  };
}
