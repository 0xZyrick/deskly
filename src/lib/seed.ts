import type {
  Appointment,
  Clinic,
  Clinician,
  Patient,
  Payment,
  ReminderLogEntry,
  ReminderSettings,
  ReminderTemplate,
  Service,
  WaitlistEntry,
} from "@/types";

/** Fixed reference date for the seed week: Monday 2026-11-02 → Sunday 2026-11-08 */
const WEEK_START = "2026-11-02";

function iso(date: string, time: string): string {
  return `${date}T${time}:00.000+01:00`; // WAT
}

function addMinutes(isoStr: string, minutes: number): string {
  // Add in real time, then express the result in WAT (+01:00) so the label is truthful.
  const shifted = new Date(new Date(isoStr).getTime() + minutes * 60_000 + 60 * 60_000);
  return shifted.toISOString().replace("Z", "+01:00");
}

export const clinic: Clinic = {
  id: "clinic_01",
  name: "Harbour Light Clinic",
  slug: "harbour-light",
  address: "12 Aba Road, Port Harcourt, Rivers State",
  phone: "+234 803 000 0001",
  email: "front@harbourlight.clinic",
  timezone: "Africa/Lagos",
  currency: "NGN",
  depositRequired: true,
  depositAmountMinor: 500000, // ₦5,000
  createdAt: "2026-09-01T10:00:00.000+01:00",
};

export const services: Service[] = [
  {
    id: "svc_consult",
    clinicId: clinic.id,
    name: "Initial consultation",
    description: "First visit assessment",
    durationMinutes: 30,
    priceMinor: 1500000, // ₦15,000
    active: true,
  },
  {
    id: "svc_followup",
    clinicId: clinic.id,
    name: "Follow-up",
    description: "Review visit",
    durationMinutes: 15,
    priceMinor: 800000, // ₦8,000
    active: true,
  },
  {
    id: "svc_physio",
    clinicId: clinic.id,
    name: "Physiotherapy session",
    description: "45-minute physio",
    durationMinutes: 45,
    priceMinor: 1200000, // ₦12,000
    active: true,
  },
];

export const clinicians: Clinician[] = [
  {
    id: "clin_adebayo",
    clinicId: clinic.id,
    name: "Dr. Adebayo",
    title: "General Practitioner",
    email: "adebayo@harbourlight.clinic",
    serviceIds: ["svc_consult", "svc_followup"],
    availability: {
      monday: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "13:00" }],
      thursday: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "16:00" }],
    },
    active: true,
  },
  {
    id: "clin_okoro",
    clinicId: clinic.id,
    name: "Dr. Okoro",
    title: "Physiotherapist",
    email: "okoro@harbourlight.clinic",
    serviceIds: ["svc_physio", "svc_followup"],
    availability: {
      monday: [{ start: "10:00", end: "16:00" }],
      tuesday: [{ start: "10:00", end: "16:00" }],
      wednesday: [{ start: "10:00", end: "16:00" }],
      thursday: [{ start: "10:00", end: "16:00" }],
      friday: [{ start: "10:00", end: "14:00" }],
    },
    active: true,
  },
];

export const patients: Patient[] = [
  { id: "pat_01", clinicId: clinic.id, firstName: "Chinwe", lastName: "Okeke", email: "chinwe.okeke@email.com", phone: "+2348010000001", dateOfBirth: "1990-04-12", createdAt: "2026-09-10T09:00:00.000+01:00" },
  { id: "pat_02", clinicId: clinic.id, firstName: "James", lastName: "Mensah", email: "james.m@email.com", phone: "+2348010000002", dateOfBirth: "1985-11-03", createdAt: "2026-09-12T11:00:00.000+01:00" },
  { id: "pat_03", clinicId: clinic.id, firstName: "Fatima", lastName: "Bello", email: "fatima.b@email.com", phone: "+2348010000003", dateOfBirth: "1992-07-22", createdAt: "2026-09-15T14:00:00.000+01:00" },
  { id: "pat_04", clinicId: clinic.id, firstName: "Emeka", lastName: "Nwosu", phone: "+2348010000004", dateOfBirth: "1978-01-30", createdAt: "2026-09-18T10:00:00.000+01:00" },
  { id: "pat_05", clinicId: clinic.id, firstName: "Aisha", lastName: "Yusuf", email: "aisha.y@email.com", phone: "+2348010000005", dateOfBirth: "1995-09-08", createdAt: "2026-09-20T16:00:00.000+01:00" },
  { id: "pat_06", clinicId: clinic.id, firstName: "Tunde", lastName: "Balogun", email: "tunde.b@email.com", phone: "+2348010000006", dateOfBirth: "1988-03-15", createdAt: "2026-09-22T09:30:00.000+01:00" },
  { id: "pat_07", clinicId: clinic.id, firstName: "Ngozi", lastName: "Eze", phone: "+2348010000007", dateOfBirth: "1993-12-01", createdAt: "2026-09-25T13:00:00.000+01:00" },
  { id: "pat_08", clinicId: clinic.id, firstName: "Ibrahim", lastName: "Sule", email: "ibrahim.s@email.com", phone: "+2348010000008", dateOfBirth: "1980-06-19", createdAt: "2026-09-28T11:00:00.000+01:00" },
  { id: "pat_09", clinicId: clinic.id, firstName: "Blessing", lastName: "Okafor", email: "blessing.o@email.com", phone: "+2348010000009", dateOfBirth: "1997-02-27", createdAt: "2026-10-01T10:00:00.000+01:00" },
  { id: "pat_10", clinicId: clinic.id, firstName: "Chinedu", lastName: "Okonkwo", phone: "+2348010000010", dateOfBirth: "1983-08-14", createdAt: "2026-10-05T15:00:00.000+01:00" },
];

/** Helper to build an appointment */
function appt(
  id: string,
  patientId: string,
  serviceId: string,
  clinicianId: string,
  date: string,
  time: string,
  status: Appointment["status"],
  opts: Partial<Appointment> = {}
): Appointment {
  const service = services.find((s) => s.id === serviceId)!;
  const startsAt = iso(date, time);
  const endsAt = addMinutes(startsAt, service.durationMinutes);
  const now = "2026-11-01T12:00:00.000+01:00";
  return {
    id,
    clinicId: clinic.id,
    patientId,
    serviceId,
    clinicianId,
    startsAt,
    endsAt,
    status,
    isWalkIn: false,
    createdAt: now,
    updatedAt: now,
    ...opts,
  };
}

export const appointments: Appointment[] = [
  // Monday 2026-11-02
  appt("apt_01", "pat_01", "svc_consult", "clin_adebayo", "2026-11-02", "09:00", "completed"),
  appt("apt_02", "pat_02", "svc_followup", "clin_adebayo", "2026-11-02", "09:30", "completed"),
  appt("apt_03", "pat_03", "svc_physio", "clin_okoro", "2026-11-02", "10:00", "completed"),
  appt("apt_04", "pat_04", "svc_consult", "clin_adebayo", "2026-11-02", "10:30", "completed"),
  appt("apt_05", "pat_05", "svc_physio", "clin_okoro", "2026-11-02", "11:00", "no-show"),
  appt("apt_06", "pat_06", "svc_followup", "clin_adebayo", "2026-11-02", "14:00", "completed"),
  appt("apt_07", "pat_07", "svc_consult", "clin_adebayo", "2026-11-02", "15:00", "cancelled", { notes: "Patient requested cancel" }),

  // Tuesday 2026-11-03
  appt("apt_08", "pat_08", "svc_consult", "clin_adebayo", "2026-11-03", "09:00", "completed"),
  appt("apt_09", "pat_09", "svc_physio", "clin_okoro", "2026-11-03", "10:00", "completed"),
  appt("apt_10", "pat_10", "svc_followup", "clin_adebayo", "2026-11-03", "10:00", "completed"),
  appt("apt_11", "pat_01", "svc_followup", "clin_adebayo", "2026-11-03", "11:00", "completed"),
  appt("apt_12", "pat_02", "svc_physio", "clin_okoro", "2026-11-03", "11:00", "completed"),
  appt("apt_13", "pat_03", "svc_consult", "clin_adebayo", "2026-11-03", "14:30", "completed"),
  appt("apt_14", "pat_04", "svc_physio", "clin_okoro", "2026-11-03", "14:00", "cancelled"),

  // Wednesday 2026-11-04
  appt("apt_15", "pat_05", "svc_consult", "clin_adebayo", "2026-11-04", "09:00", "completed"),
  appt("apt_16", "pat_06", "svc_physio", "clin_okoro", "2026-11-04", "10:00", "completed"),
  appt("apt_17", "pat_07", "svc_followup", "clin_adebayo", "2026-11-04", "10:00", "completed"),
  appt("apt_18", "pat_08", "svc_physio", "clin_okoro", "2026-11-04", "11:00", "no-show"),
  appt("apt_19", "pat_09", "svc_consult", "clin_adebayo", "2026-11-04", "11:30", "completed"),

  // Thursday 2026-11-05 (today-ish in seed world)
  appt("apt_20", "pat_10", "svc_consult", "clin_adebayo", "2026-11-05", "09:00", "checked-in"),
  appt("apt_21", "pat_01", "svc_physio", "clin_okoro", "2026-11-05", "10:00", "in-progress"),
  appt("apt_22", "pat_02", "svc_followup", "clin_adebayo", "2026-11-05", "10:00", "scheduled"),
  appt("apt_23", "pat_03", "svc_consult", "clin_adebayo", "2026-11-05", "11:00", "scheduled"),
  appt("apt_24", "pat_04", "svc_physio", "clin_okoro", "2026-11-05", "11:00", "scheduled"),
  appt("apt_25", "pat_05", "svc_followup", "clin_adebayo", "2026-11-05", "14:00", "scheduled"),
  appt("apt_26", "pat_06", "svc_physio", "clin_okoro", "2026-11-05", "14:00", "scheduled"),
  appt("apt_27", "pat_07", "svc_consult", "clin_adebayo", "2026-11-05", "15:00", "scheduled"),
  appt("apt_28", "pat_08", "svc_followup", "clin_okoro", "2026-11-05", "15:00", "waitlist"),

  // Friday 2026-11-06
  appt("apt_29", "pat_09", "svc_consult", "clin_adebayo", "2026-11-06", "09:00", "scheduled"),
  appt("apt_30", "pat_10", "svc_physio", "clin_okoro", "2026-11-06", "10:00", "scheduled"),
  appt("apt_31", "pat_01", "svc_followup", "clin_adebayo", "2026-11-06", "10:30", "scheduled"),
  appt("apt_32", "pat_02", "svc_consult", "clin_adebayo", "2026-11-06", "11:30", "scheduled"),
  appt("apt_33", "pat_03", "svc_physio", "clin_okoro", "2026-11-06", "11:00", "scheduled"),
  appt("apt_34", "pat_04", "svc_followup", "clin_adebayo", "2026-11-06", "14:00", "scheduled"),
  appt("apt_35", "pat_05", "svc_physio", "clin_okoro", "2026-11-06", "13:00", "scheduled"),

  // Saturday 2026-11-07 (limited)
  appt("apt_36", "pat_06", "svc_consult", "clin_adebayo", "2026-11-07", "09:00", "scheduled"),
  appt("apt_37", "pat_07", "svc_physio", "clin_okoro", "2026-11-07", "10:00", "scheduled"),

  // Sunday 2026-11-08 – closed, one cancelled leftover
  appt("apt_38", "pat_08", "svc_followup", "clin_adebayo", "2026-11-08", "10:00", "cancelled"),

  // A couple more mixed
  appt("apt_39", "pat_09", "svc_consult", "clin_adebayo", "2026-11-05", "16:00", "scheduled"),
  appt("apt_40", "pat_10", "svc_physio", "clin_okoro", "2026-11-06", "12:00", "scheduled"),
];

export const waitlist: WaitlistEntry[] = [
  {
    id: "wl_01",
    clinicId: clinic.id,
    patientId: "pat_04",
    serviceId: "svc_consult",
    preferredClinicianId: "clin_adebayo",
    preferredDate: "2026-11-06",
    notes: "Prefers morning if possible",
    createdAt: "2026-11-04T18:00:00.000+01:00",
  },
  {
    id: "wl_02",
    clinicId: clinic.id,
    patientId: "pat_08",
    serviceId: "svc_physio",
    preferredDate: "2026-11-07",
    createdAt: "2026-11-05T09:00:00.000+01:00",
  },
];

function pay(
  id: string,
  appointmentId: string,
  patientId: string,
  amountMinor: number,
  status: Payment["status"],
  kind: Payment["kind"],
  createdAt: string,
  opts: Partial<Payment> = {}
): Payment {
  return {
    id,
    clinicId: clinic.id,
    appointmentId,
    patientId,
    amountMinor,
    currency: "NGN",
    status,
    kind,
    method: opts.method ?? "card",
    reference: opts.reference ?? `FD-${id.toUpperCase()}`,
    createdAt,
    updatedAt: createdAt,
    ...opts,
  };
}

export const payments: Payment[] = [
  pay("pay_01", "apt_01", "pat_01", 500000, "paid", "deposit", "2026-11-01T10:00:00.000+01:00"),
  pay("pay_02", "apt_01", "pat_01", 1000000, "paid", "full", "2026-11-02T09:20:00.000+01:00"),
  pay("pay_03", "apt_02", "pat_02", 500000, "paid", "deposit", "2026-11-01T11:00:00.000+01:00"),
  pay("pay_04", "apt_08", "pat_08", 500000, "paid", "deposit", "2026-11-02T08:00:00.000+01:00"),
  pay("pay_05", "apt_15", "pat_05", 500000, "refunded", "deposit", "2026-11-03T09:00:00.000+01:00", {
    refundedAt: "2026-11-04T12:00:00.000+01:00",
  }),
  pay("pay_06", "apt_20", "pat_10", 500000, "paid", "deposit", "2026-11-04T16:00:00.000+01:00"),
  pay("pay_07", "apt_22", "pat_02", 500000, "pending", "deposit", "2026-11-05T07:00:00.000+01:00"),
  pay("pay_08", "apt_23", "pat_03", 500000, "paid", "deposit", "2026-11-04T18:00:00.000+01:00"),
  pay("pay_09", "apt_25", "pat_05", 500000, "failed", "deposit", "2026-11-05T08:30:00.000+01:00", {
    method: "card",
  }),
  pay("pay_10", "apt_29", "pat_09", 500000, "paid", "deposit", "2026-11-05T20:00:00.000+01:00"),
  pay("pay_11", "apt_30", "pat_10", 500000, "pending", "deposit", "2026-11-06T06:00:00.000+01:00"),
  pay("pay_12", "apt_07", "pat_07", 500000, "refunded", "deposit", "2026-11-01T14:00:00.000+01:00", {
    refundedAt: "2026-11-02T10:00:00.000+01:00",
  }),
];

export const reminderSettings: ReminderSettings = {
  clinicId: clinic.id,
  enabled: true,
  channels: ["sms", "email"],
  leadTimes: ["24h", "2h"],
  updatedAt: "2026-10-15T10:00:00.000+01:00",
};

export const reminderTemplates: ReminderTemplate[] = [
  {
    id: "tpl_sms_24h",
    clinicId: clinic.id,
    name: "SMS — 24 hours before",
    channel: "sms",
    body: "Hi {{patientName}}, reminder: your appointment at {{clinicName}} is on {{date}} at {{time}} ({{service}}). Reply STOP to opt out.",
    updatedAt: "2026-10-15T10:00:00.000+01:00",
  },
  {
    id: "tpl_email_24h",
    clinicId: clinic.id,
    name: "Email — 24 hours before",
    channel: "email",
    subject: "Appointment reminder — {{clinicName}}",
    body: "Hello {{patientName}},\n\nThis is a reminder that you have an appointment on {{date}} at {{time}} for {{service}} at {{clinicName}}.\n\nIf you need to reschedule, please contact the clinic.\n\nThank you.",
    updatedAt: "2026-10-15T10:00:00.000+01:00",
  },
  {
    id: "tpl_sms_2h",
    clinicId: clinic.id,
    name: "SMS — 2 hours before",
    channel: "sms",
    body: "{{patientName}}, your {{service}} at {{clinicName}} starts at {{time}} today. See you soon.",
    updatedAt: "2026-10-15T10:00:00.000+01:00",
  },
];

export const reminderLog: ReminderLogEntry[] = [
  {
    id: "rl_01",
    clinicId: clinic.id,
    appointmentId: "apt_20",
    patientId: "pat_10",
    channel: "sms",
    status: "sent",
    templateId: "tpl_sms_24h",
    preview: "Hi Chinedu, reminder: your appointment at Harbour Light Clinic is on 5 Nov at 09:00 (Initial consultation).",
    scheduledFor: "2026-11-04T09:00:00.000+01:00",
    sentAt: "2026-11-04T09:00:12.000+01:00",
  },
  {
    id: "rl_02",
    clinicId: clinic.id,
    appointmentId: "apt_20",
    patientId: "pat_10",
    channel: "email",
    status: "sent",
    templateId: "tpl_email_24h",
    preview: "Hello Chinedu, This is a reminder that you have an appointment on 5 Nov at 09:00…",
    scheduledFor: "2026-11-04T09:00:00.000+01:00",
    sentAt: "2026-11-04T09:00:18.000+01:00",
  },
  {
    id: "rl_03",
    clinicId: clinic.id,
    appointmentId: "apt_22",
    patientId: "pat_02",
    channel: "sms",
    status: "failed",
    templateId: "tpl_sms_24h",
    preview: "Hi James, reminder: your appointment at Harbour Light Clinic is on 5 Nov at 10:00 (Follow-up).",
    error: "Carrier rejected (simulated)",
    scheduledFor: "2026-11-04T10:00:00.000+01:00",
    sentAt: "2026-11-04T10:00:05.000+01:00",
  },
  {
    id: "rl_04",
    clinicId: clinic.id,
    appointmentId: "apt_29",
    patientId: "pat_09",
    channel: "sms",
    status: "sent",
    templateId: "tpl_sms_24h",
    preview: "Hi Blessing, reminder: your appointment at Harbour Light Clinic is on 6 Nov at 09:00 (Initial consultation).",
    scheduledFor: "2026-11-05T09:00:00.000+01:00",
    sentAt: "2026-11-05T09:00:08.000+01:00",
  },
  {
    id: "rl_05",
    clinicId: clinic.id,
    appointmentId: "apt_30",
    patientId: "pat_10",
    channel: "sms",
    status: "skipped",
    preview: "Skipped — patient has no phone on file (simulated)",
    scheduledFor: "2026-11-05T10:00:00.000+01:00",
  },
  {
    id: "rl_06",
    clinicId: clinic.id,
    appointmentId: "apt_23",
    patientId: "pat_03",
    channel: "email",
    status: "sent",
    templateId: "tpl_email_24h",
    preview: "Hello Fatima, This is a reminder that you have an appointment on 5 Nov at 11:00…",
    scheduledFor: "2026-11-04T11:00:00.000+01:00",
    sentAt: "2026-11-04T11:00:22.000+01:00",
  },
];

export const seed = {
  clinic,
  services,
  clinicians,
  patients,
  appointments,
  waitlist,
  payments,
  reminderSettings,
  reminderTemplates,
  reminderLog,
};
