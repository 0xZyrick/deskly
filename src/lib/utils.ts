import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names; later Tailwind classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format minor units (kobo) as currency e.g. 500000 → ₦5,000 */
export function formatMoney(amountMinor: number, currency = "NGN"): string {
  const major = amountMinor / 100;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(major);
  } catch {
    return `₦${major.toLocaleString("en-NG")}`;
  }
}

/**
 * The demo dataset is seeded for the week of 2 to 8 Nov 2026.
 * "Today" in the demo is pinned to Thursday 5 Nov so every screen has data.
 */
export const DEMO_TODAY = "2026-11-05";
export const DEMO_WEEK_START = "2026-11-02";

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `dateStr` */
export function startOfWeek(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const dow = (d.getDay() + 6) % 7; // Mon=0
  return addDays(dateStr, -dow);
}

export function formatDate(
  dateStr: string,
  opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }
): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-GB", opts);
}

/** "09:30" from an ISO string that carries a +01:00 offset */
export function timeOf(iso: string): string {
  // Strings already in clinic time (+01:00) can be sliced; anything else (e.g. "Z") is converted.
  if (iso.endsWith("+01:00")) return iso.slice(11, 16);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function initials(name: string): string {
  return name
    .replace(/^(dr\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Deterministic soft avatar colour from a string */
const AVATAR_TONES = [
  "bg-brand-100 text-brand-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-emerald-100 text-emerald-800",
];
export function avatarTone(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
}
