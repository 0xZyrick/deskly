"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, IconCheck, IconMail, IconShield, IconSmartphone, Segmented } from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding } from "@/lib/onboarding/context";
import { getNextStep, getPrevStep } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

function ChannelCard({
  selected,
  onToggle,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        "relative flex min-w-0 min-h-[112px] flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20",
        selected ? "border-brand-600 bg-brand-50/60" : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500")}>
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="block text-[13px] text-slate-500">{description}</span>
      </span>
      <span
        className={cn(
          "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition",
          selected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-transparent"
        )}
        aria-hidden
      >
        <IconCheck size={14} strokeWidth={3} />
      </span>
    </button>
  );
}

export default function RemindersStepPage() {
  const router = useRouter();
  const { state, setState, completeStep } = useOnboarding();
  const form = state.reminders;

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setState((prev) => ({ ...prev, reminders: { ...prev.reminders, [key]: value } }));
  };

  const handleContinue = () => {
    completeStep("reminders");
    const next = getNextStep("reminders");
    if (next) router.push(`/onboarding/${next}`);
  };

  const previewTime =
    form.hoursBefore === 24 ? "1 day before" : form.hoursBefore === 48 ? "2 days before" : `${form.hoursBefore} hours before`;
  const clinicName = state.clinic.name || "your clinic";

  const timing = ["2", "24", "48"].includes(String(form.hoursBefore)) ? String(form.hoursBefore) : "";

  const preview = (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <p className="section-label">Preview · {previewTime}</p>
      </div>
      <div className="bg-slate-100 p-4">
        <div className="mx-auto max-w-[260px] rounded-[26px] border-[5px] border-ink bg-white p-3 shadow-card">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">{clinicName}</p>
          <div className="rounded-2xl rounded-tl-md bg-slate-100 p-3 text-[13px] leading-snug text-ink">
            Hi Chinwe, this is a reminder for your Initial consultation at {clinicName} on Thu 5 Nov at 10:00. Reply STOP to opt out.
          </div>
        </div>
      </div>
      <p className="flex items-start gap-2 p-4 text-xs text-slate-500">
        <IconShield size={16} className="mt-px shrink-0 text-brand-600" />
        No clinical words or diagnoses are ever included.
      </p>
    </Card>
  );

  return (
    <OnboardingShell
      title="Reminders"
      description="Automatic reminders never include clinical details, only time, service and clinic name."
      aside={preview}
      footer={
        <StepFooter
          onBack={() => {
            const prev = getPrevStep("reminders");
            if (prev) router.push(`/onboarding/${prev}`);
          }}
          onPrimary={handleContinue}
        />
      }
    >
      <Card padded className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-[13.5px] font-semibold text-ink">Channels</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ChannelCard
              selected={form.emailEnabled}
              onToggle={() => update("emailEnabled", !form.emailEnabled)}
              icon={<IconMail size={20} />}
              title="Email"
              description="Best for patients who gave an email."
            />
            <ChannelCard
              selected={form.smsEnabled}
              onToggle={() => update("smsEnabled", !form.smsEnabled)}
              icon={<IconSmartphone size={20} />}
              title="SMS"
              description="Reaches everyone with a phone (simulated)."
            />
          </div>
        </fieldset>

        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink">Send reminder</p>
          <Segmented
            label="Reminder timing"
            fullWidth
            value={timing}
            onChange={(v) => update("hoursBefore", Number(v))}
            items={[
              { id: "2", label: "2 hours before" },
              { id: "24", label: "1 day before" },
              { id: "48", label: "2 days before" },
            ]}
          />
        </div>
      </Card>

      <div className="lg:hidden">{preview}</div>
    </OnboardingShell>
  );
}
