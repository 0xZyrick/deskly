"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  IconButton,
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
  IconPhone,
  IconPlus,
  IconSearch,
  IconUsers,
  IconWalkIn,
  IconAlert,
  Input,
  Segmented,
  Select,
  Skeleton,
  StatCard,
  StatusChip,
  useToasts,
  IconClock,
  IconCheckCircle,
  IconLayout,
} from "@/components/ui";
import { StaffShell } from "@/components/staff/shell";
import { AppointmentDrawer } from "@/components/staff/appointment-drawer";
import { WalkInModal } from "@/components/staff/walk-in-modal";
import { DEMO_TODAY, addDays, cn, formatDate, timeOf } from "@/lib/utils";
import type { Appointment, Patient, Service, Clinician, WaitlistEntry } from "@/types";

type Filter = "all" | "upcoming" | "checked" | "done";

const CAPACITY = 8;

function DayInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get("date") || DEMO_TODAY;
  const { push, node: toastNode } = useToasts();

  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [clinicians, setClinicians] = React.useState<Clinician[]>([]);
  const [waitlist, setWaitlist] = React.useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [clinicianFilter, setClinicianFilter] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [walkInOpen, setWalkInOpen] = React.useState(false);

  const setDate = (d: string) => {
    if (!d) return;
    router.replace(`/staff/day?date=${d}`);
  };

  const load = React.useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`/api/appointments?date=${date}`).then((r) => {
        if (!r.ok) throw new Error("Failed to load appointments");
        return r.json();
      }),
      fetch("/api/patients").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/clinicians").then((r) => r.json()),
      fetch("/api/waitlist").then((r) => r.json()),
    ])
      .then(([apts, pats, svcs, clins, wl]) => {
        setAppointments(apts.data ?? []);
        setPatients(pats.data ?? []);
        setServices(svcs.data ?? []);
        setClinicians(clins.data ?? []);
        setWaitlist(wl.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load the day schedule. Check your connection and try again.");
        setLoading(false);
      });
  }, [date]);

  React.useEffect(() => {
    load();
  }, [load]);

  const patientMap = React.useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);
  const serviceMap = React.useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);
  const clinicianMap = React.useMemo(() => new Map(clinicians.map((c) => [c.id, c])), [clinicians]);

  const sorted = React.useMemo(
    () => [...appointments].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [appointments]
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((a) => {
      if (clinicianFilter && a.clinicianId !== clinicianFilter) return false;
      if (filter === "upcoming" && a.status !== "scheduled") return false;
      if (filter === "checked" && !["checked-in", "in-progress"].includes(a.status)) return false;
      if (filter === "done" && !["completed", "cancelled", "no-show"].includes(a.status)) return false;
      if (!q) return true;
      const p = patientMap.get(a.patientId);
      if (!p) return false;
      return (
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        !!p.phone?.includes(q) ||
        !!p.email?.toLowerCase().includes(q)
      );
    });
  }, [sorted, search, filter, clinicianFilter, patientMap]);

  const active = appointments.filter((a) => !["cancelled", "no-show"].includes(a.status));
  const checkedIn = appointments.filter((a) => ["checked-in", "in-progress"].includes(a.status)).length;
  const waiting = appointments.filter((a) => a.status === "scheduled").length;
  const utilisation = Math.min(100, Math.round((active.length / CAPACITY) * 100));

  const counts = {
    all: sorted.length,
    upcoming: sorted.filter((a) => a.status === "scheduled").length,
    checked: checkedIn,
    done: sorted.filter((a) => ["completed", "cancelled", "no-show"].includes(a.status)).length,
  };

  const nextUpId = sorted.find((a) => a.status === "scheduled")?.id;
  const selected = appointments.find((a) => a.id === selectedId) ?? null;

  const handleCheckIn = async (id: string) => {
    const prev = appointments;
    setAppointments((list) => list.map((a) => (a.id === id ? { ...a, status: "checked-in" } : a)));
    const p = patientMap.get(appointments.find((a) => a.id === id)?.patientId ?? "");
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "checked-in" }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setAppointments((list) => list.map((a) => (a.id === id ? json.data : a)));
      push({ variant: "success", title: "Checked in", description: p ? `${p.firstName} ${p.lastName} is here.` : undefined });
    } catch {
      setAppointments(prev);
      push({ variant: "error", title: "Could not check in", description: "Please try again." });
    }
  };

  const isToday = date === DEMO_TODAY;

  const dateControls = (
    <div className="flex items-center gap-1.5">
      <IconButton label="Previous day" onClick={() => setDate(addDays(date, -1))} className="border border-slate-200 bg-white">
        <IconChevronLeft size={18} />
      </IconButton>
      <input
        type="date"
        aria-label="Choose date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="h-10 w-[148px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-ink shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
      />
      <IconButton label="Next day" onClick={() => setDate(addDays(date, 1))} className="border border-slate-200 bg-white">
        <IconChevronRight size={18} />
      </IconButton>
      {!isToday && (
        <Button variant="secondary" size="sm" onClick={() => setDate(DEMO_TODAY)} className="h-10">
          Today
        </Button>
      )}
    </div>
  );

  const walkInBtn = (
    <Button variant="primary" onClick={() => setWalkInOpen(true)} className="hidden sm:inline-flex">
      <IconWalkIn size={18} />
      Walk-in
    </Button>
  );

  return (
    <StaffShell
      title={formatDate(date, { weekday: "long", day: "numeric", month: "long" })}
      subtitle={isToday ? "Today · Harbour Light Clinic" : date}
      actions={walkInBtn}
    >
      {toastNode}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">{dateControls}</div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Appointments" value={appointments.length} hint={`${active.length} active`} icon={<IconCalendarCheck size={20} />} loading={loading} />
        <StatCard label="Checked in" value={checkedIn} hint="In the clinic now" icon={<IconCheckCircle size={20} />} tone="ok" loading={loading} />
        <StatCard label="Waiting" value={waiting} hint="Yet to arrive" icon={<IconClock size={20} />} tone="warn" loading={loading} />
        <div className="card p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <IconLayout size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-medium text-slate-500">Capacity</p>
              {loading ? (
                <Skeleton className="mt-1.5 h-7 w-16" />
              ) : (
                <p className="mt-0.5 font-heading text-[26px] font-semibold leading-tight text-ink tabular">{utilisation}%</p>
              )}
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={utilisation} aria-valuemin={0} aria-valuemax={100} aria-label="Day capacity used">
            <div
              className={cn("h-full rounded-full transition-all", utilisation >= 100 ? "bg-rose-500" : utilisation >= 75 ? "bg-amber-500" : "bg-brand-500")}
              style={{ width: `${utilisation}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <div className="lg:w-72">
              <Input
                aria-label="Search appointments"
                placeholder="Search name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leading={<IconSearch size={18} />}
                className="h-11"
              />
            </div>
            <div className="scroll-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:shrink-0">
              <Segmented
                label="Filter by status"
                value={filter}
                onChange={setFilter}
                items={[
                  { id: "all", label: "All", count: counts.all },
                  { id: "upcoming", label: "Upcoming", count: counts.upcoming },
                  { id: "checked", label: "Checked in", count: counts.checked },
                  { id: "done", label: "Done", count: counts.done },
                ]}
              />
            </div>
            {clinicians.length > 1 && (
              <div className="lg:ml-auto lg:w-52">
                <Select
                  placeholder="All clinicians"
                  value={clinicianFilter}
                  onChange={(e) => setClinicianFilter(e.target.value)}
                  options={[{ value: "", label: "All clinicians" }, ...clinicians.map((c) => ({ value: c.id, label: c.name }))]}
                  className="h-11"
                />
              </div>
            )}
          </div>

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

          {loading && (
            <div className="space-y-3" aria-busy>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[76px] w-full rounded-2xl" />
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyState
              icon={<IconCalendarCheck size={26} />}
              title={search || filter !== "all" || clinicianFilter ? "No matches" : "A clear day"}
              description={
                search || filter !== "all" || clinicianFilter
                  ? "Try a different name, status or clinician."
                  : "Nothing is booked yet. Add a walk-in when someone arrives."
              }
              action={!search && filter === "all" && !clinicianFilter ? { label: "Add walk-in", onClick: () => setWalkInOpen(true) } : undefined}
            />
          )}

          {!loading && filtered.length > 0 && (
            <ol className="space-y-3">
              {filtered.map((apt) => {
                const patient = patientMap.get(apt.patientId);
                const service = serviceMap.get(apt.serviceId);
                const clinician = clinicianMap.get(apt.clinicianId);
                const name = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown patient";
                const dim = ["cancelled", "no-show", "completed"].includes(apt.status);
                const isNext = apt.id === nextUpId;
                return (
                  <li key={apt.id} className="flex items-stretch gap-3">
                    <div className="w-14 shrink-0 pt-4 text-right sm:w-16">
                      <p className={cn("font-heading text-[17px] font-semibold leading-none tabular", dim ? "text-slate-400" : "text-ink")}>
                        {timeOf(apt.startsAt)}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{timeOf(apt.endsAt)}</p>
                    </div>
                    <div
                      className={cn(
                        "card relative flex min-w-0 flex-1 items-center gap-3 p-3.5 transition",
                        "hover:border-brand-300 hover:shadow-pop",
                        isNext && "border-brand-400 ring-4 ring-brand-500/10",
                        dim && "bg-white/70"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(apt.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                        aria-label={`Open ${name}, ${timeOf(apt.startsAt)}`}
                      >
                        <Avatar name={name} size="md" className={cn(dim && "opacity-60")} />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className={cn("truncate text-[15px] font-semibold", dim ? "text-slate-600" : "text-ink")}>{name}</span>
                            <StatusChip status={apt.status} size="sm" />
                            {isNext && <Badge tone="brand" size="sm" dot={false}>Next up</Badge>}
                            {apt.isWalkIn && <Badge tone="info" size="sm" dot={false}>Walk-in</Badge>}
                          </span>
                          <span className="mt-0.5 block truncate text-[13px] text-slate-500">
                            {service?.name ?? "Service"}
                            {clinician ? ` · ${clinician.name}` : ""}
                          </span>
                          {patient?.phone && (
                            <span className="mt-0.5 hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                              <IconPhone size={12} />
                              {patient.phone}
                            </span>
                          )}
                        </span>
                      </button>
                      {apt.status === "scheduled" && (
                        <Button variant={isNext ? "primary" : "secondary"} size="sm" className="shrink-0" onClick={() => handleCheckIn(apt.id)}>
                          Check in
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <aside className="hidden space-y-4 xl:block" aria-label="Side panel">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-ink">Waitlist</h2>
              <Badge tone="violet">{waitlist.length}</Badge>
            </div>
            {waitlist.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No one is waiting for a slot.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {waitlist.slice(0, 5).map((w) => {
                  const p = patientMap.get(w.patientId);
                  const nm = p ? `${p.firstName} ${p.lastName}` : "Patient";
                  return (
                    <li key={w.id} className="flex items-center gap-3">
                      <Avatar name={nm} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{nm}</p>
                        <p className="truncate text-xs text-slate-500">{serviceMap.get(w.serviceId)?.name ?? "Service"}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="card p-4">
            <h2 className="font-heading text-base font-semibold text-ink">Quick actions</h2>
            <div className="mt-3 space-y-2">
              <Button variant="primary" fullWidth onClick={() => setWalkInOpen(true)}>
                <IconPlus size={18} />
                Add walk-in
              </Button>
              <Button variant="outline" fullWidth onClick={() => router.push("/staff/week")}>
                <IconUsers size={17} />
                View week
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile floating action */}
      <button
        type="button"
        onClick={() => setWalkInOpen(true)}
        aria-label="Add walk-in"
        className="fixed bottom-[88px] right-4 z-20 flex h-14 items-center gap-2 rounded-full bg-brand-600 px-5 font-semibold text-white shadow-glow transition active:scale-95 sm:hidden"
      >
        <IconPlus size={20} />
        Walk-in
      </button>

      <AppointmentDrawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        appointment={selected}
        patient={selected ? patientMap.get(selected.patientId) : undefined}
        service={selected ? serviceMap.get(selected.serviceId) : undefined}
        clinician={selected ? clinicianMap.get(selected.clinicianId) : undefined}
        waitlistCount={waitlist.length}
        onUpdated={(updated) => {
          setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        }}
      />

      <WalkInModal
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        services={services}
        clinicians={clinicians}
        patients={patients}
        date={date}
        onCreated={() => {
          push({ variant: "success", title: "Walk-in added" });
          load();
        }}
      />
    </StaffShell>
  );
}

export default function StaffDayPage() {
  return (
    <Suspense fallback={null}>
      <DayInner />
    </Suspense>
  );
}
