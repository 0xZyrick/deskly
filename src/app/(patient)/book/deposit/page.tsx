"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, DetailList, InlineAlert } from "@/components/ui";
import { BookingShell } from "@/components/booking/shell";
import { ChoiceCard } from "@/components/booking/choice-card";
import { useBooking } from "@/lib/booking/context";
import { useCatalog } from "@/lib/booking/catalog";
import { IconArrowLeft, IconCard, IconLock, IconReceipt } from "@/components/ui/icons";
import { formatMoney } from "@/lib/utils";

export default function BookDepositPage() {
  const router = useRouter();
  const { state, setState, completeAndNext } = useBooking();
  const { services, clinic } = useCatalog();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<"payment" | "slot" | "">("");
  const [method, setMethod] = React.useState<"card" | "transfer">("card");

  React.useEffect(() => {
    if (!state.consentAccepted) router.replace("/book/consent");
  }, [state.consentAccepted, router]);

  const service = services.find((s) => s.id === state.serviceId);
  const depositMinor = clinic ? (clinic.depositRequired ? clinic.depositAmountMinor : 0) : 5000 * 100;
  const balanceMinor = service ? Math.max(service.priceMinor - depositMinor, 0) : 0;

  const pay = async (simulateFail = false) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 900));

    if (simulateFail) {
      setState((prev) => ({ ...prev, paymentFailed: true, depositPaid: false }));
      setError("payment");
      setLoading(false);
      return;
    }

    try {
      const patientRes = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: state.patient.firstName,
          lastName: state.patient.lastName,
          phone: state.patient.phone,
          email: state.patient.email || undefined,
        }),
      });
      const patientJson = await patientRes.json();
      if (!patientRes.ok) throw new Error(patientJson.error?.message || "Could not save your details");

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientJson.data.id,
          serviceId: state.serviceId,
          clinicianId: state.clinicianId,
          startsAt: state.startsAt,
          depositPaidMinor: depositMinor,
          notes: state.intake.reason || state.intake.notes || undefined,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.error?.code === "SLOT_UNAVAILABLE") {
          setError("slot");
          setLoading(false);
          return;
        }
        throw new Error(json.error?.message || "Booking failed");
      }

      setState((prev) => ({ ...prev, depositPaid: true, paymentFailed: false, appointmentId: json.data.id }));
      completeAndNext("deposit");
      router.push("/book/confirmation");
    } catch {
      setError("payment");
      setLoading(false);
    }
  };

  const payLabel = depositMinor > 0 ? `Pay ${formatMoney(depositMinor)} deposit` : "Confirm booking";

  return (
    <BookingShell
      step="deposit"
      title="Secure your slot"
      subtitle="A small deposit holds your time. This is a simulated payment, so nothing is charged."
    >
      <div className="overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-card">
        <p className="text-sm font-medium text-brand-100">Deposit due today</p>
        <p className="mt-1 font-heading text-4xl font-semibold tabular tracking-tight">{formatMoney(depositMinor)}</p>
        <p className="mt-3 flex items-center gap-2 text-[13px] text-brand-100">
          <IconLock size={15} /> Refundable if you cancel in time (simulated)
        </p>
      </div>

      {service && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <DetailList
            items={[
              { label: service.name, value: formatMoney(service.priceMinor) },
              { label: "Deposit paid now", value: `− ${formatMoney(depositMinor)}` },
              { label: "Balance due at the clinic", value: formatMoney(balanceMinor) },
            ]}
          />
        </div>
      )}

      {depositMinor > 0 && (
        <fieldset className="mt-6">
          <legend className="mb-2 flex w-full items-center justify-between text-[13.5px] font-semibold text-ink">
            Payment method <Badge tone="warn" size="sm">Simulated</Badge>
          </legend>
          <div role="radiogroup" className="space-y-2.5">
            <ChoiceCard
              selected={method === "card"}
              onSelect={() => setMethod("card")}
              icon={<IconCard size={22} />}
              title="Debit or credit card"
              description="No card details needed in this demo"
              className="p-3.5"
            />
            <ChoiceCard
              selected={method === "transfer"}
              onSelect={() => setMethod("transfer")}
              icon={<IconReceipt size={22} />}
              title="Bank transfer"
              description="Instant confirmation (simulated)"
              className="p-3.5"
            />
          </div>
        </fieldset>
      )}

      {error === "payment" && (
        <InlineAlert tone="danger" title="Payment failed" className="mt-5">
          The simulated payment was declined. Please try again.
        </InlineAlert>
      )}
      {error === "slot" && (
        <InlineAlert
          tone="danger"
          title="That time was just taken"
          className="mt-5"
          action={
            <Button variant="soft-danger" size="sm" onClick={() => router.push("/book/time")}>
              Pick another time
            </Button>
          }
        >
          Someone else booked it while you were completing the form. Your details are saved, so choosing another time takes seconds.
        </InlineAlert>
      )}

      <div className="mt-6 space-y-2">
        <Button size="lg" fullWidth loading={loading} onClick={() => pay(false)}>
          <IconLock size={17} />
          {payLabel}
        </Button>
        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" size="sm" disabled={loading} onClick={() => router.push("/book/consent")}>
            <IconArrowLeft size={16} />
            Back
          </Button>
          <button
            type="button"
            disabled={loading}
            onClick={() => pay(true)}
            className="rounded-lg px-2 py-2 text-xs font-medium text-slate-400 underline-offset-2 transition hover:text-slate-600 hover:underline disabled:opacity-40"
          >
            Demo: simulate a failed payment
          </button>
        </div>
      </div>
    </BookingShell>
  );
}
