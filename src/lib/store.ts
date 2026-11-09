import type {
  Appointment,
  Clinic,
  Clinician,
  CreateAppointmentInput,
  DashboardSummary,
  Patient,
  Payment,
  PaymentStatus,
  ReminderLogEntry,
  ReminderSettings,
  ReminderTemplate,
  Service,
  UpdateAppointmentInput,
  WaitlistEntry,
} from "@/types";
import { seed } from "./seed";

/** Simple in-memory store. Resets on server restart (simulated). */
let clinic: Clinic = structuredClone(seed.clinic);
let services: Service[] = structuredClone(seed.services);
let clinicians: Clinician[] = structuredClone(seed.clinicians);
let patients: Patient[] = structuredClone(seed.patients);
let appointments: Appointment[] = structuredClone(seed.appointments);
let waitlist: WaitlistEntry[] = structuredClone(seed.waitlist);
let payments: Payment[] = structuredClone(seed.payments);
let reminderSettings: ReminderSettings = structuredClone(seed.reminderSettings);
let reminderTemplates: ReminderTemplate[] = structuredClone(seed.reminderTemplates);
let reminderLog: ReminderLogEntry[] = structuredClone(seed.reminderLog);

/** Block clinical content in reminder templates (Phase 7 guard). */
const CLINICAL_BLOCKLIST = [
  "diagnosis",
  "diagnosed",
  "prescription",
  "prescribe",
  "medication",
  "medicine",
  "symptom",
  "symptoms",
  "treatment plan",
  "treatment",
  "dosage",
  "dose",
  "lab result",
  "lab results",
  "blood pressure",
  "bp reading",
  "test result",
  "pathology",
  "prognosis",
  "condition",
  "disease",
  "illness",
  "disorder",
  "therapy notes",
  "clinical notes",
  "medical history",
];

export function findClinicalWords(text: string): string[] {
  const lower = text.toLowerCase();
  return CLINICAL_BLOCKLIST.filter((w) => lower.includes(w));
}

function nowIso() {
  return new Date().toISOString();
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const storeImpl = {
  // ---- Clinic ----
  getClinic(): Clinic {
    return clinic;
  },

  // ---- Services ----
  listServices(activeOnly = true): Service[] {
    return activeOnly ? services.filter((s) => s.active) : services;
  },
  getService(id: string): Service | undefined {
    return services.find((s) => s.id === id);
  },

  // ---- Clinicians ----
  listClinicians(activeOnly = true): Clinician[] {
    return activeOnly ? clinicians.filter((c) => c.active) : clinicians;
  },
  getClinician(id: string): Clinician | undefined {
    return clinicians.find((c) => c.id === id);
  },

  // ---- Patients ----
  listPatients(): Patient[] {
    return patients;
  },
  getPatient(id: string): Patient | undefined {
    return patients.find((p) => p.id === id);
  },
  searchPatients(query: string): Patient[] {
    const q = query.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
    );
  },

  createPatient(input: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  }): Patient {
    const patient: Patient = {
      id: generateId("pat"),
      clinicId: clinic.id,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || undefined,
      createdAt: nowIso(),
    };
    patients.push(patient);
    return patient;
  },
  findPatientByPhone(phone: string): Patient | undefined {
    const norm = (v?: string) => (v ?? "").replace(/[^\d+]/g, "");
    const target = norm(phone);
    if (!target) return undefined;
    return patients.find((p) => norm(p.phone) === target);
  },

  // ---- Appointments ----
  listAppointments(filters?: {
    date?: string; // YYYY-MM-DD
    status?: Appointment["status"];
    clinicianId?: string;
    patientId?: string;
  }): Appointment[] {
    let result = [...appointments];
    if (filters?.date) {
      result = result.filter((a) => a.startsAt.startsWith(filters.date!));
    }
    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters?.clinicianId) {
      result = result.filter((a) => a.clinicianId === filters.clinicianId);
    }
    if (filters?.patientId) {
      result = result.filter((a) => a.patientId === filters.patientId);
    }
    return result.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  },

  getAppointment(id: string): Appointment | undefined {
    return appointments.find((a) => a.id === id);
  },

  createAppointment(input: CreateAppointmentInput): Appointment | { error: string } {
    const service = this.getService(input.serviceId);
    if (!service) return { error: "Service not found" };

    const clinician = this.getClinician(input.clinicianId);
    if (!clinician) return { error: "Clinician not found" };

    const patient = this.getPatient(input.patientId);
    if (!patient) return { error: "Patient not found" };

    // Conflict check: overlapping non-cancelled/no-show appointments for same clinician
    const starts = new Date(input.startsAt);
    const ends = new Date(starts.getTime() + service.durationMinutes * 60_000);

    const conflict = appointments.find((a) => {
      if (a.clinicianId !== input.clinicianId) return false;
      if (["cancelled", "no-show"].includes(a.status)) return false;
      const aStart = new Date(a.startsAt);
      const aEnd = new Date(a.endsAt);
      return starts < aEnd && ends > aStart;
    });

    if (conflict) {
      return { error: "Slot is no longer available" };
    }

    const appointment: Appointment = {
      id: generateId("apt"),
      clinicId: clinic.id,
      patientId: input.patientId,
      serviceId: input.serviceId,
      clinicianId: input.clinicianId,
      startsAt: input.startsAt,
      endsAt: ends.toISOString(),
      status: "scheduled",
      isWalkIn: input.isWalkIn ?? false,
      notes: input.notes,
      depositPaidMinor: input.depositPaidMinor,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    appointments.push(appointment);
    return appointment;
  },

  updateAppointment(
    id: string,
    input: UpdateAppointmentInput
  ): Appointment | { error: string } {
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return { error: "Appointment not found" };

    const current = appointments[idx];
    const service = this.getService(current.serviceId);
    if (!service) return { error: "Service not found" };

    let startsAt = current.startsAt;
    let endsAt = current.endsAt;
    let clinicianId = current.clinicianId;

    if (input.startsAt) {
      startsAt = input.startsAt;
      const starts = new Date(startsAt);
      endsAt = new Date(starts.getTime() + service.durationMinutes * 60_000).toISOString();
    }
    if (input.clinicianId) {
      clinicianId = input.clinicianId;
    }

    // Conflict check when time or clinician changes
    if (input.startsAt || input.clinicianId) {
      const starts = new Date(startsAt);
      const ends = new Date(endsAt);
      const conflict = appointments.find((a) => {
        if (a.id === id) return false;
        if (a.clinicianId !== clinicianId) return false;
        if (["cancelled", "no-show"].includes(a.status)) return false;
        const aStart = new Date(a.startsAt);
        const aEnd = new Date(a.endsAt);
        return starts < aEnd && ends > aStart;
      });
      if (conflict) return { error: "Slot is no longer available" };
    }

    const updated: Appointment = {
      ...current,
      status: input.status ?? current.status,
      startsAt,
      endsAt,
      clinicianId,
      notes: input.notes ?? current.notes,
      depositPaidMinor: input.depositPaidMinor ?? current.depositPaidMinor,
      updatedAt: nowIso(),
    };

    appointments[idx] = updated;
    return updated;
  },

  cancelAppointment(id: string): Appointment | { error: string } {
    return this.updateAppointment(id, { status: "cancelled" });
  },

  // ---- Waitlist ----
  listWaitlist(): WaitlistEntry[] {
    return waitlist;
  },

  // ---- Payments ----
  listPayments(filters?: {
    status?: PaymentStatus;
    dateFrom?: string; // YYYY-MM-DD
    dateTo?: string;
  }): Payment[] {
    let result = [...payments];
    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.dateFrom) {
      result = result.filter((p) => p.createdAt.slice(0, 10) >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      result = result.filter((p) => p.createdAt.slice(0, 10) <= filters.dateTo!);
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getPayment(id: string): Payment | undefined {
    return payments.find((p) => p.id === id);
  },

  refundPayment(id: string): Payment | { error: string } {
    const idx = payments.findIndex((p) => p.id === id);
    if (idx === -1) return { error: "Payment not found" };
    const current = payments[idx];
    if (current.status === "refunded") return { error: "Already refunded" };
    if (current.status !== "paid") {
      return { error: "Only paid payments can be refunded" };
    }
    const updated: Payment = {
      ...current,
      status: "refunded",
      refundedAt: nowIso(),
      updatedAt: nowIso(),
    };
    payments[idx] = updated;
    return updated;
  },

  createPayment(input: {
    appointmentId: string;
    patientId: string;
    amountMinor: number;
    kind?: Payment["kind"];
    method?: string;
  }): Payment {
    const payment: Payment = {
      id: generateId("pay"),
      clinicId: clinic.id,
      appointmentId: input.appointmentId,
      patientId: input.patientId,
      amountMinor: input.amountMinor,
      currency: clinic.currency,
      status: "paid",
      kind: input.kind ?? "deposit",
      method: input.method ?? "card",
      reference: `DEP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    payments.push(payment);
    return payment;
  },

  // ---- Reminders ----
  getReminderSettings(): ReminderSettings {
    return reminderSettings;
  },

  updateReminderSettings(
    patch: Partial<Omit<ReminderSettings, "clinicId">>
  ): ReminderSettings {
    reminderSettings = {
      ...reminderSettings,
      ...patch,
      clinicId: reminderSettings.clinicId,
      updatedAt: nowIso(),
    };
    return reminderSettings;
  },

  listReminderTemplates(): ReminderTemplate[] {
    return reminderTemplates;
  },

  getReminderTemplate(id: string): ReminderTemplate | undefined {
    return reminderTemplates.find((t) => t.id === id);
  },

  updateReminderTemplate(
    id: string,
    patch: Partial<Pick<ReminderTemplate, "name" | "subject" | "body">>
  ): ReminderTemplate | { error: string; blockedWords?: string[] } {
    const idx = reminderTemplates.findIndex((t) => t.id === id);
    if (idx === -1) return { error: "Template not found" };

    const nextBody = patch.body ?? reminderTemplates[idx].body;
    const nextSubject = patch.subject ?? reminderTemplates[idx].subject ?? "";
    const blocked = [
      ...findClinicalWords(nextBody),
      ...findClinicalWords(nextSubject),
    ];
    const unique = Array.from(new Set(blocked));
    if (unique.length > 0) {
      return {
        error: "Template contains clinical terms that are not allowed in reminders",
        blockedWords: unique,
      };
    }

    const updated: ReminderTemplate = {
      ...reminderTemplates[idx],
      ...patch,
      updatedAt: nowIso(),
    };
    reminderTemplates[idx] = updated;
    return updated;
  },

  listReminderLog(): ReminderLogEntry[] {
    return [...reminderLog].sort(
      (a, b) =>
        new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
    );
  },

  getSummary(today = "2026-11-05"): DashboardSummary {
    const weekStart = "2026-11-02";
    const weekEnd = "2026-11-08";

    const paymentsToday = payments.filter(
      (p) => p.createdAt.startsWith(today) && p.status === "paid"
    );
    const pending = payments.filter((p) => p.status === "pending");
    const refundedWeek = payments.filter(
      (p) =>
        p.status === "refunded" &&
        p.refundedAt &&
        p.refundedAt.slice(0, 10) >= weekStart &&
        p.refundedAt.slice(0, 10) <= weekEnd
    );
    const aptsToday = appointments.filter(
      (a) =>
        a.startsAt.startsWith(today) &&
        !["cancelled", "no-show"].includes(a.status)
    );
    const remindersDue = reminderLog.filter((r) =>
      r.scheduledFor.startsWith(today)
    );
    const remindersFailed = reminderLog.filter(
      (r) =>
        r.status === "failed" &&
        r.scheduledFor.slice(0, 10) >= weekStart &&
        r.scheduledFor.slice(0, 10) <= weekEnd
    );

    return {
      paymentsTodayMinor: paymentsToday.reduce((s, p) => s + p.amountMinor, 0),
      paymentsTodayCount: paymentsToday.length,
      pendingPaymentsCount: pending.length,
      refundedThisWeekCount: refundedWeek.length,
      remindersDueToday: remindersDue.length,
      remindersFailedWeek: remindersFailed.length,
      appointmentsToday: aptsToday.length,
    };
  },

  /** Reset to seed (useful for demos) */
  reset() {
    clinic = structuredClone(seed.clinic);
    services = structuredClone(seed.services);
    clinicians = structuredClone(seed.clinicians);
    patients = structuredClone(seed.patients);
    appointments = structuredClone(seed.appointments);
    waitlist = structuredClone(seed.waitlist);
    payments = structuredClone(seed.payments);
    reminderSettings = structuredClone(seed.reminderSettings);
    reminderTemplates = structuredClone(seed.reminderTemplates);
    reminderLog = structuredClone(seed.reminderLog);
  },
};

/**
 * Keep ONE store per server process. In `next dev` (and on hot reload) route
 * handlers can load separate copies of this module; without a shared singleton a
 * booking created by one route would be invisible to another.
 */
const globalForStore = globalThis as unknown as { __desklyStore?: typeof storeImpl };
export const store = globalForStore.__desklyStore ?? (globalForStore.__desklyStore = storeImpl);
