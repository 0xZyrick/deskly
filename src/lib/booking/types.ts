export type BookingStepId =
  | "service"
  | "clinician"
  | "time"
  | "details"
  | "intake"
  | "consent"
  | "deposit"
  | "confirmation";

export interface BookingState {
  step: BookingStepId;
  serviceId: string | null;
  clinicianId: string | null; // null = any
  date: string | null; // YYYY-MM-DD
  startsAt: string | null; // ISO
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  intake: {
    reason: string;
    preferredContact: "email" | "phone" | "either";
    notes: string;
  };
  consentAccepted: boolean;
  depositPaid: boolean;
  paymentFailed: boolean;
  appointmentId: string | null;
  joinedWaitlist: boolean;
}

export const BOOKING_STEPS: { id: BookingStepId; title: string }[] = [
  { id: "service", title: "Service" },
  { id: "clinician", title: "Clinician" },
  { id: "time", title: "Time" },
  { id: "details", title: "Your details" },
  { id: "intake", title: "Intake" },
  { id: "consent", title: "Consent" },
  { id: "deposit", title: "Deposit" },
  { id: "confirmation", title: "Done" },
];

export const BOOKING_STEP_ORDER: BookingStepId[] = BOOKING_STEPS.map((s) => s.id);

export function getBookingStepIndex(id: BookingStepId): number {
  return BOOKING_STEP_ORDER.indexOf(id);
}

export function getNextBookingStep(id: BookingStepId): BookingStepId | null {
  const i = getBookingStepIndex(id);
  return i < BOOKING_STEP_ORDER.length - 1 ? BOOKING_STEP_ORDER[i + 1] : null;
}

export function getPrevBookingStep(id: BookingStepId): BookingStepId | null {
  const i = getBookingStepIndex(id);
  return i > 0 ? BOOKING_STEP_ORDER[i - 1] : null;
}

export const defaultBookingState: BookingState = {
  step: "service",
  serviceId: null,
  clinicianId: null,
  date: null,
  startsAt: null,
  patient: { firstName: "", lastName: "", email: "", phone: "" },
  intake: { reason: "", preferredContact: "either", notes: "" },
  consentAccepted: false,
  depositPaid: false,
  paymentFailed: false,
  appointmentId: null,
  joinedWaitlist: false,
};
