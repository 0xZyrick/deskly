"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InlineAlert, Textarea } from "@/components/ui";
import { IconArrowLeft, IconArrowRight, IconMail, IconMessage, IconPhone } from "@/components/ui/icons";
import { BookingShell } from "@/components/booking/shell";
import { ChoiceCard } from "@/components/booking/choice-card";
import { useBooking } from "@/lib/booking/context";

export default function BookIntakePage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();

  React.useEffect(() => {
    if (!state.patient.firstName) router.replace("/book/details");
  }, [state.patient.firstName, router]);

  const i = state.intake;

  const update = <K extends keyof typeof i>(key: K, value: (typeof i)[K]) => {
    setState((prev) => ({ ...prev, intake: { ...prev.intake, [key]: value } }));
  };

  const options: { value: typeof i.preferredContact; title: string; description: string; icon: React.ReactNode }[] = [
    { value: "either", title: "Either is fine", description: "Email or phone, whichever is quickest", icon: <IconMessage size={22} /> },
    { value: "email", title: "Email", description: "Confirmations and reminders by email", icon: <IconMail size={22} /> },
    { value: "phone", title: "Phone / SMS", description: "Text messages to your number", icon: <IconPhone size={22} /> },
  ];

  return (
    <BookingShell
      step="intake"
      title="Anything we should know?"
      subtitle="Optional. This helps the front desk welcome you."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={() => router.push("/book/details")}>
            <IconArrowLeft size={18} />
            Back
          </Button>
          <Button
            size="lg"
            onClick={() => {
              completeAndNext("intake");
              router.push("/book/consent");
            }}
          >
            Continue
            <IconArrowRight size={18} />
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Reason for visit"
          optional
          value={i.reason}
          onChange={(e) => update("reason", e.target.value)}
          placeholder="e.g. routine check, follow-up"
        />

        <fieldset>
          <legend className="mb-2 text-[13.5px] font-semibold text-ink">How should we contact you?</legend>
          <div role="radiogroup" className="space-y-2.5">
            {options.map((o) => (
              <ChoiceCard
                key={o.value}
                selected={i.preferredContact === o.value}
                onSelect={() => update("preferredContact", o.value)}
                icon={o.icon}
                title={o.title}
                description={o.description}
                className="p-3.5"
              />
            ))}
          </div>
        </fieldset>

        <Textarea
          label="Anything else?"
          optional
          value={i.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="e.g. I prefer morning appointments"
        />

        <InlineAlert tone="warn" title="Please keep this non-medical">
          Do not include diagnoses, symptoms or other clinical details. The clinician will ask during your visit.
        </InlineAlert>
      </div>
    </BookingShell>
  );
}
