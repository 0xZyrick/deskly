"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Button,
  ButtonLink,
  Card,
  DetailList,
  EmptyState,
  InlineAlert,
  Modal,
  Skeleton,
  StatusChip,
  TimeSlotChip,
} from "@/components/ui";
import { BookingHeader } from "@/components/booking/shell";
import { useCatalog } from "@/lib/booking/catalog";
import { IconAlert, IconArrowLeft, IconCalendar, IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import type { Appointment, Slot } from "@/types";
import { DEMO_TODAY, addDays, formatDate, formatMoney, timeOf } from "@/lib/utils";

export default function ManageBookingPage() {
  const { id } = useParams<{ id: string }>();
  const { services, clinicians, clinic } = useCatalog();
  const [apt, setApt] = React.useState<Appointment | null>(null);
  const [patientName, setPatientName] = React.useState("");
  const [state, setState] = React.useState<"loading" | "ready" | "missing">("loading");
  const [notice, setNotice] = React.useState<{ tone: "ok" | "danger"; text: string } | null>(null);

  const [resOpen, setResOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [date, setDate] = React.useState(DEMO_TODAY);
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);
  const [pick, setPick] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch(`/api/appointments/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const j = await r.json();
        if (!alive) return;
        setApt(j.data);
        setDate(j.data.startsAt.slice(0, 10) < DEMO_TODAY ? DEMO_TODAY : j.data.startsAt.slice(0, 10));
        setState("ready");
        fetch("/api/patients")
          .then((p) => p.json())
          .then((pj) => {
            const p = (pj.data as { id: string; firstName: string; lastName: string }[]).find((x) => x.id === j.data.patientId);
            if (alive && p) setPatientName(`${p.firstName} ${p.lastName}`);
          })
          .catch(() => {});
      })
      .catch(() => alive && setState("missing"));
    return () => {
      alive = false;
    };
  }, [id]);

  React.useEffect(() => {
    if (!resOpen || !apt) return;
    let alive = true;
    setSlotsLoading(true);
    setPick(null);
    const params = new URLSearchParams({ date, serviceId: apt.serviceId, clinicianId: apt.clinicianId });
    fetch(`/api/slots?${params}`)
      .then((r) => r.json())
      .then((j) => {
        if (alive) {
          setSlots(j.data ?? []);
          setSlotsLoading(false);
        }
      })
      .catch(() => alive && setSlotsLoading(false));
    return () => {
      alive = false;
    };
  }, [resOpen, date, apt]);

  const service = services.find((s) => s.id === apt?.serviceId);
  const clinician = clinicians.find((c) => c.id === apt?.clinicianId);
  const active = apt && ["scheduled", "checked-in", "waitlist"].includes(apt.status);

  const reschedule = async () => {
    if (!apt || !pick) return;
    setBusy(true);
    const res = await fetch(`/api/appointments/${apt.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startsAt: pick }),
    });
    const json = await res.json();
    setBusy(false);
    if (res.ok) {
      setApt(json.data);
      setResOpen(false);
      setNotice({ tone: "ok", text: "Your appointment has been moved." });
    } else {
      setNotice({ tone: "danger", text: json.error?.message || "Could not reschedule. Please pick another time." });
      setResOpen(false);
    }
  };

  const cancel = async () => {
    if (!apt) return;
    setBusy(true);
    const res = await fetch(`/api/appointments/${apt.id}`, { method: "DELETE" });
    const json = await res.json();
    setBusy(false);
    setCancelOpen(false);
    if (res.ok) {
      setApt(json.data);
      setNotice({ tone: "ok", text: "Your booking has been cancelled." });
    } else {
      setNotice({ tone: "danger", text: json.error?.message || "Could not cancel. Please call the clinic." });
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <BookingHeader />
      <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        {state === "loading" && (
          <div className="space-y-4" role="status" aria-label="Loading booking">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        )}

        {state === "missing" && (
          <EmptyState
            icon={<IconAlert size={26} />}
            title="We could not find that booking"
            description="The link may be wrong or the booking may have been removed. Start a new booking any time."
            action={{ label: "Book an appointment", href: "/book/service" }}
            secondaryAction={{ label: "Back to home", href: "/" }}
          />
        )}

        {state === "ready" && apt && (
          <>
            <h1 className="font-heading text-[26px] font-semibold tracking-tight text-ink sm:text-3xl">Your booking</h1>
            <p className="mt-1 text-[15px] text-slate-600">
              {active ? "Need to change plans? You can move or cancel it below." : "This booking can no longer be changed."}
            </p>

            {notice && (
              <InlineAlert tone={notice.tone} className="mt-5">
                {notice.text}
              </InlineAlert>
            )}

            <Card className="mt-6" padded>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl font-semibold text-ink">{service?.name ?? "Appointment"}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{clinician?.name}</p>
                </div>
                <StatusChip status={apt.status} />
              </div>
              <DetailList
                items={[
                  { label: "Date", value: formatDate(apt.startsAt.slice(0, 10), { weekday: "long", day: "numeric", month: "long" }) },
                  { label: "Time", value: `${timeOf(apt.startsAt)} – ${timeOf(apt.endsAt)}` },
                  ...(patientName ? [{ label: "Patient", value: patientName }] : []),
                  { label: "Where", value: clinic?.address ?? "Harbour Light Clinic" },
                  ...(apt.depositPaidMinor ? [{ label: "Deposit paid", value: formatMoney(apt.depositPaidMinor) }] : []),
                  { label: "Reference", value: <span className="font-mono text-[13px]">{apt.id}</span> },
                ]}
              />
            </Card>

            {active ? (
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                <Button size="lg" onClick={() => setResOpen(true)}>
                  <IconCalendar size={18} />
                  Reschedule
                </Button>
                <Button size="lg" variant="soft-danger" onClick={() => setCancelOpen(true)}>
                  Cancel booking
                </Button>
              </div>
            ) : (
              <div className="mt-6">
                <ButtonLink href="/book/service" size="lg" fullWidth>
                  Book a new appointment
                </ButtonLink>
              </div>
            )}
            <div className="mt-3">
              <ButtonLink href="/" variant="ghost" fullWidth>
                <IconArrowLeft size={16} />
                Back to home
              </ButtonLink>
            </div>
          </>
        )}
      </main>

      <Modal
        open={resOpen}
        onClose={() => setResOpen(false)}
        title="Choose a new time"
        description={clinician ? `With ${clinician.name}` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setResOpen(false)}>
              Keep current time
            </Button>
            <Button disabled={!pick} loading={busy} onClick={reschedule}>
              Confirm new time
            </Button>
          </>
        }
      >
        <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 p-1.5">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Previous day"
            disabled={date <= DEMO_TODAY}
            onClick={() => setDate((d) => addDays(d, -1))}
          >
            <IconChevronLeft size={18} />
          </Button>
          <p className="text-sm font-semibold text-ink" aria-live="polite">
            {formatDate(date, { weekday: "short", day: "numeric", month: "short" })}
          </p>
          <Button variant="ghost" size="sm" aria-label="Next day" onClick={() => setDate((d) => addDays(d, 1))}>
            <IconChevronRight size={18} />
          </Button>
        </div>
        {slotsLoading ? (
          <div className="grid grid-cols-3 gap-2" role="status" aria-label="Loading times">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">No open times on this day. Try another.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <TimeSlotChip
                key={s.startsAt}
                time={timeOf(s.startsAt)}
                selected={pick === s.startsAt}
                onClick={() => setPick(s.startsAt)}
                className="w-full min-w-0"
              />
            ))}
          </div>
        )}
      </Modal>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        size="sm"
        title="Cancel this booking?"
        description="Your time will be released for other patients. Deposit refunds are simulated in this demo."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Keep booking
            </Button>
            <Button variant="danger" loading={busy} onClick={cancel}>
              Yes, cancel
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          {service?.name} on {apt && formatDate(apt.startsAt.slice(0, 10), { weekday: "long", day: "numeric", month: "long" })} at {apt && timeOf(apt.startsAt)}.
        </p>
      </Modal>
    </div>
  );
}
