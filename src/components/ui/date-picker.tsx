"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, fieldBase } from "./input";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label?: string;
  error?: string;
  hint?: string;
  value?: string; // YYYY-MM-DD
  onChange?: (value: string) => void;
  loading?: boolean;
}

export function DatePicker({ className, label, error, hint, value, onChange, id, disabled, loading, required, ...props }: DatePickerProps) {
  const autoId = React.useId();
  const inputId = id || autoId;
  return (
    <Field id={inputId} label={label} error={error} hint={hint} required={required}>
      <input
        type="date"
        id={inputId}
        value={value ?? ""}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled || loading}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(
          fieldBase,
          "h-12 px-3.5",
          error ? "border-danger" : "border-slate-200 hover:border-slate-300",
          className
        )}
        {...props}
      />
    </Field>
  );
}
