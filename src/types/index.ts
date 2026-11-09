/** Shared domain types for Front Desk (simulated data only) */

export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show"
  | "waitlist";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeRange {
  start: string; // "09:00"
  end: string;   // "17:00"
}

export interface WeeklyAvailability {
  monday?: TimeRange[];
  tuesday?: TimeRange[];
  wednesday?: TimeRange[];
  thursday?: TimeRange[];
  friday?: TimeRange[];
  saturday?: TimeRange[];
  sunday?: TimeRange[];
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  currency: string;
  depositRequired: boolean;
  depositAmountMinor: number; // in smallest currency unit (kobo/cents)
  createdAt: string;
}

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  priceMinor: number;
  active: boolean;
}

export interface Clinician {
  id: string;
  clinicId: string;
  name: string;
  title?: string;
  email?: string;
  serviceIds: string[];
  availability: WeeklyAvailability;
  active: boolean;
}

export interface Patient {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  serviceId: string;
  clinicianId: string;
  startsAt: string; // ISO datetime
  endsAt: string;   // ISO datetime
  status: AppointmentStatus;
  notes?: string; // non-clinical only (e.g. "prefers morning")
  isWalkIn: boolean;
  depositPaidMinor?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  clinicId: string;
  patientId: string;
  serviceId: string;
  preferredClinicianId?: string;
  preferredDate?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface Slot {
  startsAt: string; // ISO
  endsAt: string;   // ISO
  clinicianId: string;
}

/** API response shapes */
export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface CreateAppointmentInput {
  patientId: string;
  serviceId: string;
  clinicianId: string;
  startsAt: string;
  isWalkIn?: boolean;
  notes?: string;
  depositPaidMinor?: number;
}

export interface UpdateAppointmentInput {
  status?: AppointmentStatus;
  startsAt?: string;
  clinicianId?: string;
  notes?: string;
  depositPaidMinor?: number;
}

/** ---- Payments & reminders (Phase 7) ---- */

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export type PaymentKind = "deposit" | "full" | "refund";

export interface Payment {
  id: string;
  clinicId: string;
  appointmentId: string;
  patientId: string;
  amountMinor: number;
  currency: string;
  status: PaymentStatus;
  kind: PaymentKind;
  method?: string; // e.g. "card", "transfer", "cash"
  reference?: string;
  createdAt: string;
  updatedAt: string;
  refundedAt?: string;
}

export type ReminderChannel = "sms" | "email";

export type ReminderLeadTime =
  | "24h"
  | "2h"
  | "1h"
  | "30m";

export interface ReminderSettings {
  clinicId: string;
  enabled: boolean;
  channels: ReminderChannel[];
  leadTimes: ReminderLeadTime[];
  updatedAt: string;
}

export interface ReminderTemplate {
  id: string;
  clinicId: string;
  name: string;
  channel: ReminderChannel;
  subject?: string; // email only
  body: string; // supports {{patientName}}, {{date}}, {{time}}, {{service}}, {{clinicName}}
  updatedAt: string;
}

export type ReminderLogStatus = "sent" | "failed" | "skipped";

export interface ReminderLogEntry {
  id: string;
  clinicId: string;
  appointmentId: string;
  patientId: string;
  channel: ReminderChannel;
  status: ReminderLogStatus;
  templateId?: string;
  preview: string; // non-clinical snippet that was "sent"
  error?: string;
  scheduledFor: string;
  sentAt?: string;
}

export interface DashboardSummary {
  paymentsTodayMinor: number;
  paymentsTodayCount: number;
  pendingPaymentsCount: number;
  refundedThisWeekCount: number;
  remindersDueToday: number;
  remindersFailedWeek: number;
  appointmentsToday: number;
}
