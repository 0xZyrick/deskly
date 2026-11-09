"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  IconMail,
  IconPlus,
  IconTrash,
  IconUsers,
  InlineAlert,
  Input,
} from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding } from "@/lib/onboarding/context";
import { getNextStep, getPrevStep } from "@/lib/onboarding/types";
import type { OnboardingClinician } from "@/lib/onboarding/types";

export default function CliniciansStepPage() {
  const router = useRouter();
  const { state, setState, completeStep } = useOnboarding();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const clinicians = state.clinicians;

  const addClinician = () => {
    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Valid email is required");
      return;
    }
    setFormError("");
    const entry: OnboardingClinician = {
      id: `clin_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: email.trim(),
      title: title.trim() || undefined,
      invited: true,
      joined: false,
    };
    setState((prev) => ({ ...prev, clinicians: [...prev.clinicians, entry] }));
    setName("");
    setEmail("");
    setTitle("");
  };

  const remove = (id: string) => {
    setState((prev) => ({ ...prev, clinicians: prev.clinicians.filter((c) => c.id !== id) }));
  };

  const markJoined = (id: string) => {
    setState((prev) => ({
      ...prev,
      clinicians: prev.clinicians.map((c) => (c.id === id ? { ...c, joined: true } : c)),
    }));
  };

  const handleContinue = () => {
    completeStep("clinicians");
    const next = getNextStep("clinicians");
    if (next) router.push(`/onboarding/${next}`);
  };

  return (
    <OnboardingShell
      title="Your team"
      description="Invite the clinicians who see patients. They get a simulated invite and can join later."
      footer={
        <StepFooter
          onBack={() => {
            const prev = getPrevStep("clinicians");
            if (prev) router.push(`/onboarding/${prev}`);
          }}
          onPrimary={handleContinue}
        />
      }
    >
      <Card padded>
        <h2 className="font-heading text-lg font-semibold text-ink">Invite a clinician</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            addClinician();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Adebayo" autoComplete="off" />
            <Input label="Title" optional value={title} onChange={(e) => setTitle(e.target.value)} placeholder="General Practitioner" />
          </div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adebayo@clinic.com"
            leading={<IconMail size={18} />}
            autoComplete="off"
          />
          {formError && <InlineAlert tone="danger">{formError}</InlineAlert>}
          <Button type="submit" variant="secondary" fullWidth className="sm:w-auto">
            <IconPlus size={18} /> Send invite
          </Button>
        </form>
      </Card>

      {clinicians.length === 0 ? (
        <EmptyState
          icon={<IconUsers size={26} />}
          title="No clinicians yet"
          description="Invite at least one person who will see patients. You can add more later."
        />
      ) : (
        <ul className="space-y-3">
          {clinicians.map((c) => (
            <li key={c.id} className="card animate-fade-up flex flex-wrap items-center gap-3 p-4">
              <Avatar name={c.name} size="lg" />
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate font-semibold text-ink">{c.name}</p>
                <p className="truncate text-sm text-slate-500">{c.email}</p>
                {c.title && <p className="truncate text-xs text-slate-400">{c.title}</p>}
              </div>
              <div className="flex items-center gap-1">
                {c.joined ? (
                  <Badge tone="ok">Joined</Badge>
                ) : (
                  <>
                    <Badge tone="neutral">Invited</Badge>
                    <Button variant="ghost" size="sm" onClick={() => markJoined(c.id)}>
                      Simulate join
                    </Button>
                  </>
                )}
                <IconButton label={`Remove ${c.name}`} onClick={() => remove(c.id)} className="hover:bg-danger-soft hover:text-danger-dark">
                  <IconTrash size={18} />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </OnboardingShell>
  );
}
