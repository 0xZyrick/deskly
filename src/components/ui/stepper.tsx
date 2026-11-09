import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck } from "./icons";

export interface Step {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-based
  className?: string;
  onStepClick?: (index: number) => void;
  /** "vertical" suits sidebars; "horizontal" suits wide headers */
  orientation?: "vertical" | "horizontal";
  /** Indexes that were skipped (rendered with a dashed marker) */
  skipped?: number[];
  /** Indexes that may be clicked even if not yet reached */
  isClickable?: (index: number) => boolean;
  tone?: "light" | "dark";
  /** Kept for backwards compatibility */
  allowClickCompleted?: boolean;
}

export function Stepper({
  steps,
  currentStep,
  className,
  onStepClick,
  orientation = "vertical",
  skipped = [],
  isClickable,
  tone = "light",
}: StepperProps) {
  const dark = tone === "dark";
  const vertical = orientation === "vertical";

  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className={cn(vertical ? "flex flex-col" : "flex items-start gap-2")}>
        {steps.map((step, index) => {
          const done = index < currentStep && !skipped.includes(index);
          const skip = skipped.includes(index);
          const current = index === currentStep;
          const clickable = !!onStepClick && (isClickable ? isClickable(index) : index < currentStep);
          const last = index === steps.length - 1;

          const marker = (
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold transition-all",
                done && (dark ? "border-brand-300 bg-brand-300 text-brand-950" : "border-brand-600 bg-brand-600 text-white"),
                skip && (dark ? "border-dashed border-white/40 text-white/60" : "border-dashed border-slate-300 bg-white text-slate-400"),
                current &&
                  (dark
                    ? "border-white bg-white text-brand-900 shadow-[0_0_0_5px_rgba(255,255,255,.14)]"
                    : "border-brand-600 bg-white text-brand-700 shadow-ring"),
                !done && !skip && !current && (dark ? "border-white/25 text-white/50" : "border-slate-200 bg-white text-slate-400")
              )}
            >
              {done ? <IconCheck size={15} strokeWidth={3} /> : index + 1}
            </span>
          );

          const text = (
            <span className="min-w-0 flex-1 text-left">
              <span
                className={cn(
                  "block text-[14.5px] font-semibold leading-tight",
                  current ? (dark ? "text-white" : "text-ink") : done ? (dark ? "text-white/90" : "text-ink") : dark ? "text-white/55" : "text-slate-500"
                )}
              >
                {step.title}
                {step.optional && (
                  <span className={cn("ml-1.5 text-[11px] font-medium", dark ? "text-white/45" : "text-slate-400")}>Optional</span>
                )}
                {skip && <span className={cn("ml-1.5 text-[11px] font-medium", dark ? "text-white/45" : "text-slate-400")}>Skipped</span>}
              </span>
              {step.description && (
                <span className={cn("mt-0.5 block text-xs", dark ? "text-white/50" : "text-slate-500")}>{step.description}</span>
              )}
            </span>
          );

          return (
            <li key={step.id} className={cn("relative", vertical ? "pb-1" : "flex-1")}>
              {vertical && !last && (
                <span
                  className={cn(
                    "absolute left-4 top-8 -ml-px h-[calc(100%-1.5rem)] w-0.5",
                    done ? (dark ? "bg-brand-300/70" : "bg-brand-500") : dark ? "bg-white/15" : "bg-slate-200"
                  )}
                  aria-hidden
                />
              )}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(index)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl py-1.5 pr-2 text-left transition-colors",
                  clickable ? (dark ? "hover:bg-white/5" : "hover:bg-slate-50") : "cursor-default",
                  !vertical && "flex-col items-center gap-2 text-center"
                )}
              >
                {marker}
                {text}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
