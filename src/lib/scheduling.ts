import type {
  Appointment,
  Clinician,
  DayOfWeek,
  Service,
  Slot,
  TimeRange,
} from "@/types";
import { store } from "./store";

const DAY_NAMES: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function getDayOfWeek(dateStr: string): DayOfWeek {
  // dateStr = YYYY-MM-DD
  const d = new Date(dateStr + "T12:00:00");
  return DAY_NAMES[d.getDay()];
}

function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function toIso(date: string, time: string): string {
  return `${date}T${time}:00.000+01:00`;
}

/**
 * Returns open slots for a given date, service and optional clinician.
 * Considers clinician weekly availability, existing appointments (excluding cancelled/no-show),
 * and service duration.
 */
export function getOpenSlots(params: {
  date: string; // YYYY-MM-DD
  serviceId: string;
  clinicianId?: string;
  slotIntervalMinutes?: number; // default 15
}): Slot[] {
  const { date, serviceId, clinicianId, slotIntervalMinutes = 15 } = params;

  const service = store.getService(serviceId);
  if (!service || !service.active) return [];

  const day = getDayOfWeek(date);
  let candidates = store.listClinicians().filter((c) =>
    c.serviceIds.includes(serviceId)
  );
  if (clinicianId) {
    candidates = candidates.filter((c) => c.id === clinicianId);
  }

  const existing = store
    .listAppointments({ date })
    .filter((a) => !["cancelled", "no-show"].includes(a.status));

  const slots: Slot[] = [];

  for (const clinician of candidates) {
    const ranges: TimeRange[] = clinician.availability[day] ?? [];
    if (ranges.length === 0) continue;

    for (const range of ranges) {
      const rangeStart = parseTime(range.start);
      const rangeEnd = parseTime(range.end);

      for (
        let t = rangeStart;
        t + service.durationMinutes <= rangeEnd;
        t += slotIntervalMinutes
      ) {
        const slotStart = minutesToTime(t);
        const slotEnd = minutesToTime(t + service.durationMinutes);
        const startsAt = toIso(date, slotStart);
        const endsAt = toIso(date, slotEnd);

        const starts = new Date(startsAt);
        const ends = new Date(endsAt);

        const overlaps = existing.some((a) => {
          if (a.clinicianId !== clinician.id) return false;
          const aStart = new Date(a.startsAt);
          const aEnd = new Date(a.endsAt);
          return starts < aEnd && ends > aStart;
        });

        if (!overlaps) {
          slots.push({
            startsAt,
            endsAt,
            clinicianId: clinician.id,
          });
        }
      }
    }
  }

  return slots.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
}

/**
 * Quick check whether a specific start time is still free for a clinician + service.
 */
export function isSlotAvailable(params: {
  startsAt: string;
  serviceId: string;
  clinicianId: string;
  excludeAppointmentId?: string;
}): boolean {
  const service = store.getService(params.serviceId);
  if (!service) return false;

  const starts = new Date(params.startsAt);
  const ends = new Date(starts.getTime() + service.durationMinutes * 60_000);

  const conflict = store.listAppointments().find((a) => {
    if (params.excludeAppointmentId && a.id === params.excludeAppointmentId)
      return false;
    if (a.clinicianId !== params.clinicianId) return false;
    if (["cancelled", "no-show"].includes(a.status)) return false;
    const aStart = new Date(a.startsAt);
    const aEnd = new Date(a.endsAt);
    return starts < aEnd && ends > aStart;
  });

  return !conflict;
}
