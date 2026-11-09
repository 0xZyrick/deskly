"use client";

import * as React from "react";
import { Modal, Button, Input, Select, Segmented, InlineAlert } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Service, Clinician, Patient } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  services: Service[];
  clinicians: Clinician[];
  patients: Patient[];
  /** The day being viewed; the walk-in is created on this date */
  date: string;
  onCreated: () => void;
};

export function WalkInModal({ open, onClose, services, clinicians, patients, date, onCreated }: Props) {
  const [mode, setMode] = React.useState<"existing" | "new">("existing");
  const [patientId, setPatientId] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [serviceId, setServiceId] = React.useState("");
  const [clinicianId, setClinicianId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setMode("existing");
      setPatientId(patients[0]?.id ?? "");
      setNewName("");
      setNewPhone("");
      setServiceId(services[0]?.id ?? "");
      setClinicianId("");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const service = services.find((s) => s.id === serviceId);
  const eligible = clinicians.filter((c) => !serviceId || c.serviceIds.includes(serviceId));

  // keep clinician valid for the chosen service
  React.useEffect(() => {
    if (!open) return;
    if (!eligible.some((c) => c.id === clinicianId)) setClinicianId(eligible[0]?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, open, clinicians]);

  const submit = async () => {
    if (!serviceId || !clinicianId) {
      setError("Choose a service and a clinician.");
      return;
    }
    if (mode === "existing" && !patientId) {
      setError("Choose a patient.");
      return;
    }
    if (mode === "new" && (!newName.trim() || !newPhone.trim())) {
      setError("Enter the patient's name and phone number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      let pid = patientId;
      if (mode === "new") {
        const [first, ...rest] = newName.trim().split(/\s+/);
        const pr = await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName: first, lastName: rest.join(" ") || "-", phone: newPhone.trim() }),
        });
        const pj = await pr.json();
        if (!pr.ok) {
          setLoading(false);
          setError(pj.error?.message || "Could not create patient");
          return;
        }
        pid = pj.data.id;
      }

      // Start "now" (local clock, rounded up to 5 min) on the date being viewed
      const now = new Date();
      let total = now.getHours() * 60 + Math.ceil(now.getMinutes() / 5) * 5;
      if (total >= 24 * 60) total = 24 * 60 - 5;
      const hh = String(Math.floor(total / 60)).padStart(2, "0");
      const mm = String(total % 60).padStart(2, "0");
      const startsAt = `${date}T${hh}:${mm}:00.000+01:00`;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: pid, serviceId, clinicianId, startsAt, isWalkIn: true }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(json.error?.message || "Could not create walk-in");
        return;
      }
      onCreated();
      onClose();
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add walk-in"
      description={`Creates an appointment starting now on ${formatDate(date, { weekday: "short", day: "numeric", month: "short" })}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={loading} onClick={submit}>
            Create walk-in
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Segmented
          label="Patient type"
          fullWidth
          value={mode}
          onChange={setMode}
          items={[
            { id: "existing", label: "Existing patient" },
            { id: "new", label: "New patient" },
          ]}
        />
        {mode === "existing" ? (
          <Select
            label="Patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={patients.map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} autoComplete="name" required />
            <Input
              label="Phone"
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+234 801 000 0000"
              autoComplete="tel"
              required
            />
          </div>
        )}
        <Select
          label="Service"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          options={services.map((s) => ({ value: s.id, label: `${s.name} (${s.durationMinutes} min)` }))}
          hint={service ? `Takes ${service.durationMinutes} minutes` : undefined}
        />
        <Select
          label="Clinician"
          value={clinicianId}
          onChange={(e) => setClinicianId(e.target.value)}
          options={eligible.map((c) => ({ value: c.id, label: c.name }))}
        />
        {error && <InlineAlert tone="danger">{error}</InlineAlert>}
      </div>
    </Modal>
  );
}
