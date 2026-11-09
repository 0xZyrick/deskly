"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Skeleton } from "@/components/ui";
import { BookingShell } from "@/components/booking/shell";
import { ChoiceCard } from "@/components/booking/choice-card";
import { useBooking } from "@/lib/booking/context";
import { useCatalog } from "@/lib/booking/catalog";
import { IconArrowLeft, IconArrowRight, IconZap } from "@/components/ui/icons";

export default function BookClinicianPage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();
  const { clinicians, loaded } = useCatalog();

  React.useEffect(() => {
    if (!state.serviceId) router.replace("/book/service");
  }, [state.serviceId, router]);

  const list = clinicians.filter((c) => state.serviceId && c.serviceIds.includes(state.serviceId));

  const select = (id: string | null) => {
    setState((prev) => (prev.clinicianId === id ? prev : { ...prev, clinicianId: id, date: null, startsAt: null }));
  };

  return (
    <BookingShell
      step="clinician"
      title="Who would you like to see?"
      subtitle="Pick a clinician, or take the soonest open time with anyone."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={() => router.push("/book/service")}>
            <IconArrowLeft size={18} />
            Back
          </Button>
          <Button
            size="lg"
            onClick={() => {
              completeAndNext("clinician");
              router.push("/book/time");
            }}
          >
            Continue
            <IconArrowRight size={18} />
          </Button>
        </>
      }
    >
      {!loaded && (
        <div className="space-y-3" role="status" aria-label="Loading clinicians">
          <Skeleton className="h-[84px] w-full rounded-2xl" />
          <Skeleton className="h-[84px] w-full rounded-2xl" />
        </div>
      )}
      <div role="radiogroup" aria-label="Clinicians" className="space-y-3">
        {loaded && (
          <ChoiceCard
            selected={state.clinicianId === null}
            onSelect={() => select(null)}
            icon={<IconZap size={22} />}
            title="First available"
            description="Soonest open time with any qualified clinician"
          />
        )}
        {list.map((c) => (
          <ChoiceCard
            key={c.id}
            selected={state.clinicianId === c.id}
            onSelect={() => select(c.id)}
            icon={<Avatar name={c.name} size="md" className="!h-12 !w-12 rounded-xl" />}
            title={c.name}
            description={c.title}
          />
        ))}
      </div>
    </BookingShell>
  );
}
