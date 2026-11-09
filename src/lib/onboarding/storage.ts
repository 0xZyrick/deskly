import type { OnboardingState } from "./types";

const STORAGE_KEY = "frontdesk_onboarding_v1";

export const defaultOnboardingState: OnboardingState = {
  currentStep: "clinic",
  completedSteps: [],
  skippedSteps: [],
  clinic: {
    name: "",
    address: "",
    phone: "",
    email: "",
    timezone: "Africa/Lagos",
  },
  services: [
    { id: "svc_1", name: "Initial consultation", durationMinutes: 30, priceMinor: 1500000 },
    { id: "svc_2", name: "Follow-up", durationMinutes: 15, priceMinor: 800000 },
  ],
  clinicians: [],
  hours: {
    monday: [{ start: "09:00", end: "17:00" }],
    tuesday: [{ start: "09:00", end: "17:00" }],
    wednesday: [{ start: "09:00", end: "17:00" }],
    thursday: [{ start: "09:00", end: "17:00" }],
    friday: [{ start: "09:00", end: "16:00" }],
    saturday: "closed",
    sunday: "closed",
  },
  payments: {
    currency: "NGN",
    depositRequired: true,
    depositAmountMinor: 500000,
  },
  reminders: {
    emailEnabled: true,
    smsEnabled: false,
    hoursBefore: 24,
  },
  updatedAt: new Date().toISOString(),
};

export function loadOnboardingState(): OnboardingState {
  if (typeof window === "undefined") return defaultOnboardingState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultOnboardingState;
    const parsed = JSON.parse(raw) as OnboardingState;
    return { ...defaultOnboardingState, ...parsed };
  } catch {
    return defaultOnboardingState;
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === "undefined") return;
  const toSave = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function clearOnboardingState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
