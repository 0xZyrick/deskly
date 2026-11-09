"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, EmptyState, IconButton, InlineAlert, Skeleton, TimeSlotChip } from "@/components/ui";
import { BookingShell } from "@/components/booking/shell";
import { useBooking } from "@/lib/booking/context";
import { IconArrowLeft, IconArrowRight, IconCalendar, IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import type { Slot } from "@/types";
import { DEMO_TODAY, addDays, cn, formatDate, startOfWeek, timeOf } from "@/lib/utils";

function groupSlots(slots: Slot[]) {
  const morning: Slot[] = [];
  const afternoon: Slot[] = [];
  const evening: Slot[] = [];
  for (const s of slots) {
    const h = Number(s.startsAt.slice(11, 13));
    if (h < 12) morning.push(s);
    else if (h < 17) afternoon.push(s);
    else evening.push(s);
  }
  return { morning, afternoon, evening };
}

export default function BookTimePage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();
  const [date, setDate] = React.useState<string>(state.date || DEMO_TODAY);
  const [weekStart, setWeekStart] = React.useState<string>(startOfWeek(state.date || DEMO_TODAY));
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const probed = React.useRef(false);

  React.useEffect(() => {
    if (!state.serviceId) router.replace("/book/service");
  }, [state.serviceId, router]);

  const fetchSlots = React.useCallback(
    async (d: string): Promise<Slot[]> => {
      const params = new URLSearchParams({ date: d, serviceId: state.serviceId! });
      if (state.clinicianId) params.set("clinicianId", state.clinicianId);
      const r = await fetch(`/api/slots?${params}`);
      if (!r.ok) throw new Error("slots");
      const json = await r.json();
      return (json.data ?? []) as Slot[];
    },
    [state.serviceId, state.clinicianId]
  );

  // Auto-jump to the first day with openings when the user has not chosen a date yet
  React.useEffect(() => {
    if (!state.serviceId || probed.current) return;
    probed.current = true;
    if (state.date) return;
    let alive = true;
    (async () => {
      try {
        for (let i = 0; i < 14; i++) {
          const d = addDays(DEMO_TODAY, i);
          const found = await fetchSlots(d);
          if (!alive) return;
          if (found.length) {
            setDate(d);
            setWeekStart(startOfWeek(d));
            return;
          }
        }
      } catch {
        /* the main loader below surfaces errors */
      }
    })();
    return () => {
      alive = false;
    };
  }, [state.serviceId, state.date, fetchSlots]);

  React.useEffect(() => {
    if (!state.serviceId) return;
    let alive = true;
    setLoading(true);
    setError("");
    fetchSlots(date)
      .then((s) => {
        if (!alive) return;
        setSlots(s);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError("Could not load available times. Please try again.");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [date, fetchSlots, state.serviceId]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const monthLabel = formatDate(date, { month: "long", year: "numeric" });
  const canGoPrev = addDays(weekStart, -1) >= startOfWeek(DEMO_TODAY);

  const pickDate = (d: string) => {
    setDate(d);
    setState((prev) => (prev.date === d ? prev : { ...prev, date: d, startsAt: null }));
  };

  const selectSlot = (slot: Slot) => {
    setState((prev) => ({ ...prev, date, startsAt: slot.startsAt, clinicianId: slot.clinicianId }));
  };

  const groups = groupSlots(slots);

  const renderGroup = (label: string, list: Slot[]) => {
    if (list.length === 0) return null;
    return (
      <section className="mt-6" aria-label={label}>
        <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wider text-slate-500">{label}</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {list.map((slot) => (
            <TimeSlotChip
              key={slot.startsAt + slot.clinicianId}
              time={timeOf(slot.startsAt)}
              selected={state.startsAt === slot.startsAt}
              onClick={() => selectSlot(slot)}
              className="w-full min-w-0"
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <BookingShell
      step="time"
      title="Pick a date and time"
      subtitle="Times shown are open right now. Choose one to hold it while you finish."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={() => router.push("/book/clinician")}>
            <IconArrowLeft size={18} />
            Back
          </Button>
          <Button
            size="lg"
            disabled={!state.startsAt}
            onClick={() => {
              if (!state.startsAt) return;
              completeAndNext("time");
              router.push("/book/details");
            }}
          >
            Continue
            <IconArrowRight size={18} />
          </Button>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <IconCalendar size={18} className="text-brand-600" />
            {monthLabel}
          </p>
          <div className="flex gap-1">
            <IconButton label="Previous week" disabled={!canGoPrev} onClick={() => setWeekStart((w) => addDays(w, -7))}>
              <IconChevronLeft size={20} />
            </IconButton>
            <IconButton label="Next week" onClick={() => setWeekStart((w) => addDays(w, 7))}>
              <IconChevronRight size={20} />
            </IconButton>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2" role="radiogroup" aria-label="Choose a day">
          {days.map((d) => {
            const selected = d === date;
            const past = d < DEMO_TODAY;
            const dt = new Date(d + "T12:00:00");
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={past}
                aria-label={formatDate(d, { weekday: "long", day: "numeric", month: "long" })}
                onClick={() => pickDate(d)}
                className={cn(
                  "flex min-h-[64px] flex-col items-center justify-center rounded-xl py-2 transition-all",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 active:scale-95",
                  selected ? "bg-brand-600 text-white shadow-glow" : "text-slate-700 hover:bg-brand-50",
                  past && "cursor-not-allowed opacity-35 hover:bg-transparent"
                )}
              >
                <span className={cn("text-[11px] font-semibold uppercase tracking-wide", selected ? "text-brand-100" : "text-slate-500")}>
                  {dt.toLocaleDateString("en-GB", { weekday: "short" })}
                </span>
                <span className="mt-0.5 font-heading text-lg font-semibold tabular">{dt.getDate()}</span>
                {d === DEMO_TODAY && (
                  <span className={cn("mt-0.5 h-1 w-1 rounded-full", selected ? "bg-white" : "bg-brand-500")} aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-[15px] font-semibold text-ink" aria-live="polite">
        {formatDate(date, { weekday: "long", day: "numeric", month: "long" })}
      </p>

      {loading && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" role="status" aria-label="Loading times">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      )}
      {error && (
        <InlineAlert tone="danger" title="Something went wrong" className="mt-4">
          {error}
        </InlineAlert>
      )}
      {!loading && !error && slots.length === 0 && (
        <div className="mt-4">
          <EmptyState
            icon={<IconCalendar size={26} />}
            title="No open times on this day"
            description="Try another day, or join the waitlist and we will message you if something opens."
            action={{ label: "Join waitlist", onClick: () => router.push("/book/waitlist") }}
          />
        </div>
      )}
      {!loading && !error && slots.length > 0 && (
        <>
          {renderGroup("Morning", groups.morning)}
          {renderGroup("Afternoon", groups.afternoon)}
          {renderGroup("Evening", groups.evening)}
        </>
      )}
    </BookingShell>
  );
}
