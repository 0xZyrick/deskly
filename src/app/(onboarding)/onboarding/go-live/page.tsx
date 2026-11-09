"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  ButtonLink,
  Card,
  EmptyState,
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconRefresh,
  IconRocket,
  IconUsers,
} from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding, useStepProgress } from "@/lib/onboarding/context";
import { getPrevStep } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

function Ring({ value, total }: { value: number; total: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / total);
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#0F7F76"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-heading text-lg font-semibold text-ink tabular">
        {value}/{total}
      </span>
    </div>
  );
}

export default function GoLiveStepPage() {
  const router = useRouter();
  const { state, completeStep, reset } = useOnboarding();
  const progress = useStepProgress();
  const [launched, setLaunched] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const checklist = [
    { id: "clinic", label: "Clinic details filled", done: !!state.clinic.name && !!state.clinic.email, href: "/onboarding/clinic", skipped: false },
    { id: "services", label: "At least one service", done: state.services.length > 0 && state.services.every((s) => s.name), href: "/onboarding/services", skipped: false },
    { id: "clinicians", label: "At least one clinician invited", done: state.clinicians.length > 0, href: "/onboarding/clinicians", skipped: false },
    { id: "hours", label: "Opening hours set (or skipped)", done: progress.isComplete("hours") || progress.isSkipped("hours"), href: "/onboarding/hours", skipped: progress.isSkipped("hours") },
    { id: "payments", label: "Payment settings configured", done: progress.isComplete("payments") || !!state.payments.currency, href: "/onboarding/payments", skipped: false },
    { id: "reminders", label: "Reminder preferences set", done: progress.isComplete("reminders"), href: "/onboarding/reminders", skipped: false },
  ];

  const readyCount = checklist.filter((c) => c.done).length;
  const allReady = readyCount === checklist.length;
  const pendingInvites = state.clinicians.filter((c) => c.invited && !c.joined);

  const handleLaunch = () => {
    completeStep("go-live");
    setLaunched(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/book`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (launched) {
    return (
      <OnboardingShell hideChrome>
        <div className="py-6 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 animate-pop-check items-center justify-center rounded-full bg-brand-600 text-white shadow-glow">
            <IconCheck size={38} strokeWidth={2.6} />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink">You&apos;re live</h1>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-slate-600">
            {state.clinic.name || "Your clinic"} is ready. Front-desk staff can start using the day view and patients can book (simulated).
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/staff/day" className="card group flex items-center gap-3 p-4 transition hover:border-brand-300 hover:shadow-pop">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <IconCalendar size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">Open staff desk</span>
              <span className="block text-[13px] text-slate-500">See today&apos;s schedule</span>
            </span>
            <IconArrowRight size={18} className="text-slate-300 transition group-hover:text-brand-600" />
          </Link>
          <div className="card flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <IconUsers size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">Share booking link</span>
              <Link href="/book" className="block truncate text-[13px] text-brand-700 hover:underline">
                /book
              </Link>
            </span>
            <Button variant="outline" size="sm" onClick={copyLink}>
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 pt-4 sm:flex-row sm:justify-center">
          <ButtonLink href="/" variant="ghost">
            Back to home
          </ButtonLink>
          <Button variant="ghost" onClick={() => reset()}>
            <IconRefresh size={16} /> Reset onboarding (demo)
          </Button>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell
      title="Ready to go live?"
      description="Review everything before opening the doors."
      footer={
        <StepFooter
          onBack={() => {
            const prev = getPrevStep("go-live");
            if (prev) router.push(`/onboarding/${prev}`);
          }}
          onPrimary={handleLaunch}
          primaryDisabled={!allReady}
          primaryLabel="Go live"
          primaryIcon={false}
        />
      }
    >
      <Card padded className="flex items-center gap-5">
        <Ring value={readyCount} total={checklist.length} />
        <div>
          <p className="font-heading text-lg font-semibold text-ink">
            {allReady ? "Everything is ready" : `${checklist.length - readyCount} thing${checklist.length - readyCount === 1 ? "" : "s"} left to do`}
          </p>
          <p className="text-sm text-slate-500">
            {allReady ? "You can open your doors whenever you like." : "Fix the items below, then you can go live."}
          </p>
        </div>
      </Card>

      <Card className="divide-y divide-slate-100">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                item.done ? "bg-brand-600 text-white" : "border-2 border-slate-200 text-transparent"
              )}
              aria-hidden
            >
              <IconCheck size={15} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn("text-[15px] font-medium", item.done ? "text-ink" : "text-slate-600")}>{item.label}</p>
              {item.skipped && <p className="text-xs text-slate-500">Skipped, you can set it later</p>}
              <span className="sr-only">{item.done ? "Done" : "Not done"}</span>
            </div>
            {!item.done && (
              <Link href={item.href} className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                Fix
              </Link>
            )}
          </div>
        ))}
      </Card>

      {pendingInvites.length > 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4">
          <h3 className="text-sm font-semibold text-ink">Invited, not yet joined</h3>
          <p className="mt-1 text-[13px] text-slate-500">
            You can still go live; they will appear once they join.
          </p>
          <ul className="mt-3 space-y-1">
            {pendingInvites.map((c) => (
              <li key={c.id} className="text-sm text-slate-700">
                {c.name} · <span className="text-slate-500">{c.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.clinicians.length === 0 && (
        <EmptyState
          icon={<IconRocket size={26} />}
          title="No clinicians invited"
          description="Invite at least one clinician before going live so the schedule has someone to assign."
          action={{ label: "Add clinicians", href: "/onboarding/clinicians" }}
        />
      )}
    </OnboardingShell>
  );
}
