"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  IconBuilding,
  IconCalendarCheck,
  IconMail,
  IconMapPin,
  IconPhone,
  Input,
  LogoMark,
  Select,
} from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding } from "@/lib/onboarding/context";
import { getNextStep } from "@/lib/onboarding/types";

export default function ClinicStepPage() {
  const router = useRouter();
  const { state, setState, completeStep } = useOnboarding();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const form = state.clinic;

  const update = (field: keyof typeof form, value: string) => {
    setState((prev) => ({ ...prev, clinic: { ...prev.clinic, [field]: value } }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Clinic name is required";
    if (!form.address.trim()) next.address = "Address is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    completeStep("clinic");
    const next = getNextStep("clinic");
    if (next) router.push(`/onboarding/${next}`);
  };

  const preview = (
    <Card className="overflow-hidden">
      <div className="bg-brand-gradient p-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Patient confirmation</p>
        <div className="mt-2 flex items-center gap-3">
          <LogoMark size={36} />
          <p className="truncate font-heading text-lg font-semibold">{form.name || "Your clinic name"}</p>
        </div>
      </div>
      <div className="space-y-3 p-4 text-sm">
        <div className="flex items-start gap-2.5">
          <IconCalendarCheck size={18} className="mt-0.5 text-brand-600" />
          <div>
            <p className="font-semibold text-ink">Your visit is booked</p>
            <p className="text-slate-500">Thu 5 Nov, 10:00</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-slate-600">
          <IconMapPin size={18} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="break-words">{form.address || "Clinic address"}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600">
          <IconPhone size={18} className="shrink-0 text-slate-400" />
          <span>{form.phone || "Clinic phone"}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600">
          <IconMail size={18} className="shrink-0 text-slate-400" />
          <span className="truncate">{form.email || "front@clinic.com"}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <OnboardingShell
      title="Clinic details"
      description="This information appears on patient confirmations and the front-desk view."
      aside={preview}
      footer={<StepFooter onPrimary={handleContinue} />}
    >
      <Card padded className="space-y-5">
        <Input
          label="Clinic name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          required
          placeholder="Harbour Light Clinic"
          leading={<IconBuilding size={18} />}
          autoComplete="organization"
        />
        <Input
          label="Address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          error={errors.address}
          required
          placeholder="12 Aba Road, Port Harcourt"
          leading={<IconMapPin size={18} />}
          autoComplete="street-address"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
            required
            placeholder="+234 803 000 0000"
            leading={<IconPhone size={18} />}
            autoComplete="tel"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            required
            placeholder="front@clinic.com"
            leading={<IconMail size={18} />}
            autoComplete="email"
          />
        </div>
        <Select
          label="Timezone"
          value={form.timezone}
          onChange={(e) => update("timezone", e.target.value)}
          options={[
            { value: "Africa/Lagos", label: "Africa/Lagos (WAT)" },
            { value: "Africa/Accra", label: "Africa/Accra (GMT)" },
            { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
            { value: "UTC", label: "UTC" },
          ]}
        />
      </Card>
    </OnboardingShell>
  );
}
