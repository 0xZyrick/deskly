export type OnboardingStepId =
  | "clinic"
  | "services"
  | "clinicians"
  | "hours"
  | "payments"
  | "reminders"
  | "go-live";

export interface OnboardingService {
  id: string;
  name: string;
  durationMinutes: number;
  priceMinor: number;
}

export interface OnboardingClinician {
  id: string;
  name: string;
  email: string;
  title?: string;
  invited: boolean;
  joined: boolean;
}

export interface OnboardingHours {
  [day: string]: { start: string; end: string }[] | "closed" | "skipped";
}

export interface OnboardingState {
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  skippedSteps: OnboardingStepId[];
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
    timezone: string;
  };
  services: OnboardingService[];
  clinicians: OnboardingClinician[];
  hours: OnboardingHours;
  payments: {
    currency: string;
    depositRequired: boolean;
    depositAmountMinor: number;
  };
  reminders: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    hoursBefore: number;
  };
  updatedAt: string;
}

export const ONBOARDING_STEPS: {
  id: OnboardingStepId;
  title: string;
  description: string;
  optional?: boolean;
}[] = [
  { id: "clinic", title: "Clinic details", description: "Name and contact" },
  { id: "services", title: "Services", description: "What you offer" },
  { id: "clinicians", title: "Clinicians", description: "Your team" },
  { id: "hours", title: "Opening hours", description: "When you are open", optional: true },
  { id: "payments", title: "Payments", description: "Deposits and currency" },
  { id: "reminders", title: "Reminders", description: "Patient notifications" },
  { id: "go-live", title: "Go live", description: "Final checklist" },
];

export const STEP_ORDER: OnboardingStepId[] = ONBOARDING_STEPS.map((s) => s.id);

export function getStepIndex(id: OnboardingStepId): number {
  return STEP_ORDER.indexOf(id);
}

export function getNextStep(id: OnboardingStepId): OnboardingStepId | null {
  const i = getStepIndex(id);
  return i < STEP_ORDER.length - 1 ? STEP_ORDER[i + 1] : null;
}

export function getPrevStep(id: OnboardingStepId): OnboardingStepId | null {
  const i = getStepIndex(id);
  return i > 0 ? STEP_ORDER[i - 1] : null;
}
