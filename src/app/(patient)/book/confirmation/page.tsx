"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink, Card, DetailList, StatusChip } from "@/components/ui";
import { BookingShell } from "@/components/booking/shell";
import { useBooking } from "@/lib/booking/context";
import { downloadIcs, useCatalog } from "@/lib/booking/catalog";
import { IconArrowRight, IconCalendarCheck, IconCheck, IconHome, IconInfo } from "@/components/ui/icons";
import { formatDate, formatMoney, timeOf } from "@/lib/utils";
import type { Appointment } from "@/types";

export default function BookConfirmationPage() {
  const router = useRouter();
  const { state, reset } = useBooking();
  const { services, clinicians, clinic } = useCatalog();
  const [appointment, setAppointment] = React.useState<Appointment | null>(null);

  React.useEffect(() => {
    if (!state.appointmentId && !state.depositPaid) router.replace("/book/service");
  }, [state.appointmentId, state.depositPaid, router]);

  React.useEffect(() => {
    if (!state.appointmentId) return;
    fetch(`/api/appointments/${state.appointmentId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setAppointment(j.data))
      .catch(() => {});
  }, [state.appointmentId]);

  const service = services.find((s) => s.id === (appointment?.serviceId ?? state.serviceId));
  const clinician = clinicians.find((c) => c.id === (appointment?.clinicianId ?? state.clinicianId));
  const startsAt = appointment?.startsAt ?? state.startsAt;
  const when = startsAt
    ? `${formatDate(startsAt.slice(0, 10), { weekday: "long", day: "numeric", month: "long" })} at ${timeOf(startsAt)}`
    : "To be confirmed";
  const deposit = appointment?.depositPaidMinor;

  const addToCalendar = () => {
    if (!appointment) return;
    downloadIcs({
      id: appointment.id,
      title: `${service?.name ?? "Appointment"} at ${clinic?.name ?? "Harbour Light Clinic"}`,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      location: clinic?.address,
      description: clinician ? `With ${clinician.name}. Reference ${appointment.id}.` : `Reference ${appointment.id}.`,
    });
  };

  return (
    <BookingShell step="confirmation" title="Booking confirmed">
      <div className="-mt-2 text-center">
        <span className="mx-auto flex h-20 w-20 animate-pop-check items-center justify-center rounded-full bg-brand-600 text-white shadow-glow">
          <IconCheck size={38} strokeWidth={2.6} />
        </span>
        <p className="mt-5 font-heading text-2xl font-semibold text-ink">You are all set, {state.patient.firstName || "friend"}</p>
        <p className="mx-auto mt-1.5 max-w-sm text-[15px] text-slate-600">
          {state.patient.email ? "A confirmation is on its way to your email and phone (simulated)." : "A confirmation is on its way to your phone (simulated)."}
        </p>
      </div>

      <Card className="mt-7" padded>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-heading text-lg font-semibold text-ink">{service?.name ?? "Your appointment"}</p>
          <StatusChip status={appointment?.status ?? "scheduled"} size="sm" />
        </div>
        <DetailList
          items={[
            { label: "When", value: when },
            { label: "Clinician", value: clinician?.name ?? "First available" },
            { label: "Where", value: clinic?.address ?? "Harbour Light Clinic" },
            { label: "Name", value: `${state.patient.firstName} ${state.patient.lastName}`.trim() },
            ...(deposit ? [{ label: "Deposit paid", value: formatMoney(deposit) }] : []),
            { label: "Reference", value: <span className="font-mono text-[13px]">{state.appointmentId ?? "Pending"}</span> },
          ]}
        />
      </Card>

      <p className="mt-4 flex items-start gap-2 text-[13px] text-slate-500">
        <IconInfo size={15} className="mt-0.5 shrink-0" />
        Please arrive 10 minutes early. You can reschedule or cancel from your booking page.
      </p>

      <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
        <Button variant="outline" size="lg" onClick={addToCalendar} disabled={!appointment}>
          <IconCalendarCheck size={18} />
          Add to calendar
        </Button>
        {state.appointmentId && (
          <ButtonLink href={`/book/manage/${state.appointmentId}`} size="lg">
            Manage booking
            <IconArrowRight size={18} />
          </ButtonLink>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            reset();
            router.push("/book/service");
          }}
        >
          Book another
        </Button>
        <ButtonLink href="/" variant="ghost" size="lg">
          <IconHome size={18} />
          Back to home
        </ButtonLink>
      </div>
    </BookingShell>
  );
}
