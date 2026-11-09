import type { BookingState } from "./types";
import { defaultBookingState } from "./types";

const KEY = "frontdesk_booking_v1";

export function loadBookingState(): BookingState {
  if (typeof window === "undefined") return defaultBookingState;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultBookingState;
    return { ...defaultBookingState, ...JSON.parse(raw) };
  } catch {
    return defaultBookingState;
  }
}

export function saveBookingState(state: BookingState): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

export function clearBookingState(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
