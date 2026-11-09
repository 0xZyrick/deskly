import * as React from "react";
import { cn } from "@/lib/utils";

export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show"
  | "waitlist";

export interface StatusChipProps {
  status: AppointmentStatus;
  className?: string;
  size?: "sm" | "md";
}

export const STATUS_META: Record<AppointmentStatus, { label: string; chip: string; dot: string }> = {
  scheduled: { label: "Scheduled", chip: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  "checked-in": { label: "Checked in", chip: "bg-brand-50 text-brand-800", dot: "bg-brand-500" },
  "in-progress": { label: "In progress", chip: "bg-sky-50 text-sky-800", dot: "bg-sky-500" },
  completed: { label: "Completed", chip: "bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", chip: "bg-rose-50 text-rose-800", dot: "bg-rose-400" },
  "no-show": { label: "No show", chip: "bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  waitlist: { label: "Waitlist", chip: "bg-violet-50 text-violet-800", dot: "bg-violet-500" },
};

export function StatusChip({ status, className, size = "md" }: StatusChipProps) {
  const c = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        c.chip,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} aria-hidden />
      {c.label}
    </span>
  );
}

/** Generic tone pill for payments, reminders, simple labels. */
export type Tone = "neutral" | "brand" | "ok" | "warn" | "danger" | "info" | "violet";
const TONES: Record<Tone, { chip: string; dot: string }> = {
  neutral: { chip: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  brand: { chip: "bg-brand-50 text-brand-800", dot: "bg-brand-500" },
  ok: { chip: "bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  warn: { chip: "bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  danger: { chip: "bg-rose-50 text-rose-800", dot: "bg-rose-500" },
  info: { chip: "bg-sky-50 text-sky-800", dot: "bg-sky-500" },
  violet: { chip: "bg-violet-50 text-violet-800", dot: "bg-violet-500" },
};

export function Badge({
  tone = "neutral",
  dot = true,
  size = "md",
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        t.chip,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} aria-hidden />}
      {children}
    </span>
  );
}
