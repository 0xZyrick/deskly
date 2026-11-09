"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, IconCopy, InlineAlert, Switch } from "@/components/ui";
import { OnboardingShell, StepFooter } from "@/components/onboarding/shell";
import { useOnboarding } from "@/lib/onboarding/context";
import { getNextStep, getPrevStep } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
type Day = (typeof DAYS)[number];

const DAY_LABELS: Record<Day, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const timeClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-ink shadow-xs focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15";

export default function HoursStepPage() {
  const router = useRouter();
  const { state, setState, completeStep, skipStep } = useOnboarding();
  const [showErrors, setShowErrors] = React.useState(false);

  const hours = state.hours;

  const setDay = (day: Day, value: { start: string; end: string }[] | "closed") => {
    setState((prev) => ({ ...prev, hours: { ...prev.hours, [day]: value } }));
  };

  const rangeOf = (day: Day) => {
    const v = hours[day];
    return Array.isArray(v) && v[0] ? v[0] : { start: "09:00", end: "17:00" };
  };
  const isClosed = (day: Day) => hours[day] === "closed" || hours[day] === "skipped";
  const invalid = (day: Day) => {
    if (isClosed(day)) return false;
    const r = rangeOf(day);
    return !r.start || !r.end || r.end <= r.start;
  };
  const anyInvalid = DAYS.some(invalid);

  const applyMondayToWeekdays = () => {
    const mon = hours.monday;
    const value = Array.isArray(mon) && mon[0] ? [{ ...mon[0] }] : "closed";
    setState((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        tuesday: value === "closed" ? "closed" : [{ ...value[0] }],
        wednesday: value === "closed" ? "closed" : [{ ...value[0] }],
        thursday: value === "closed" ? "closed" : [{ ...value[0] }],
        friday: value === "closed" ? "closed" : [{ ...value[0] }],
      },
    }));
  };

  const handleContinue = () => {
    if (anyInvalid) {
      setShowErrors(true);
      return;
    }
    completeStep("hours");
    const next = getNextStep("hours");
    if (next) router.push(`/onboarding/${next}`);
  };

  const handleSkip = () => {
    skipStep("hours");
    const next = getNextStep("hours");
    if (next) router.push(`/onboarding/${next}`);
  };

  const openDays = DAYS.filter((d) => !isClosed(d)).length;

  return (
    <OnboardingShell
      title="Opening hours"
      description="Set when the clinic is open. You can skip this and configure later."
      footer={
        <StepFooter
          onBack={() => {
            const prev = getPrevStep("hours");
            if (prev) router.push(`/onboarding/${prev}`);
          }}
          onSkip={handleSkip}
          onPrimary={handleContinue}
        />
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          Open {openDays} day{openDays === 1 ? "" : "s"} a week
        </p>
        <Button variant="secondary" size="sm" onClick={applyMondayToWeekdays}>
          <IconCopy size={16} /> Apply Monday to all weekdays
        </Button>
      </div>

      <Card className="divide-y divide-slate-100">
        {DAYS.map((day) => {
          const closed = isClosed(day);
          const range = rangeOf(day);
          const bad = showErrors && invalid(day);
          return (
            <div key={day} className={cn("px-4 py-4 transition-colors sm:px-5", closed && "bg-slate-50/60")}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <div className="flex w-full items-center justify-between sm:w-44">
                  <span className={cn("font-semibold", closed ? "text-slate-400" : "text-ink")}>{DAY_LABELS[day]}</span>
                  <Switch
                    checked={!closed}
                    onChange={(on) => setDay(day, on ? [{ start: "09:00", end: "17:00" }] : "closed")}
                    className="[&>button]:ml-3"
                  />
                  <span className="sr-only">{DAY_LABELS[day]} open</span>
                </div>
                {closed ? (
                  <span className="text-sm text-slate-400">Closed</span>
                ) : (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="time"
                      value={range.start}
                      onChange={(e) => setDay(day, [{ start: e.target.value, end: range.end }])}
                      className={cn(timeClass, bad && "border-danger")}
                      aria-label={`${DAY_LABELS[day]} open time`}
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={range.end}
                      onChange={(e) => setDay(day, [{ start: range.start, end: e.target.value }])}
                      className={cn(timeClass, bad && "border-danger")}
                      aria-label={`${DAY_LABELS[day]} close time`}
                    />
                  </div>
                )}
              </div>
              {bad && (
                <p className="mt-2 text-[13px] font-medium text-danger-dark" role="alert">
                  Closing time must be after opening time.
                </p>
              )}
            </div>
          );
        })}
      </Card>

      {showErrors && anyInvalid && <InlineAlert tone="danger">Fix the highlighted days to continue, or skip this step.</InlineAlert>}
    </OnboardingShell>
  );
}
