import * as React from "react";
import { cn, initials, avatarTone } from "@/lib/utils";

/** Rounded white panel. `padded` adds standard inner spacing. */
export function Card({
  className,
  padded = false,
  as: Tag = "div",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { padded?: boolean; as?: React.ElementType }) {
  return (
    <Tag className={cn("card", padded && "p-5 sm:p-6", className)} {...props}>
      {children}
    </Tag>
  );
}

/** Small KPI tile used on staff dashboards. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
  loading,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "brand" | "ok" | "warn" | "danger" | "info" | "neutral";
  loading?: boolean;
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    ok: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    info: "bg-sky-50 text-sky-700",
    neutral: "bg-slate-100 text-slate-600",
  };
  return (
    <div className={cn("card flex items-start gap-3 p-4", className)}>
      {icon && (
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-slate-500">{label}</p>
        {loading ? (
          <div className="skeleton mt-1.5 h-7 w-16" />
        ) : (
          <p className="mt-0.5 font-heading text-[26px] font-semibold leading-tight tracking-tight text-ink tabular">
            {value}
          </p>
        )}
        {hint && <p className="mt-0.5 truncate text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}

/** Page title block for staff / onboarding content areas. */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-1">{eyebrow}</div>}
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[15px] text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizes[size],
        avatarTone(name),
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function InlineAlert({
  tone = "info",
  title,
  children,
  action,
  className,
  role,
}: {
  tone?: "info" | "ok" | "warn" | "danger";
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  role?: "alert" | "status";
}) {
  const t = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    ok: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-900",
  }[tone];
  return (
    <div role={role ?? (tone === "danger" ? "alert" : "status")} className={cn("rounded-xl border px-4 py-3 text-sm", t, className)}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={cn(title && "mt-0.5", "opacity-90")}>{children}</div>}
      {action && <div className="mt-2.5">{action}</div>}
    </div>
  );
}

/** Label/value rows used in summaries and confirmations. */
export function DetailList({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-slate-100", className)}>
      {items.map((i) => (
        <div key={i.label} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <dt className="text-sm text-slate-500">{i.label}</dt>
          <dd className="text-right text-sm font-semibold text-ink">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
