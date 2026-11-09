"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InlineAlert } from "@/components/ui";
import { IconArrowLeft, IconArrowRight, IconLock } from "@/components/ui/icons";
import { BookingShell } from "@/components/booking/shell";
import { useBooking } from "@/lib/booking/context";

export default function BookDetailsPage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!state.startsAt) router.replace("/book/time");
  }, [state.startsAt, router]);

  const p = state.patient;

  const update = (field: keyof typeof p, value: string) => {
    setState((prev) => ({ ...prev, patient: { ...prev.patient, [field]: value } }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!p.firstName.trim()) next.firstName = "First name is required";
    if (!p.lastName.trim()) next.lastName = "Last name is required";
    if (!p.phone.trim()) next.phone = "Phone is required";
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      next.email = "Enter a valid email or leave blank";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const continueNext = () => {
    if (!validate()) return;
    completeAndNext("details");
    router.push("/book/intake");
  };

  const noEmail = !p.email.trim();

  return (
    <BookingShell
      step="details"
      title="A bit about you"
      subtitle="We only use this to confirm your visit and send reminders."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={() => router.push("/book/time")}>
            <IconArrowLeft size={18} />
            Back
          </Button>
          <Button size="lg" onClick={continueNext}>
            Continue
            <IconArrowRight size={18} />
          </Button>
        </>
      }
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          continueNext();
        }}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="First name"
            value={p.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            error={errors.firstName}
            required
            autoComplete="given-name"
            placeholder="Chinwe"
          />
          <Input
            label="Last name"
            value={p.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            error={errors.lastName}
            required
            autoComplete="family-name"
            placeholder="Okeke"
          />
        </div>
        <Input
          label="Phone number"
          type="tel"
          inputMode="tel"
          value={p.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          required
          autoComplete="tel"
          placeholder="+234 801 000 0000"
          hint="We will text your confirmation here."
        />
        <Input
          label="Email"
          type="email"
          inputMode="email"
          optional
          value={p.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
          hint="Recommended for email reminders."
          autoComplete="email"
          placeholder="you@email.com"
        />
        {noEmail && p.phone && (
          <InlineAlert tone="info">No email added. Confirmation and reminders will be sent by SMS only (simulated).</InlineAlert>
        )}
        <p className="flex items-center gap-2 text-[13px] text-slate-500">
          <IconLock size={15} /> Your details are used for scheduling only and never shared.
        </p>
        <button type="submit" className="sr-only" tabIndex={-1}>
          Continue
        </button>
      </form>
    </BookingShell>
  );
}
