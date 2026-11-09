"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, EmptyState, InlineAlert, Skeleton } from "@/components/ui";
import { BookingShell } from "@/components/booking/shell";
import { ChoiceCard } from "@/components/booking/choice-card";
import { useBooking } from "@/lib/booking/context";
import { useCatalog } from "@/lib/booking/catalog";
import { IconArrowRight, IconClock, IconHeart, IconRefresh, IconStethoscope } from "@/components/ui/icons";
import { formatMoney } from "@/lib/utils";

function serviceIcon(id: string) {
  if (id.includes("physio")) return <IconHeart size={22} />;
  if (id.includes("follow")) return <IconRefresh size={22} />;
  return <IconStethoscope size={22} />;
}

export default function BookServicePage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();
  const { services, loaded, error } = useCatalog();

  const select = (id: string) => {
    setState((prev) =>
      prev.serviceId === id ? prev : { ...prev, serviceId: id, clinicianId: null, date: null, startsAt: null }
    );
  };

  return (
    <BookingShell
      step="service"
      title="What do you need?"
      subtitle="Choose a service. You can pick your clinician and a time next."
      footer={
        <Button
          size="lg"
          disabled={!state.serviceId}
          onClick={() => {
            if (!state.serviceId) return;
            completeAndNext("service");
            router.push("/book/clinician");
          }}
        >
          Continue
          <IconArrowRight size={18} />
        </Button>
      }
    >
      {!loaded && (
        <div className="space-y-3" role="status" aria-label="Loading services">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[92px] w-full rounded-2xl" />
          ))}
        </div>
      )}
      {error && <InlineAlert tone="danger" title="Could not load services">Check your connection and refresh the page.</InlineAlert>}
      {loaded && !error && services.length === 0 && <EmptyState title="No services available" description="Please try again later." />}
      <div role="radiogroup" aria-label="Services" className="space-y-3">
        {services.map((s) => (
          <ChoiceCard
            key={s.id}
            selected={state.serviceId === s.id}
            onSelect={() => select(s.id)}
            icon={serviceIcon(s.id)}
            title={s.name}
            description={s.description}
            meta={
              <span className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <IconClock size={14} /> {s.durationMinutes} min
                </span>
                <span className="tabular text-ink">{formatMoney(s.priceMinor)}</span>
              </span>
            }
          />
        ))}
      </div>
    </BookingShell>
  );
}
