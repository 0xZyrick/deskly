import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "w-full rounded-xl border bg-white text-ink placeholder:text-slate-400 shadow-xs transition " +
  "focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/15 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";

/** Label + hint + error wrapper shared by every form control */
export function Field({
  id,
  label,
  error,
  hint,
  required,
  optional,
  children,
  className,
}: {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[13.5px] font-semibold text-ink">
          <span>
            {label}
            {required && (
              <span className="ml-0.5 text-danger" aria-hidden>
                *
              </span>
            )}
          </span>
          {optional && <span className="text-xs font-normal text-slate-400">Optional</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-danger-dark" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="mt-0.5 shrink-0" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5h.01" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  loading?: boolean;
  optional?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, label, error, hint, loading, optional, leading, trailing, id, disabled, required, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id || autoId;
    return (
      <Field id={inputId} label={label} error={error} hint={hint} required={required} optional={optional} className={wrapperClassName}>
        <div className="relative">
          {leading && (
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">{leading}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled || loading}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              fieldBase,
              "h-12 px-3.5",
              leading && "pl-10",
              trailing && "pr-10",
              error ? "border-danger focus-visible:border-danger focus-visible:ring-danger/15" : "border-slate-200 hover:border-slate-300",
              className
            )}
            {...props}
          />
          {trailing && <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">{trailing}</span>}
        </div>
      </Field>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, optional, id, required, ...props }, ref) => {
    const autoId = React.useId();
    const taId = id || autoId;
    return (
      <Field id={taId} label={label} error={error} hint={hint} required={required} optional={optional}>
        <textarea
          ref={ref}
          id={taId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${taId}-error` : hint ? `${taId}-hint` : undefined}
          className={cn(
            fieldBase,
            "min-h-[104px] resize-y px-3.5 py-3 leading-relaxed",
            error ? "border-danger" : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
      </Field>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
