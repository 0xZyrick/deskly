"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink, Input } from "@/components/ui";
import { BookingShell } from "@/components/booking/shell";
import { useBooking } from "@/lib/booking/context";
import { IconArrowLeft, IconBell, IconCheck } from "@/components/ui/icons";

export default function BookWaitlistPage() {
  const router = useRouter();
  const { state, setState } = useBooking();
  const [done, setDone] = React.useState(false);
  const [name, setName] = React.useState(`${state.patient.firstName} ${state.patient.lastName}`.trim());
  const [phone, setPhone] = React.useState(state.patient.phone);
  const [errors, setErrors] = React.useState<{ name?: string; phone?: string }>({});

  const join = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!phone.trim()) next.phone = "Phone is required so we can reach you";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState((prev) => ({ ...prev, joinedWaitlist: true }));
    setDone(true);
  };

  if (done) {
    return (
      <BookingShell step="time" title="You're on the waitlist">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <span className="mx-auto flex h-16 w-16 animate-pop-check items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <IconCheck size={30} strokeWidth={2.6} />
          </span>
          <p className="mt-4 font-heading text-xl font-semibold text-ink">We'll contact you if a slot opens</p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-slate-600">
            We will message {phone || "your phone"} (simulated). Messages never include clinical details.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button size="lg" onClick={() => router.push("/book/time")} className="sm:flex-1">
            Try another date
          </Button>
          <ButtonLink href="/" variant="outline" size="lg" className="sm:flex-1">
            Back to home
          </ButtonLink>
        </div>
      </BookingShell>
    );
  }

  return (
    <BookingShell
      step="time"
      title="Join the waitlist"
      subtitle="Leave your number and we'll notify you if a suitable time becomes free."
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          join();
        }}
      >
        <Input
          label="Full name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((x) => ({ ...x, name: undefined }));
          }}
          error={errors.name}
          autoComplete="name"
          required
        />
        <Input
          label="Phone number"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors((x) => ({ ...x, phone: undefined }));
          }}
          error={errors.phone}
          autoComplete="tel"
          required
          placeholder="+234 801 000 0000"
        />
        <p className="flex items-center gap-2 text-[13px] text-slate-500">
          <IconBell size={15} /> You can still book another day while you wait.
        </p>
        <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-between">
          <Button type="button" variant="ghost" size="lg" onClick={() => router.push("/book/time")}>
            <IconArrowLeft size={18} />
            Back to times
          </Button>
          <Button type="submit" size="lg">
            Join waitlist
          </Button>
        </div>
      </form>
    </BookingShell>
  );
}
