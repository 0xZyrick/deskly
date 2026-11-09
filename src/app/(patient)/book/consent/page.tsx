"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox } from "@/components/ui";
import { IconArrowLeft, IconArrowRight, IconBell, IconShield, IconInfo } from "@/components/ui/icons";
import { BookingShell } from "@/components/booking/shell";
import { useBooking } from "@/lib/booking/context";
import { cn } from "@/lib/utils";

export default function BookConsentPage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();
  const [error, setError] = React.useState("");

  const continueNext = () => {
    if (!state.consentAccepted) {
      setError("Please tick the box to continue");
      return;
    }
    setError("");
    completeAndNext("consent");
    router.push("/book/deposit");
  };

  const points = [
    { icon: <IconShield size={20} />, title: "Your details stay private", text: "The clinic stores your contact details and appointment times for scheduling and reminders only." },
    { icon: <IconBell size={20} />, title: "Reminders are non-clinical", text: "Messages never contain diagnoses, treatment notes or other clinical information." },
    { icon: <IconInfo size={20} />, title: "This is a demo", text: "No real payment is taken and no medical record is created." },
  ];

  return (
    <BookingShell
      step="consent"
      title="Quick consent"
      subtitle="Please read this before paying your deposit."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={() => router.push("/book/intake")}>
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
      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {points.map((p) => (
          <li key={p.title} className="flex gap-3.5 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{p.icon}</span>
            <div>
              <p className="font-semibold text-ink">{p.title}</p>
              <p className="mt-0.5 text-[14.5px] leading-relaxed text-slate-600">{p.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-5 rounded-2xl border-2 p-4 transition-colors",
          error ? "border-danger bg-danger-soft/50" : state.consentAccepted ? "border-brand-600 bg-brand-50/50" : "border-slate-200 bg-white"
        )}
      >
        <Checkbox
          checked={state.consentAccepted}
          onChange={(checked) => {
            setState((prev) => ({ ...prev, consentAccepted: checked }));
            setError("");
          }}
          label="I understand and agree to the above"
        />
        {error && (
          <p className="mt-2 pl-8 text-[13px] font-medium text-danger-dark" role="alert">
            {error}
          </p>
        )}
      </div>
    </BookingShell>
  );
}
