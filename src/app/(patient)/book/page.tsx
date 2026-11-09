"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking/context";
import { FullPageLoader } from "@/components/ui";

export default function BookIndexPage() {
  const router = useRouter();
  const { state, isHydrated } = useBooking();

  useEffect(() => {
    if (!isHydrated) return;
    // Resume at the current step or start at service
    const step = state.step === "confirmation" && state.appointmentId ? "confirmation" : state.step || "service";
    router.replace(`/book/${step}`);
  }, [isHydrated, state.step, state.appointmentId, router]);

  return <FullPageLoader label="Starting your booking…" />;
}
