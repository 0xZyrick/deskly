"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  FullPageLoader,
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconCheck,
  LogoMark,
  Logo,
  SimulatedBadge,
  Stepper,
  type Step,
} from "@/components/ui";
import { useOnboarding, useStepProgress } from "@/lib/onboarding/context";
import {
  ONBOARDING_STEPS,
  STEP_ORDER,
  type OnboardingStepId,
  getStepIndex,
} from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const pathToStep: Record<string, OnboardingStepId> = {
  "/onboarding/clinic": "clinic",
  "/onboarding/services": "services",
  "/onboarding/clinicians": "clinicians",
  "/onboarding/hours": "hours",
  "/onboarding/payments": "payments",
  "/onboarding/reminders": "reminders",
  "/onboarding/go-live": "go-live",
};

/** Consistent Back / Skip / Save & continue bar used by every step. */
export function StepFooter({
  onBack,
  onSkip,
  onPrimary,
  primaryLabel = "Save & continue",
  primaryDisabled,
  primaryLoading,
  primaryIcon = true,
  skipLabel = "Skip for now",
}: {
  onBack?: () => void;
  onSkip?: () => void;
  onPrimary?: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  primaryIcon?: boolean;
  skipLabel?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center gap-2 sm:gap-3">
      {onBack ? (
        <Button variant="ghost" onClick={onBack} className="shrink-0">
          <IconArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
          <span className="sr-only sm:hidden">Back</span>
        </Button>
      ) : (
        <span />
      )}
      <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:flex-none">
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="shrink-0 px-3.5 sm:px-5">
            <span className="sm:hidden">Skip</span>
            <span className="hidden sm:inline">{skipLabel}</span>
          </Button>
        )}
        {onPrimary && (
          <Button
            onClick={onPrimary}
            disabled={primaryDisabled}
            loading={primaryLoading}
            className="min-w-0 flex-1 px-4 sm:flex-none sm:min-w-[170px] sm:px-5"
          >
            {primaryLabel}
            {primaryIcon && <IconArrowRight size={18} className="hidden sm:block" />}
          </Button>
        )}
      </div>
    </div>
  );
}

export function OnboardingShell({
  children,
  title,
  description,
  footer,
  aside,
  hideChrome,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  /** Optional lg+ side panel rendered beside the form (e.g. live preview) */
  aside?: React.ReactNode;
  /** Hide step header (used for the success state) */
  hideChrome?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, goToStep, isHydrated } = useOnboarding();
  const progress = useStepProgress();
  const [open, setOpen] = React.useState(false);

  const currentStepId = pathToStep[pathname] ?? state.currentStep;
  const currentIndex = getStepIndex(currentStepId);
  const total = STEP_ORDER.length;

  const steps: Step[] = ONBOARDING_STEPS.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    optional: s.optional,
  }));
  const skippedIdx = progress.skipped.map((id) => getStepIndex(id));

  React.useEffect(() => {
    if (isHydrated && pathToStep[pathname]) goToStep(pathToStep[pathname]);
  }, [pathname, isHydrated, goToStep]);

  React.useEffect(() => setOpen(false), [pathname]);

  const canVisit = (index: number) => {
    const step = STEP_ORDER[index];
    return index <= currentIndex || progress.isComplete(step) || progress.isSkipped(step);
  };
  const handleStepClick = (index: number) => {
    if (canVisit(index) && index !== currentIndex) router.push(`/onboarding/${STEP_ORDER[index]}`);
  };

  const doneCount = STEP_ORDER.filter((s) => progress.isComplete(s) || progress.isSkipped(s)).length;
  const pct = Math.round((doneCount / total) * 100);

  if (!isHydrated) return <FullPageLoader label="Loading your setup…" />;

  const stepMeta = ONBOARDING_STEPS[currentIndex];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[340px_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-pop"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <aside className="relative hidden overflow-hidden bg-brand-950 bg-hero-glow text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="absolute inset-0 bg-grid-faint [background-size:36px_36px] opacity-60" aria-hidden />
        <div className="relative flex h-full flex-col p-8">
          <div className="flex items-center justify-between">
            <Logo tone="light" />
            <SimulatedBadge tone="dark" />
          </div>
          <h2 className="mt-10 font-heading text-[28px] font-semibold leading-tight text-balance">
            Set up your clinic in a few minutes
          </h2>
          <p className="mt-2 text-sm text-white/65">
            Seven short steps and patients can book online while your front desk runs the day.
          </p>

          <div className="mt-8 flex-1 overflow-y-auto pr-1">
            <Stepper
              steps={steps}
              currentStep={currentIndex}
              skipped={skippedIdx}
              onStepClick={handleStepClick}
              isClickable={canVisit}
              tone="dark"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{pct}% complete</span>
              <span className="text-white/55">
                {doneCount}/{total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brand-300 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-white/55">
              <IconCheck size={14} /> Saved automatically on this device
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <LogoMark size={30} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Step {currentIndex + 1} of {total}
            </p>
            <p className="truncate font-heading text-[15px] font-semibold leading-tight text-ink">{stepMeta?.title}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="all-steps"
            className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-[13px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            All steps
            <IconChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
          </button>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-brand-600 transition-all duration-500" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
        </div>
        {open && (
          <div id="all-steps" className="max-h-[70vh] animate-fade-in overflow-y-auto border-t border-slate-100 bg-white px-4 py-3 shadow-pop">
            <Stepper steps={steps} currentStep={currentIndex} skipped={skippedIdx} onStepClick={handleStepClick} isClickable={canVisit} />
          </div>
        )}
      </header>

      {/* Content column */}
      <div className="flex min-h-screen min-w-0 flex-col lg:h-screen lg:min-h-0">
        <main id="main-content" className="flex-1 px-4 pb-32 pt-6 sm:px-6 lg:overflow-y-auto lg:px-10 lg:pb-10 lg:pt-12">
          <div className={cn("mx-auto w-full animate-fade-up", aside ? "max-w-5xl" : "max-w-2xl")}>
            {!hideChrome && title && (
              <div className="mb-6">
                <p className="mb-1 hidden text-xs font-semibold uppercase tracking-wider text-brand-700 lg:block">
                  Step {currentIndex + 1} of {total}
                </p>
                <h1 className="font-heading text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
                  {title}
                </h1>
                {description && <p className="mt-1.5 text-[15px] text-slate-600">{description}</p>}
              </div>
            )}
            {aside ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="space-y-5">{children}</div>
                <div className="hidden lg:sticky lg:top-0 lg:block">{aside}</div>
              </div>
            ) : (
              <div className="space-y-5">{children}</div>
            )}
          </div>
        </main>

        {footer && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-safe backdrop-blur sm:px-6 lg:static lg:border-t lg:px-10 lg:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
