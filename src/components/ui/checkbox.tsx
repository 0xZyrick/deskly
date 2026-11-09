"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked = false,
  onChange,
  label,
  description,
  disabled,
  id,
  className,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}) {
  const autoId = React.useId();
  const inputId = id || autoId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group inline-flex min-h-[28px] cursor-pointer select-none items-start gap-3",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md border-[1.5px] transition-all",
            "peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/25",
            checked
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-slate-300 bg-white group-hover:border-slate-400"
          )}
          aria-hidden
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={cn("transition-transform", checked ? "scale-100" : "scale-0")}
          >
            <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-[15px] font-medium leading-snug text-ink">{label}</span>}
          {description && <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">{description}</span>}
        </span>
      )}
    </label>
  );
}

/** iOS-style toggle */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}) {
  const autoId = React.useId();
  const switchId = id || autoId;
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {(label || description) && (
        <label htmlFor={switchId} className="min-w-0 flex-1 cursor-pointer">
          {label && <span className="block text-[15px] font-semibold text-ink">{label}</span>}
          {description && <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">{description}</span>}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-brand-600" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)] transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
