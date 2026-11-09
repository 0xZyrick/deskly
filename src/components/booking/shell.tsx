"use client";

import * as React from "react";
import Link from "next/link";
import { useBooking } from "@/lib/booking/context";
import { useCatalog } from "@/lib/booking/catalog";
import { getBookingStepIndex } from "@/lib/booking/types";
import type { BookingStepId } from "@/lib/booking/types";
import { SimulatedBadge } from "@/components/ui/simulated-badge";
import { Skeleton } from "@/components/ui/surfaces";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconMapPin,
  IconPhone,
  IconStethoscope,
  IconUser,
  IconWallet,
} from "@/components/ui/icons";
import { cn, formatDate, formatMoney, timeOf } from "@/lib/utils";

const STEPS: { id: BookingStepId; label: string }[] = [
  { id: "service", label: "Service" },
  { id: "clinician", label: "Clinician" },
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
  { id: "intake", label: "Intake" },
  { id: "consent", label: "Consent" },
  { id: "deposit", label: "Deposit" },
];

export function ClinicBadge({ size = 36 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl bg-brand-gradient font-heading text-xs font-bold text-white shadow-xs"
      style={{ width: size, height: size }}
      aria-hidden
    >
      HL
    </span>
  );
}

/** Sticky header shared by the booking steps and the manage page. */
export function BookingHeader({ right, progress }: { right?: React.ReactNode; progress?: number }) {
  const { clinic } = useCatalog();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-xl" aria-label="Back to Deskly home">
          <ClinicBadge />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold leading-tight text-ink">
              {clinic?.name ?? "Harbour Light Clinic"}
            </span>
            <span className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
              Book online
              <SimulatedBadge />
            </span>
          </span>
        </Link>
        {right}
      </div>
      {progress != null && (
        <div className="h-1 bg-slate-100" role="presentation">
          <div
            className="h-full rounded-r-full bg-brand-600 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}

function useSummary() {
  const { state } = useBooking();
  const { services, clinicians, clinic } = useCatalog();
  const service = services.find((s) => s.id === state.serviceId);
  const clinician = clinicians.find((c) => c.id === state.clinicianId);
  const when = state.startsAt
    ? `${formatDate(state.startsAt.slice(0, 10), { weekday: "short", day: "numeric", month: "short" })}, ${timeOf(state.startsAt)}`
    : null;
  const deposit = clinic?.depositRequired ? clinic.depositAmountMinor : 0;
  return { state, service, clinician, clinic, when, deposit };
}

function SummaryRow({
  icon,
  label,
  value,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  placeholder: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          value ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-400"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={cn("text-[15px] leading-snug", value ? "font-semibold text-ink" : "text-slate-400")}>
          {value ?? placeholder}
        </p>
      </div>
    </li>
  );
}

function VisitSummary() {
  const { state, service, clinician, clinic, when, deposit } = useSummary();
  const clinicianLabel = state.serviceId ? (clinician ? clinician.name : state.step === "service" || state.step === "clinician" ? undefined : "First available") : undefined;
  return (
    <aside aria-label="Your visit" className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-brand-950 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">Your visit</p>
        <p className="mt-0.5 font-heading text-lg font-semibold">{service?.name ?? "Choose a service"}</p>
      </div>
      <ul className="space-y-4 p-5">
        <SummaryRow
          icon={<IconStethoscope size={18} />}
          label="Service"
          value={service ? `${service.name} · ${service.durationMinutes} min` : undefined}
          placeholder="Not chosen yet"
        />
        <SummaryRow icon={<IconUser size={18} />} label="Clinician" value={clinicianLabel} placeholder="Not chosen yet" />
        <SummaryRow icon={<IconCalendar size={18} />} label="Date and time" value={when} placeholder="Pick a time" />
      </ul>
      {service && (
        <div className="space-y-2 border-t border-dashed border-slate-200 bg-slate-50/70 px-5 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Visit fee</span>
            <span className="font-semibold tabular text-ink">{formatMoney(service.priceMinor)}</span>
          </div>
          {deposit > 0 && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <IconWallet size={15} /> Deposit due now
              </span>
              <span className="font-semibold tabular text-brand-700">{formatMoney(deposit)}</span>
            </div>
          )}
        </div>
      )}
      {clinic && (
        <div className="space-y-2 border-t border-slate-100 px-5 py-4 text-[13px] text-slate-600">
          <p className="flex items-start gap-2">
            <IconMapPin size={16} className="mt-0.5 text-slate-400" />
            {clinic.address}
          </p>
          <p className="flex items-center gap-2">
            <IconPhone size={16} className="text-slate-400" />
            {clinic.phone}
          </p>
        </div>
      )}
    </aside>
  );
}

function MobileSummaryChip() {
  const { service, clinician, when } = useSummary();
  if (!service) return null;
  const parts = [service.name, clinician?.name, when].filter(Boolean);
  return (
    <div className="mb-4 flex items-center gap-2 overflow-hidden rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-[13px] font-medium text-brand-900 lg:hidden">
      <IconClock size={15} className="shrink-0 text-brand-600" />
      <span className="truncate">{parts.join(" · ")}</span>
    </div>
  );
}

function StepRail({ index }: { index: number }) {
  return (
    <ol className="mb-6 hidden items-center gap-1 lg:flex" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const done = i < index;
        const current = i === index;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-1 last:flex-none" aria-current={current ? "step" : undefined}>
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                  done && "bg-brand-600 text-white",
                  current && "bg-brand-600 text-white shadow-ring",
                  !done && !current && "bg-slate-100 text-slate-400"
                )}
              >
                {done ? <IconCheck size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("text-[13px] font-semibold", current ? "whitespace-nowrap text-ink" : "sr-only")}>
                {s.label}
              </span>
            </span>
            {i < STEPS.length - 1 && <span className={cn("mx-1 h-px flex-1", done ? "bg-brand-300" : "bg-slate-200")} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function ShellSkeleton() {
  return (
    <div className="min-h-screen bg-canvas" role="status" aria-label="Loading booking">
      <div className="h-16 border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function BookingShell({
  step,
  children,
  title,
  subtitle,
  footer,
}: {
  step: BookingStepId;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}) {
  const { isHydrated } = useBooking();
  const index = getBookingStepIndex(step);
  const isConfirm = step === "confirmation";
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (isHydrated) headingRef.current?.focus({ preventScroll: true });
  }, [isHydrated, step, title]);

  if (!isHydrated) return <ShellSkeleton />;

  const progress = isConfirm ? 100 : ((index + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#booking-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow-pop"
      >
        Skip to content
      </a>
      <BookingHeader
        progress={isConfirm ? undefined : progress}
        right={
          <p className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 tabular">
            {isConfirm ? "Confirmed" : `Step ${index + 1} of ${STEPS.length}`}
          </p>
        }
      />

      <div
        className={cn(
          "mx-auto w-full px-4 pt-5 sm:px-6 sm:pt-8 lg:pt-10",
          isConfirm ? "max-w-2xl" : "max-w-5xl lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8",
          footer ? "pb-32 lg:pb-12" : "pb-12"
        )}
      >
        <main id="booking-main" className="min-w-0">
          {!isConfirm && <MobileSummaryChip />}
          <div className={cn(!isConfirm && "lg:card lg:p-8")}>
            {!isConfirm && <StepRail index={index} />}
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-[26px] font-semibold leading-tight tracking-tight text-ink outline-none sm:text-3xl"
            >
              {title}
            </h1>
            {subtitle && <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">{subtitle}</p>}
            <div className="mt-6 animate-fade-up">{children}</div>

            {footer && (
              <div
                className={cn(
                  "fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-xl",
                  "lg:static lg:z-auto lg:mt-8 lg:border-t lg:border-slate-100 lg:bg-transparent lg:pt-6 lg:backdrop-blur-none"
                )}
              >
                <div className="mx-auto flex w-full max-w-5xl gap-2.5 px-4 pb-safe pt-3 sm:px-6 lg:max-w-none lg:p-0 [&>*:last-child]:flex-1 lg:[&>*:last-child]:flex-none lg:justify-between">
                  {footer}
                </div>
              </div>
            )}
          </div>
        </main>

        {!isConfirm && (
          <div className="mt-8 hidden lg:sticky lg:top-24 lg:mt-0 lg:block">
            <VisitSummary />
          </div>
        )}
      </div>
    </div>
  );
}
