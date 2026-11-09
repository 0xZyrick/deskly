"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, fieldBase } from "./input";
import { IconChevronDown } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

/**
 * Styled native <select>: gets the OS picker on phones, full keyboard and
 * screen-reader support everywhere, and no custom listbox to maintain.
 */
export function Select({
  className,
  label,
  error,
  hint,
  options,
  placeholder,
  loading,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  optional,
  id,
  name,
}: SelectProps) {
  const autoId = React.useId();
  const selectId = id || autoId;
  const controlled = value !== undefined;

  return (
    <Field id={selectId} label={label} error={error} hint={hint} required={required} optional={optional}>
      <div className="relative">
        <select
          id={selectId}
          name={name}
          disabled={disabled || loading}
          required={required}
          {...(controlled ? { value } : { defaultValue: defaultValue ?? (placeholder ? "" : undefined) })}
          onChange={(e) => onChange?.({ target: { value: e.target.value, name } })}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          className={cn(
            fieldBase,
            "h-12 cursor-pointer appearance-none truncate pl-3.5 pr-10",
            error ? "border-danger" : "border-slate-200 hover:border-slate-300",
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <IconChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </Field>
  );
}
