"use client";

import * as React from "react";
import type { Clinic, Clinician, Service } from "@/types";

export interface Catalog {
  services: Service[];
  clinicians: Clinician[];
  clinic: Clinic | null;
  loaded: boolean;
  error: boolean;
}

let cache: Omit<Catalog, "loaded" | "error"> | null = null;
let inflight: Promise<Omit<Catalog, "loaded" | "error">> | null = null;

function fetchCatalog() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/clinicians").then((r) => r.json()),
      fetch("/api/clinic").then((r) => r.json()),
    ])
      .then(([s, c, k]) => {
        cache = {
          services: (s.data ?? []) as Service[],
          clinicians: (c.data ?? []) as Clinician[],
          clinic: (k.data ?? null) as Clinic | null,
        };
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Services, clinicians and clinic details, fetched once and shared across steps. */
export function useCatalog(): Catalog {
  const [state, setState] = React.useState<Catalog>(
    cache ? { ...cache, loaded: true, error: false } : { services: [], clinicians: [], clinic: null, loaded: false, error: false }
  );
  React.useEffect(() => {
    let alive = true;
    fetchCatalog()
      .then((c) => alive && setState({ ...c, loaded: true, error: false }))
      .catch(() => alive && setState((p) => ({ ...p, loaded: true, error: true })));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/** Build and download an .ics calendar file for an appointment. */
export function downloadIcs(opts: {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  description?: string;
}) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (v: string) => v.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Deskly//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${opts.id}@deskly.demo`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(opts.startsAt)}`,
    `DTEND:${fmt(opts.endsAt)}`,
    `SUMMARY:${esc(opts.title)}`,
    opts.location ? `LOCATION:${esc(opts.location)}` : "",
    opts.description ? `DESCRIPTION:${esc(opts.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "appointment.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
