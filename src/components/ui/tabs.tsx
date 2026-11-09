"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

/** Underline tabs: for switching sections of a page. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("scroll-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      <div role="tablist" aria-label={label} className="flex min-w-max gap-1 border-b border-slate-200">
        {items.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative flex h-11 items-center gap-2 px-4 text-[15px] font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 rounded-t-lg",
                active ? "text-brand-700" : "text-slate-500 hover:text-ink"
              )}
            >
              {t.icon}
              {t.label}
              {t.count != null && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular",
                    active ? "bg-brand-100 text-brand-800" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {t.count}
                </span>
              )}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-0.5 rounded-full transition-all",
                  active ? "bg-brand-600" : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Pill segmented control: for filters and small mode switches. */
export function Segmented<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
  fullWidth,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex gap-1 rounded-xl bg-slate-100 p-1", fullWidth && "flex w-full", className)}
    >
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-center text-[13.5px] font-semibold leading-tight transition-all",
              fullWidth ? "min-w-0 px-2" : "whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20",
              fullWidth && "flex-1",
              active ? "bg-white text-ink shadow-xs" : "text-slate-600 hover:text-ink"
            )}
          >
            {t.icon}
            {t.label}
            {t.count != null && (
              <span className={cn("text-[11px] font-bold tabular", active ? "text-brand-700" : "text-slate-400")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
