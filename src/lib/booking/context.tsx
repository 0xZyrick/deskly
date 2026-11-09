"use client";

import * as React from "react";
import type { BookingState, BookingStepId } from "./types";
import { defaultBookingState, getNextBookingStep } from "./types";
import { loadBookingState, saveBookingState, clearBookingState } from "./storage";

type Ctx = {
  state: BookingState;
  setState: React.Dispatch<React.SetStateAction<BookingState>>;
  goTo: (step: BookingStepId) => void;
  completeAndNext: (step: BookingStepId) => BookingStepId | null;
  reset: () => void;
  isHydrated: boolean;
};

const BookingContext = React.createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<BookingState>(defaultBookingState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(loadBookingState());
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (isHydrated) saveBookingState(state);
  }, [state, isHydrated]);

  const goTo = React.useCallback((step: BookingStepId) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const completeAndNext = React.useCallback((step: BookingStepId) => {
    const next = getNextBookingStep(step);
    if (next) setState((prev) => ({ ...prev, step: next }));
    return next;
  }, []);

  const reset = React.useCallback(() => {
    clearBookingState();
    setState(defaultBookingState);
  }, []);

  return (
    <BookingContext.Provider value={{ state, setState, goTo, completeAndNext, reset, isHydrated }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
