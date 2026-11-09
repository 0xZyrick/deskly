"use client";

import * as React from "react";
import {
  Drawer,
  Button,
  StatusChip,
  DatePicker,
  TimeSlotChip,
  Modal,
  Avatar,
  Badge,
  InlineAlert,
  Skeleton,
  IconStethoscope,
  IconUser,
  IconClock,
  IconWallet,
  IconClipboard,
  IconPhone,
  IconMail,
  IconWalkIn,
  IconCheck,
  IconCalendar,
  IconX,
} from "@/components/ui";
import { addDays, cn, formatDate, formatMoney, timeOf } from "@/lib/utils";
import type { Appointment, Patient, Service, Clinician, Slot, AppointmentStatus } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patient?: Patient;
  service?: Service;
  clinician?: Clinician;
  onUpdated: (a: Appointment) => void;
  waitlistCount?: number;
};

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className="mt-0.5 text-[15px] font-semibold text-ink">{children}</div>
      </div>
    </div>
  );
}

export function AppointmentDrawer({
  open,
  onClose,
  appointment,
  patient,
  service,
  clinician,
  onUpdated,
  waitlistCount = 0,
}: Props) {
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [date, setDate] = React.useState("");
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ tone: "ok" | "danger"; text: string } | null>(null);
  const [offerWaitlist, setOfferWaitlist] = React.useState(false);

  // Hooks always run in the same order: never return before these
  React.useEffect(() => {
    if (appointment) {
      setDate(appointment.startsAt.slice(0, 10));
      setMessage(null);
      setOfferWaitlist(false);
      setSelectedSlot(null);
      setRescheduleOpen(false);
      setCancelOpen(false);
    }
    // only reset when switching to a different appointment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment?.id]);

  React.useEffect(() => {
    if (!rescheduleOpen || !date || !appointment) return;
    const params = new URLSearchParams({
      date,
      serviceId: appointment.serviceId,
      clinicianId: appointment.clinicianId,
    });
    let cancelled = false;
    setSlotsLoading(true);
    fetch(`/api/slots?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setSlots(json.data ?? []);
          setSlotsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          setSlotsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [rescheduleOpen, date, appointment]);

  if (!appointment) return null;

  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Appointment";
  const timeLabel = `${formatDate(appointment.startsAt.slice(0, 10), {
    weekday: "short",
    day: "numeric",
    month: "short",
  })} · ${timeOf(appointment.startsAt)}–${timeOf(appointment.endsAt)}`;

  const patch = async (body: Record<string, unknown>) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setLoading(false);
      if (res.ok) {
        onUpdated(json.data);
        return json.data as Appointment;
      }
      setMessage({ tone: "danger", text: json.error?.message || "Update failed" });
      return null;
    } catch {
      setLoading(false);
      setMessage({ tone: "danger", text: "Network error. Please try again." });
      return null;
    }
  };

  const checkIn = async () => {
    const u = await patch({ status: "checked-in" });
    if (u) setMessage({ tone: "ok", text: `${patientName} is checked in.` });
  };
  const markNoShow = async () => {
    const updated = await patch({ status: "no-show" });
    if (updated) {
      setMessage({ tone: "ok", text: "Marked as no-show." });
      if (waitlistCount > 0) setOfferWaitlist(true);
    }
  };
  const cancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, { method: "DELETE" });
      const json = await res.json();
      setLoading(false);
      setCancelOpen(false);
      if (res.ok) {
        onUpdated(json.data);
        setMessage({ tone: "ok", text: "Appointment cancelled." });
        if (waitlistCount > 0) setOfferWaitlist(true);
        else onClose();
      } else {
        setMessage({ tone: "danger", text: json.error?.message || "Cancel failed" });
      }
    } catch {
      setLoading(false);
      setCancelOpen(false);
      setMessage({ tone: "danger", text: "Network error. Please try again." });
    }
  };

  const confirmReschedule = async () => {
    if (!selectedSlot) return;
    const updated = await patch({ startsAt: selectedSlot });
    if (updated) {
      setRescheduleOpen(false);
      setSelectedSlot(null);
      setMessage({ tone: "ok", text: "Rescheduled successfully." });
    }
  };

  const canCheckIn = appointment.status === "scheduled";
  const canNoShow = ["scheduled", "checked-in"].includes(appointment.status);
  const canModify = ["scheduled", "checked-in", "waitlist"].includes(appointment.status);

  const dateStrip = Array.from({ length: 7 }, (_, i) => addDays(date || appointment.startsAt.slice(0, 10), i - 1));

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={patientName}
        description={timeLabel}
        headerExtra={
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={appointment.status as AppointmentStatus} />
            {appointment.isWalkIn && <Badge tone="info">Walk-in</Badge>}
          </div>
        }
        footer={
          <Button variant="outline" fullWidth onClick={onClose}>
            Close
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <Avatar name={patientName} size="lg" />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-heading text-lg font-semibold text-ink">{patientName}</p>
              {patient?.phone && (
                <a href={`tel:${patient.phone}`} className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline">
                  <IconPhone size={15} />
                  {patient.phone}
                </a>
              )}
              {patient?.email && (
                <a href={`mailto:${patient.email}`} className="flex items-center gap-2 truncate text-sm text-slate-600 hover:underline">
                  <IconMail size={15} />
                  <span className="truncate">{patient.email}</span>
                </a>
              )}
            </div>
          </div>

          {message && (
            <InlineAlert tone={message.tone}>{message.text}</InlineAlert>
          )}

          {offerWaitlist && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <p className="font-semibold text-brand-900">Slot released</p>
              <p className="mt-1 text-sm text-brand-800">
                There {waitlistCount === 1 ? "is" : "are"} {waitlistCount} on the waitlist. Offer the free slot?
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setOfferWaitlist(false);
                  setMessage({ tone: "ok", text: "Waitlist offer noted (simulated)." });
                }}
              >
                Offer to waitlist
              </Button>
            </div>
          )}

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-4">
            <Row icon={<IconStethoscope size={17} />} label="Service">
              {service?.name ?? appointment.serviceId}
              {service && (
                <span className="ml-2 text-sm font-medium text-slate-500">
                  {service.durationMinutes} min · {formatMoney(service.priceMinor)}
                </span>
              )}
            </Row>
            <Row icon={<IconUser size={17} />} label="Clinician">
              {clinician?.name ?? appointment.clinicianId}
              {clinician?.title && <span className="ml-2 text-sm font-medium text-slate-500">{clinician.title}</span>}
            </Row>
            <Row icon={<IconClock size={17} />} label="Time">
              {timeOf(appointment.startsAt)} – {timeOf(appointment.endsAt)}
            </Row>
            <Row icon={<IconWallet size={17} />} label="Deposit">
              {appointment.depositPaidMinor ? (
                <span className="text-emerald-700">{formatMoney(appointment.depositPaidMinor)} paid</span>
              ) : (
                <span className="text-slate-500">None collected</span>
              )}
            </Row>
            {appointment.isWalkIn && (
              <Row icon={<IconWalkIn size={17} />} label="Source">
                Walk-in
              </Row>
            )}
            {appointment.notes && (
              <Row icon={<IconClipboard size={17} />} label="Notes">
                <span className="font-medium">{appointment.notes}</span>
              </Row>
            )}
          </div>

          <div className="space-y-2.5">
            {canCheckIn && (
              <Button variant="primary" size="lg" fullWidth loading={loading} onClick={checkIn}>
                <IconCheck size={18} />
                Check in
              </Button>
            )}
            {canModify && (
              <Button variant="outline" fullWidth onClick={() => setRescheduleOpen(true)}>
                <IconCalendar size={17} />
                Reschedule
              </Button>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {canNoShow && (
                <Button variant="secondary" loading={loading} onClick={markNoShow}>
                  Mark no-show
                </Button>
              )}
              {canModify && (
                <Button variant="soft-danger" onClick={() => setCancelOpen(true)} className={cn(!canNoShow && "col-span-2")}>
                  <IconX size={16} />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this appointment?"
        description={`${patientName} · ${timeLabel}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Keep appointment
            </Button>
            <Button variant="danger" loading={loading} onClick={cancel}>
              Yes, cancel it
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          The slot is released immediately. Any deposit is handled from the Payments screen.
        </p>
      </Modal>

      <Modal
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule"
        description={`${patientName} with ${clinician?.name ?? "clinician"}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)}>
              Close
            </Button>
            <Button variant="primary" disabled={!selectedSlot} loading={loading} onClick={confirmReschedule}>
              Confirm new time
            </Button>
          </>
        }
      >
        <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
          {dateStrip.map((d) => {
            const sel = d === date;
            const dt = new Date(d + "T12:00:00");
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDate(d);
                  setSelectedSlot(null);
                }}
                aria-pressed={sel}
                className={cn(
                  "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border text-center transition",
                  sel ? "border-brand-600 bg-brand-600 text-white shadow-glow" : "border-slate-200 bg-white hover:border-brand-300"
                )}
              >
                <span className="text-[11px] font-medium opacity-80">
                  {dt.toLocaleDateString("en-GB", { weekday: "short" })}
                </span>
                <span className="font-heading text-lg font-semibold">{dt.getDate()}</span>
              </button>
            );
          })}
        </div>
        <DatePicker label="Or pick a date" value={date} onChange={(v) => { setDate(v); setSelectedSlot(null); }} />
        <div className="mt-4">
          {slotsLoading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-[84px]" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <InlineAlert tone="warn">No open slots on this day. Try another date.</InlineAlert>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <TimeSlotChip
                  key={s.startsAt}
                  time={timeOf(s.startsAt)}
                  selected={selectedSlot === s.startsAt}
                  onClick={() => setSelectedSlot(s.startsAt)}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
