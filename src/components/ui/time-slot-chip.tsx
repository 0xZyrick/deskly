import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimeSlotChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  time: string;
  selected?: boolean;
  unavailable?: boolean;
  loading?: boolean;
}

export function TimeSlotChip({
  time,
  selected = false,
  unavailable = false,
  loading = false,
  className,
  disabled,
  ...props
}: TimeSlotChipProps) {
  return (
    <button
      type="button"
      disabled={disabled || unavailable || loading}
      aria-pressed={selected}
      aria-label={unavailable ? `${time} unavailable` : selected ? `${time} selected` : `Select ${time}`}
      className={cn(
        "inline-flex h-12 min-w-[84px] items-center justify-center rounded-xl border px-3.5 text-[15px] font-semibold tabular-nums transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 active:scale-[0.97]",
        selected &&
          "border-brand-600 bg-brand-600 text-white shadow-glow",
        !selected &&
          !unavailable &&
          "border-slate-200 bg-white text-ink shadow-xs hover:border-brand-400 hover:bg-brand-50",
        unavailable && "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through",
        loading && "cursor-wait opacity-60",
        className
      )}
      {...props}
    >
      {time}
    </button>
  );
}
