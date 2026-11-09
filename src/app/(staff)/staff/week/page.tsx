"use client";

import * as React from "react";
import Link from "next/link";
import {
  Button,
  EmptyState,
  IconAlert,
  IconButton,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  Skeleton,
  STATUS_META,
} from "@/components/ui";
import { StaffShell } from "@/components/staff/shell";
import { DEMO_TODAY, addDays, cn, formatDate, startOfWeek, timeOf } from "@/lib/utils";
import type { Appointment, Patient } from "@/types";

const INACTIVE = ["cancelled", "no-show"];

export default function StaffWeekPage() {
  const [start, setStart] = React.useState(startOfWeek(DEMO_TODAY));
  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(start, i)), [start]);

  const [byDate, setByDate] = React.useState<Record<string, Appointment[]>>({});
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const load = React.useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      Promise.all(
        days.map((date) =>
          fetch(`/api/appointments?date=${date}`)
            .then((r) => {
              if (!r.ok) throw new Error("load failed");
              return r.json();
            })
            .then((json) => [date, (json.data ?? []) as Appointment[]] as const)
        )
      ),
      fetch("/api/patients").then((r) => r.json()),
    ])
      .then(([results, pats]) => {
        const map: Record<string, Appointment[]> = {};
        results.forEach(([date, data]) => {
          map[date] = [...data].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
        });
        setByDate(map);
        setPatients(pats.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load the week overview. Try again.");
        setLoading(false);
      });
  }, [days]);

  React.useEffect(() => {
    load();
  }, [load]);

  const patientMap = React.useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);
  const nameOf = (a: Appointment) => {
    const p = patientMap.get(a.patientId);
    return p ? `${p.firstName} ${p.lastName}` : "Patient";
  };

  const total = days.reduce((n, d) => n + (byDate[d] ?? []).filter((a) => !INACTIVE.includes(a.status)).length, 0);
  const isThisWeek = start === startOfWeek(DEMO_TODAY);

  const rangeLabel = `${formatDate(days[0], { day: "numeric", month: "short" })} – ${formatDate(days[6], {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const controls = (
    <div className="flex items-center gap-1.5">
      <IconButton label="Previous week" onClick={() => setStart(addDays(start, -7))} className="border border-slate-200 bg-white">
        <IconChevronLeft size={18} />
      </IconButton>
      <IconButton label="Next week" onClick={() => setStart(addDays(start, 7))} className="border border-slate-200 bg-white">
        <IconChevronRight size={18} />
      </IconButton>
      {!isThisWeek && (
        <Button variant="secondary" size="sm" className="h-10" onClick={() => setStart(startOfWeek(DEMO_TODAY))}>
          This week
        </Button>
      )}
    </div>
  );

  const pill = (a: Appointment) => {
    const meta = STATUS_META[a.status];
    const dim = INACTIVE.includes(a.status);
    return (
      <li
        key={a.id}
        className={cn("flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs", dim && "opacity-55")}
        title={`${nameOf(a)} · ${meta.label}`}
      >
        <span className={cn("h-2 w-2 shrink-0 rounded-full", meta.dot)} aria-hidden />
        <span className="font-semibold tabular text-ink">{timeOf(a.startsAt)}</span>
        <span className={cn("min-w-0 flex-1 truncate text-slate-600", dim && "line-through")}>{nameOf(a)}</span>
      </li>
    );
  };

  return (
    <StaffShell title="Week overview" subtitle={rangeLabel} actions={controls}>
      {error && (
        <div role="alert" className="card mb-4 flex flex-col items-start gap-3 border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <IconAlert size={20} />
          </span>
          <p className="flex-1 text-sm font-medium text-rose-900">{error}</p>
          <Button variant="outline" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <p className="mb-4 text-sm text-slate-600">
          <span className="font-semibold text-ink">{total}</span> active appointment{total === 1 ? "" : "s"} this week
        </p>
      )}

      {loading && (
        <div className="grid gap-3 lg:grid-cols-7" aria-busy>
          {days.map((d) => (
            <Skeleton key={d} className="h-40 w-full rounded-2xl lg:h-72" />
          ))}
        </div>
      )}

      {!loading && !error && total === 0 && (
        <EmptyState
          icon={<IconCalendar size={26} />}
          title="Nothing booked this week"
          description="Use the arrows to look at another week."
          secondaryAction={{ label: "Back to this week", onClick: () => setStart(startOfWeek(DEMO_TODAY)) }}
        />
      )}

      {!loading && !error && total > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2.5">
          {days.map((date) => {
            const apts = byDate[date] ?? [];
            const active = apts.filter((a) => !INACTIVE.includes(a.status));
            const dt = new Date(date + "T12:00:00");
            const weekend = dt.getDay() === 0 || dt.getDay() === 6;
            const today = date === DEMO_TODAY;
            return (
              <Link
                key={date}
                href={`/staff/day?date=${date}`}
                aria-label={`${formatDate(date)}, ${active.length} active appointments`}
                className={cn(
                  "card flex min-h-[132px] flex-col p-3 transition hover:border-brand-300 hover:shadow-pop lg:min-h-[320px]",
                  weekend && "bg-slate-50/70",
                  today && "border-brand-500 ring-4 ring-brand-500/10"
                )}
              >
                <div className="flex items-center justify-between gap-2 lg:flex-col lg:items-start lg:gap-1">
                  <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0">
                    <span className={cn("text-[11px] font-bold uppercase tracking-wider", today ? "text-brand-700" : "text-slate-500")}>
                      {dt.toLocaleDateString("en-GB", { weekday: "short" })}
                    </span>
                    <span
                      className={cn(
                        "font-heading text-xl font-semibold tabular",
                        today ? "text-brand-700" : weekend ? "text-slate-400" : "text-ink"
                      )}
                    >
                      {dt.getDate()}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold tabular",
                      active.length ? "bg-brand-50 text-brand-800" : "bg-slate-100 text-slate-400"
                    )}
                  >
                    {active.length} active
                  </span>
                </div>
                {apts.length === 0 ? (
                  <p className="mt-3 text-xs text-slate-400">{weekend ? "Closed" : "Free day"}</p>
                ) : (
                  <ul className="mt-3 space-y-1.5">
                    {apts.slice(0, 5).map(pill)}
                    {apts.length > 5 && <li className="px-1 text-xs font-medium text-slate-500">+{apts.length - 5} more</li>}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </StaffShell>
  );
}
