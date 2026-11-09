"use client";

import * as React from "react";
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  IconAlert,
  IconCalendarCheck,
  IconCheckCircle,
  IconClock,
  IconReceipt,
  IconRefresh,
  IconWallet,
  Modal,
  Segmented,
  Skeleton,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToasts,
  type Tone,
} from "@/components/ui";
import { StaffShell } from "@/components/staff/shell";
import { DEMO_TODAY, formatMoney } from "@/lib/utils";
import type { DashboardSummary, Patient, Payment, PaymentStatus } from "@/types";

type Filter = "" | PaymentStatus;

const STATUS_TONE: Record<PaymentStatus, Tone> = {
  paid: "ok",
  pending: "warn",
  refunded: "neutral",
  failed: "danger",
};
const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
  failed: "Failed",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default function StaffPaymentsPage() {
  const [all, setAll] = React.useState<Payment[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [status, setStatus] = React.useState<Filter>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [refundTarget, setRefundTarget] = React.useState<Payment | null>(null);
  const [refunding, setRefunding] = React.useState(false);
  const { push, node: toastNode } = useToasts();

  const patientMap = React.useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);
  const nameOf = (p: Payment) => {
    const pt = patientMap.get(p.patientId);
    return pt ? `${pt.firstName} ${pt.lastName}` : p.patientId;
  };

  const load = React.useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch("/api/payments").then((r) => r.json()),
      fetch("/api/patients").then((r) => r.json()),
      fetch(`/api/summary?date=${DEMO_TODAY}`).then((r) => r.json()),
    ])
      .then(([pay, pats, sum]) => {
        setAll(pay.data ?? []);
        setPatients(pats.data ?? []);
        setSummary(sum.data ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load payments. Check your connection and try again.");
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const payments = status ? all.filter((p) => p.status === status) : all;
  const count = (s: PaymentStatus) => all.filter((p) => p.status === s).length;

  const confirmRefund = async () => {
    if (!refundTarget) return;
    setRefunding(true);
    try {
      const res = await fetch(`/api/payments/${refundTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refund" }),
      });
      const json = await res.json();
      setRefunding(false);
      if (!res.ok) {
        push({ variant: "error", title: "Refund failed", description: json.error?.message });
        setRefundTarget(null);
        return;
      }
      setAll((prev) => prev.map((p) => (p.id === refundTarget.id ? json.data : p)));
      push({ variant: "success", title: "Refund recorded", description: "Simulated. No real money moved." });
      setRefundTarget(null);
      fetch(`/api/summary?date=${DEMO_TODAY}`)
        .then((r) => r.json())
        .then((j) => setSummary(j.data ?? null));
    } catch {
      setRefunding(false);
      push({ variant: "error", title: "Refund failed", description: "Network error. Please try again." });
      setRefundTarget(null);
    }
  };

  return (
    <StaffShell title="Payments" subtitle="Deposits and refunds · all amounts simulated">
      {toastNode}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Paid today"
          value={summary ? formatMoney(summary.paymentsTodayMinor) : "-"}
          hint={summary ? `${summary.paymentsTodayCount} payment${summary.paymentsTodayCount === 1 ? "" : "s"}` : undefined}
          icon={<IconWallet size={20} />}
          tone="ok"
          loading={loading}
        />
        <StatCard label="Pending" value={summary?.pendingPaymentsCount ?? 0} hint="Awaiting confirmation" icon={<IconClock size={20} />} tone="warn" loading={loading} />
        <StatCard label="Refunded this week" value={summary?.refundedThisWeekCount ?? 0} hint="Simulated refunds" icon={<IconRefresh size={20} />} tone="neutral" loading={loading} />
        <StatCard label="Appointments today" value={summary?.appointmentsToday ?? 0} hint="Active on schedule" icon={<IconCalendarCheck size={20} />} loading={loading} />
      </div>

      <div className="scroll-hide -mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Segmented
          label="Filter by status"
          value={status}
          onChange={setStatus}
          items={[
            { id: "", label: "All", count: all.length },
            { id: "paid", label: "Paid", count: count("paid") },
            { id: "pending", label: "Pending", count: count("pending") },
            { id: "refunded", label: "Refunded", count: count("refunded") },
            { id: "failed", label: "Failed", count: count("failed") },
          ]}
        />
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
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <EmptyState
          icon={<IconReceipt size={26} />}
          title="No payments"
          description={status ? "No payments match this filter." : "Payments appear here when deposits are collected."}
          secondaryAction={status ? { label: "Show all", onClick: () => setStatus("") } : undefined}
        />
      )}

      {!loading && payments.length > 0 && (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={nameOf(p)} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{nameOf(p)}</p>
                          <p className="font-mono text-xs text-slate-500">{p.reference ?? p.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold tabular text-ink">{formatMoney(p.amountMinor, p.currency)}</TableCell>
                    <TableCell className="capitalize text-slate-600">{p.kind}</TableCell>
                    <TableCell>
                      <Badge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{fmtDate(p.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {p.status === "paid" && (
                        <Button variant="outline" size="sm" onClick={() => setRefundTarget(p)}>
                          Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {payments.map((p) => (
              <li key={p.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={nameOf(p)} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-ink">{nameOf(p)}</p>
                      <p className="shrink-0 font-heading text-base font-semibold tabular text-ink">
                        {formatMoney(p.amountMinor, p.currency)}
                      </p>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{p.reference ?? p.id}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <Badge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                      <span className="text-xs capitalize text-slate-500">
                        {p.kind} · {fmtDate(p.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {p.status === "paid" && (
                  <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => setRefundTarget(p)}>
                    Refund
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        title="Confirm refund"
        description="This is a simulated refund. No real money moves."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRefundTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={refunding} onClick={confirmRefund}>
              Confirm refund
            </Button>
          </>
        }
      >
        {refundTarget && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 text-ink">
              <IconCheckCircle size={18} className="text-brand-600" />
              <span className="font-semibold">{nameOf(refundTarget)}</span>
            </div>
            <p className="mt-2">
              Refund <strong className="text-ink">{formatMoney(refundTarget.amountMinor, refundTarget.currency)}</strong> for
              reference <span className="font-mono font-semibold text-ink">{refundTarget.reference ?? refundTarget.id}</span>?
            </p>
          </div>
        )}
      </Modal>
    </StaffShell>
  );
}
