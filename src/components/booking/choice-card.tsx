import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck } from "@/components/ui/icons";

/** Large radio-style selectable card used across booking steps. */
export function ChoiceCard({
  selected,
  onSelect,
  icon,
  title,
  description,
  meta,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 active:scale-[0.992]",
        selected
          ? "border-brand-600 bg-brand-50/50 shadow-[0_0_0_1px_#0F7F76]"
          : "border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-card",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
            selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-700"
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-snug text-ink">{title}</span>
        {description && <span className="mt-0.5 block text-[13.5px] leading-snug text-slate-500">{description}</span>}
        {meta && <span className="mt-2 block text-[13px] font-medium text-slate-700">{meta}</span>}
      </span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white"
        )}
        aria-hidden
      >
        {selected && <IconCheck size={13} strokeWidth={3.2} />}
      </span>
    </button>
  );
}
