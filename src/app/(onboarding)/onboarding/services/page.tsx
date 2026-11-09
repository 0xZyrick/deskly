"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  IconClock,
  IconPlus,
  IconStethoscope,
  IconTrash,
  InlineAlert,
  Input,
  Segmented,
} from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding } from "@/lib/onboarding/context";
import { getNextStep, getPrevStep } from "@/lib/onboarding/types";
import type { OnboardingService } from "@/lib/onboarding/types";
import { formatMoney } from "@/lib/utils";

const PRESETS = ["15", "30", "45", "60"];

export default function ServicesStepPage() {
  const router = useRouter();
  const { state, setState, completeStep } = useOnboarding();
  const [error, setError] = React.useState("");

  const services = state.services;

  const updateService = (id: string, patch: Partial<OnboardingService>) => {
    setState((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
    setError("");
  };

  const addService = () => {
    setState((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { id: `svc_${Math.random().toString(36).slice(2, 7)}`, name: "", durationMinutes: 30, priceMinor: 0 },
      ],
    }));
  };

  const removeService = (id: string) => {
    setState((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
  };

  const handleContinue = () => {
    if (services.length === 0) {
      setError("Add at least one service");
      return;
    }
    if (services.some((s) => !s.name.trim())) {
      setError("Every service needs a name");
      return;
    }
    setError("");
    completeStep("services");
    const next = getNextStep("services");
    if (next) router.push(`/onboarding/${next}`);
  };

  const totalMinutes = services.reduce((n, s) => n + s.durationMinutes, 0);

  return (
    <OnboardingShell
      title="Services"
      description="Define what patients can book. You can change these later."
      footer={
        <StepFooter
          onBack={() => {
            const prev = getPrevStep("services");
            if (prev) router.push(`/onboarding/${prev}`);
          }}
          onPrimary={handleContinue}
        />
      }
    >
      {services.length === 0 && (
        <EmptyState
          icon={<IconStethoscope size={26} />}
          title="No services yet"
          description="Add the first thing patients can book, like a consultation."
          action={{ label: "Add a service", onClick: addService }}
        />
      )}

      {services.map((svc, idx) => {
        const preset = PRESETS.includes(String(svc.durationMinutes)) ? String(svc.durationMinutes) : "";
        return (
          <Card key={svc.id} padded className="animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                  {idx + 1}
                </span>
                {svc.name.trim() || "New service"}
              </p>
              <IconButton label={`Remove service ${idx + 1}`} onClick={() => removeService(svc.id)} className="-mr-2 hover:bg-danger-soft hover:text-danger-dark">
                <IconTrash size={18} />
              </IconButton>
            </div>
            <div className="space-y-4">
              <Input
                label="Name"
                value={svc.name}
                onChange={(e) => updateService(svc.id, { name: e.target.value })}
                placeholder="Consultation"
              />
              <div>
                <p className="mb-1.5 text-[13.5px] font-semibold text-ink">Duration</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Segmented
                    label="Duration presets"
                    value={preset}
                    onChange={(v) => updateService(svc.id, { durationMinutes: Number(v) })}
                    items={PRESETS.map((p) => ({ id: p, label: `${p}m` }))}
                  />
                  <Input
                    aria-label="Duration in minutes"
                    type="number"
                    min={5}
                    step={5}
                    value={String(svc.durationMinutes)}
                    onChange={(e) => updateService(svc.id, { durationMinutes: Number(e.target.value) || 15 })}
                    leading={<IconClock size={16} />}
                    trailing={<span className="text-xs font-medium">min</span>}
                    wrapperClassName="w-36"
                    className="h-11"
                  />
                </div>
              </div>
              <Input
                label="Price"
                type="number"
                inputMode="numeric"
                min={0}
                value={String(Math.round(svc.priceMinor / 100))}
                onChange={(e) => updateService(svc.id, { priceMinor: (Number(e.target.value) || 0) * 100 })}
                leading={<span className="text-sm font-semibold">₦</span>}
              />
            </div>
          </Card>
        );
      })}

      {services.length > 0 && (
        <Button variant="outline" fullWidth onClick={addService} className="border-dashed">
          <IconPlus size={18} /> Add another service
        </Button>
      )}

      {error && <InlineAlert tone="danger">{error}</InlineAlert>}

      {services.length > 0 && (
        <p className="text-center text-sm text-slate-500">
          {services.length} service{services.length === 1 ? "" : "s"} · {totalMinutes} min total
          {services.some((s) => s.priceMinor > 0) && (
            <> · from {formatMoney(Math.min(...services.filter((s) => s.priceMinor > 0).map((s) => s.priceMinor)))}</>
          )}
        </p>
      )}
    </OnboardingShell>
  );
}
