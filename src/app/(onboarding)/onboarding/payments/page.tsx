"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, IconLock, Input, Select, Switch } from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding } from "@/lib/onboarding/context";
import { getNextStep, getPrevStep } from "@/lib/onboarding/types";
import { formatMoney } from "@/lib/utils";

const SYMBOLS: Record<string, string> = { NGN: "₦", GHS: "₵", KES: "KSh", USD: "$" };

export default function PaymentsStepPage() {
  const router = useRouter();
  const { state, setState, completeStep } = useOnboarding();
  const form = state.payments;

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setState((prev) => ({ ...prev, payments: { ...prev.payments, [key]: value } }));
  };

  const handleContinue = () => {
    completeStep("payments");
    const next = getNextStep("payments");
    if (next) router.push(`/onboarding/${next}`);
  };

  const symbol = SYMBOLS[form.currency] ?? form.currency;

  const preview = (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <p className="section-label">Patient sees</p>
      </div>
      <div className="p-5 text-center">
        {form.depositRequired ? (
          <>
            <p className="text-sm text-slate-500">Deposit due</p>
            <p className="mt-1 font-heading text-3xl font-semibold text-ink">
              {formatMoney(form.depositAmountMinor, form.currency)}
            </p>
            <p className="mt-2 text-xs text-slate-500">Held against the appointment (simulated).</p>
            <div className="mt-4 flex h-11 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white">
              Pay deposit
            </div>
          </>
        ) : (
          <>
            <p className="font-semibold text-ink">No deposit needed</p>
            <p className="mt-1 text-sm text-slate-500">Patients confirm their slot straight away.</p>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <OnboardingShell
      title="Payments"
      description="Configure deposits for bookings. All amounts are simulated."
      aside={preview}
      footer={
        <StepFooter
          onBack={() => {
            const prev = getPrevStep("payments");
            if (prev) router.push(`/onboarding/${prev}`);
          }}
          onPrimary={handleContinue}
        />
      }
    >
      <Card padded className="space-y-6">
        <Select
          label="Currency"
          value={form.currency}
          onChange={(e) => update("currency", e.target.value)}
          options={[
            { value: "NGN", label: "Nigerian Naira (₦)" },
            { value: "GHS", label: "Ghanaian Cedi (₵)" },
            { value: "KES", label: "Kenyan Shilling (KSh)" },
            { value: "USD", label: "US Dollar ($)" },
          ]}
        />
        <div className="border-t border-slate-100 pt-6">
          <Switch
            checked={form.depositRequired}
            onChange={(v) => update("depositRequired", v)}
            label="Require a deposit when booking"
            description="Reduces no-shows by asking patients to secure their slot."
          />
        </div>
        {form.depositRequired && (
          <Input
            label="Deposit amount"
            type="number"
            inputMode="numeric"
            min={0}
            value={String(Math.round(form.depositAmountMinor / 100))}
            onChange={(e) => update("depositAmountMinor", (Number(e.target.value) || 0) * 100)}
            leading={<span className="text-sm font-semibold">{symbol}</span>}
            hint="Patients see this as a simulated payment step."
          />
        )}
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <IconLock size={14} /> No real money moves in this demo.
        </p>
      </Card>

      {/* Preview on small screens */}
      <div className="lg:hidden">{preview}</div>
    </OnboardingShell>
  );
}
