"use client";

import * as React from "react";
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  IconAlert,
  IconBell,
  IconCalendarCheck,
  IconCheck,
  IconEdit,
  IconMail,
  IconSmartphone,
  InlineAlert,
  Input,
  Skeleton,
  StatCard,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  useToasts,
  IconArrowLeft,
  type Tone,
} from "@/components/ui";
import { StaffShell } from "@/components/staff/shell";
import { DEMO_TODAY, cn } from "@/lib/utils";
import type {
  DashboardSummary,
  Patient,
  ReminderChannel,
  ReminderLeadTime,
  ReminderLogEntry,
  ReminderLogStatus,
  ReminderSettings,
  ReminderTemplate,
} from "@/types";

const LEAD_OPTIONS: { value: ReminderLeadTime; label: string }[] = [
  { value: "24h", label: "24 hours before" },
  { value: "2h", label: "2 hours before" },
  { value: "1h", label: "1 hour before" },
  { value: "30m", label: "30 minutes before" },
];

const CHANNELS: { value: ReminderChannel; label: string; hint: string; icon: React.ReactNode }[] = [
  { value: "sms", label: "SMS", hint: "Text message to the patient's phone", icon: <IconSmartphone size={22} /> },
  { value: "email", label: "Email", hint: "Sent when an email is on file", icon: <IconMail size={22} /> },
];

const TOKENS = ["{{patientName}}", "{{date}}", "{{time}}", "{{service}}", "{{clinicName}}"];

const LOG_TONE: Record<ReminderLogStatus, Tone> = { sent: "ok", failed: "danger", skipped: "neutral" };

function fillPreview(body: string): string {
  return body
    .replaceAll("{{patientName}}", "Chinwe Okeke")
    .replaceAll("{{clinicName}}", "Harbour Light Clinic")
    .replaceAll("{{date}}", "6 Nov 2026")
    .replaceAll("{{time}}", "09:00")
    .replaceAll("{{service}}", "Initial consultation");
}

type Tab = "settings" | "templates" | "log";

const fmtWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function StaffRemindersPage() {
  const [tab, setTab] = React.useState<Tab>("settings");
  const [settings, setSettings] = React.useState<ReminderSettings | null>(null);
  const [templates, setTemplates] = React.useState<ReminderTemplate[]>([]);
  const [log, setLog] = React.useState<ReminderLogEntry[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const { push, node: toastNode } = useToasts();

  const [editing, setEditing] = React.useState<ReminderTemplate | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editSubject, setEditSubject] = React.useState("");
  const [editBody, setEditBody] = React.useState("");
  const [blockedWords, setBlockedWords] = React.useState<string[]>([]);
  const [templateError, setTemplateError] = React.useState("");
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  const patientMap = React.useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);

  const load = React.useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch("/api/reminders/settings").then((r) => r.json()),
      fetch("/api/reminders/templates").then((r) => r.json()),
      fetch("/api/reminders/log").then((r) => r.json()),
      fetch("/api/patients").then((r) => r.json()),
      fetch(`/api/summary?date=${DEMO_TODAY}`).then((r) => r.json()),
    ])
      .then(([set, tpl, lg, pats, sum]) => {
        setSettings(set.data ?? null);
        setTemplates(tpl.data ?? []);
        setLog(lg.data ?? []);
        setPatients(pats.data ?? []);
        setSummary(sum.data ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load reminders. Check your connection and try again.");
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const toggleChannel = (ch: ReminderChannel) => {
    if (!settings) return;
    const has = settings.channels.includes(ch);
    setFormError("");
    setSettings({ ...settings, channels: has ? settings.channels.filter((c) => c !== ch) : [...settings.channels, ch] });
  };

  const toggleLead = (lt: ReminderLeadTime) => {
    if (!settings) return;
    const has = settings.leadTimes.includes(lt);
    setSettings({ ...settings, leadTimes: has ? settings.leadTimes.filter((l) => l !== lt) : [...settings.leadTimes, lt] });
  };

  const saveSettings = async () => {
    if (!settings) return;
    if (settings.channels.length === 0) {
      setFormError("Select at least one channel");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/reminders/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: settings.enabled, channels: settings.channels, leadTimes: settings.leadTimes }),
      });
      const json = await res.json();
      setSaving(false);
      if (!res.ok) {
        setFormError(json.error?.message || "Save failed");
        return;
      }
      setSettings(json.data);
      push({ variant: "success", title: "Schedule saved" });
    } catch {
      setSaving(false);
      setFormError("Network error. Please try again.");
    }
  };

  const openEditor = (t: ReminderTemplate) => {
    setEditing(t);
    setEditName(t.name);
    setEditSubject(t.subject ?? "");
    setEditBody(t.body);
    setBlockedWords([]);
    setTemplateError("");
  };

  const insertToken = (tok: string) => {
    const el = bodyRef.current;
    if (!el) {
      setEditBody((b) => b + tok);
      return;
    }
    const s = el.selectionStart ?? editBody.length;
    const e = el.selectionEnd ?? editBody.length;
    const next = editBody.slice(0, s) + tok + editBody.slice(e);
    setEditBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + tok.length, s + tok.length);
    });
  };

  const saveTemplate = async () => {
    if (!editing) return;
    setSaving(true);
    setBlockedWords([]);
    setTemplateError("");
    try {
      const res = await fetch(`/api/reminders/templates/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, subject: editSubject || undefined, body: editBody }),
      });
      const json = await res.json();
      setSaving(false);
      if (!res.ok) {
        const blocked = json.error?.details?.blockedWords as string[] | undefined;
        if (blocked?.length) setBlockedWords(blocked);
        setTemplateError(json.error?.message || "Could not save template");
        return;
      }
      setTemplates((prev) => prev.map((t) => (t.id === editing.id ? json.data : t)));
      setEditing(null);
      push({ variant: "success", title: "Template saved" });
    } catch {
      setSaving(false);
      setTemplateError("Network error. Please try again.");
    }
  };

  const nameOf = (id: string) => {
    const p = patientMap.get(id);
    return p ? `${p.firstName} ${p.lastName}` : id;
  };

  const failedCount = log.filter((l) => l.status === "failed").length;

  /** Highlight blocked words in the editor hint */
  const bodyHasBlocked = blockedWords.length > 0;

  return (
    <StaffShell title="Reminders" subtitle="Automatic, non-clinical patient notifications">
      {toastNode}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Due today" value={summary?.remindersDueToday ?? 0} icon={<IconBell size={20} />} loading={loading} />
        <StatCard label="Failed this week" value={summary?.remindersFailedWeek ?? 0} icon={<IconAlert size={20} />} tone={summary?.remindersFailedWeek ? "danger" : "neutral"} loading={loading} />
        <StatCard className="col-span-2 lg:col-span-1" label="Appointments today" value={summary?.appointmentsToday ?? 0} icon={<IconCalendarCheck size={20} />} tone="info" loading={loading} />
      </div>

      <Tabs
        label="Reminder sections"
        value={tab}
        onChange={(t) => setTab(t)}
        className="mb-6"
        items={[
          { id: "settings", label: "Schedule" },
          { id: "templates", label: "Templates", count: templates.length },
          { id: "log", label: "Log", count: log.length },
        ]}
      />

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

      {loading && <Skeleton className="h-72 w-full max-w-2xl rounded-2xl" />}

      {/* ---------- Schedule ---------- */}
      {!loading && tab === "settings" && settings && (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,640px)_1fr]">
          <div className="card space-y-7 p-5 sm:p-6">
            <Switch
              checked={settings.enabled}
              onChange={(enabled) => setSettings({ ...settings, enabled })}
              label="Send appointment reminders"
              description="Turn off to pause every reminder for the clinic."
            />

            <div className={cn("space-y-7 transition-opacity", !settings.enabled && "pointer-events-none opacity-50")} aria-disabled={!settings.enabled}>
              <fieldset>
                <legend className="text-[13.5px] font-semibold text-ink">Channels</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {CHANNELS.map((c) => {
                    const on = settings.channels.includes(c.value);
                    return (
                      <button
                        key={c.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleChannel(c.value)}
                        className={cn(
                          "relative flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
                          on ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/30" : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", on ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500")}>
                          {c.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink">{c.label}</span>
                          <span className="block text-[13px] text-slate-500">{c.hint}</span>
                        </span>
                        {on && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                            <IconCheck size={13} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[13.5px] font-semibold text-ink">When to send</legend>
                <p className="mt-0.5 text-[13px] text-slate-500">Pick one or more. Patients get a message at each time.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LEAD_OPTIONS.map((o) => {
                    const on = settings.leadTimes.includes(o.value);
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleLead(o.value)}
                        className={cn(
                          "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
                          on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                        )}
                      >
                        {on && <IconCheck size={15} strokeWidth={3} />}
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {formError && <InlineAlert tone="danger">{formError}</InlineAlert>}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-slate-500">Reminders never include clinical details, only time, service name and clinic contact.</p>
              <Button variant="primary" loading={saving} onClick={saveSettings} className="shrink-0">
                Save schedule
              </Button>
            </div>
          </div>

          <aside className="card hidden p-5 lg:block">
            <p className="section-label">Preview</p>
            <div className="mt-3 rounded-2xl bg-slate-100 p-4">
              <p className="max-w-[260px] rounded-2xl rounded-bl-md bg-white p-3.5 text-[14px] leading-relaxed text-ink shadow-xs">
                {fillPreview(templates.find((t) => t.channel === "sms")?.body ?? "Hi {{patientName}}, a reminder of your {{service}} on {{date}} at {{time}}.")}
              </p>
            </div>
            <p className="mt-3 text-[13px] text-slate-500">This is how the SMS template reads with sample data.</p>
          </aside>
        </div>
      )}

      {/* ---------- Templates ---------- */}
      {!loading && tab === "templates" && (
        <div>
          {editing ? (
            <div>
              <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setEditing(null)}>
                <IconArrowLeft size={16} />
                All templates
              </Button>
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="card space-y-4 p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand" dot={false}>{editing.channel.toUpperCase()}</Badge>
                    <span className="text-sm text-slate-500">Editing template</span>
                  </div>
                  <Input label="Template name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  {editing.channel === "email" && (
                    <Input label="Subject" value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
                  )}
                  <div>
                    <label htmlFor="tpl-body" className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                      Message
                    </label>
                    <textarea
                      id="tpl-body"
                      ref={bodyRef}
                      value={editBody}
                      onChange={(e) => {
                        setEditBody(e.target.value);
                        setBlockedWords([]);
                        setTemplateError("");
                      }}
                      rows={8}
                      aria-invalid={bodyHasBlocked}
                      className={cn(
                        "w-full rounded-xl border bg-white px-3.5 py-3 leading-relaxed text-ink shadow-xs transition",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15",
                        bodyHasBlocked ? "border-danger bg-rose-50/40" : "border-slate-200 focus-visible:border-brand-500"
                      )}
                    />
                    <p className="mb-2 mt-2 text-[13px] text-slate-500">Tap a field to insert it where your cursor is.</p>
                    <div className="flex flex-wrap gap-2">
                      {TOKENS.map((tok) => (
                        <button
                          key={tok}
                          type="button"
                          onClick={() => insertToken(tok)}
                          className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-xs font-semibold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                        >
                          {tok}
                        </button>
                      ))}
                    </div>
                  </div>

                  {templateError && (
                    <InlineAlert tone="danger" title={templateError}>
                      {blockedWords.length > 0 && (
                        <span className="mt-1 flex flex-wrap items-center gap-1.5">
                          Remove:
                          {blockedWords.map((w) => (
                            <span key={w} className="rounded-md bg-rose-100 px-1.5 py-0.5 font-mono text-xs font-bold text-rose-800">
                              {w}
                            </span>
                          ))}
                        </span>
                      )}
                    </InlineAlert>
                  )}

                  <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
                    <Button variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                    <Button variant="primary" loading={saving} onClick={saveTemplate}>
                      Save template
                    </Button>
                  </div>
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                  <p className="section-label mb-3">Live preview</p>
                  {editing.channel === "sms" ? (
                    <div className="rounded-3xl bg-slate-100 p-5">
                      <p className="mb-2 text-center text-xs font-medium text-slate-500">Harbour Light Clinic</p>
                      <p className="max-w-[300px] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-white p-4 text-[14.5px] leading-relaxed text-ink shadow-xs">
                        {fillPreview(editBody) || "Your message appears here."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                        <p className="text-xs text-slate-500">From: Harbour Light Clinic</p>
                        <p className="mt-0.5 text-sm font-semibold text-ink">{fillPreview(editSubject) || "(no subject)"}</p>
                      </div>
                      <pre className="whitespace-pre-wrap p-4 font-sans text-[14.5px] leading-relaxed text-ink">{fillPreview(editBody)}</pre>
                    </div>
                  )}
                  <p className="mt-3 text-[13px] text-slate-500">
                    Clinical words (diagnosis, medication, symptoms and similar) are blocked when you save.
                  </p>
                </div>
              </div>
            </div>
          ) : templates.length === 0 ? (
            <EmptyState icon={<IconMail size={26} />} title="No templates" description="Reminder templates will appear here." />
          ) : (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {templates.map((t) => (
                <li key={t.id} className="card flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        {t.channel === "sms" ? <IconSmartphone size={20} /> : <IconMail size={20} />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{t.name}</p>
                        <Badge tone="neutral" dot={false} size="sm">{t.channel.toUpperCase()}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openEditor(t)}>
                      <IconEdit size={15} />
                      Edit
                    </Button>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{t.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ---------- Log ---------- */}
      {!loading && tab === "log" && (
        <>
          {failedCount > 0 && (
            <InlineAlert tone="warn" className="mb-4" title={`${failedCount} reminder${failedCount === 1 ? "" : "s"} failed`}>
              Check the phone or email on file for those patients.
            </InlineAlert>
          )}
          {log.length === 0 ? (
            <EmptyState icon={<IconBell size={26} />} title="No reminder activity" description="Sent and failed reminders will be listed here." />
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Preview</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {log.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar name={nameOf(entry.patientId)} size="sm" />
                            <span className="font-semibold text-ink">{nameOf(entry.patientId)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold uppercase text-slate-600">{entry.channel}</TableCell>
                        <TableCell>
                          <Badge tone={LOG_TONE[entry.status]} className="capitalize">{entry.status}</Badge>
                          {entry.error && <p className="mt-1 text-xs text-rose-700">{entry.error}</p>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-slate-600">{fmtWhen(entry.scheduledFor)}</TableCell>
                        <TableCell className="max-w-xs truncate text-slate-500">{entry.preview}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="space-y-3 md:hidden">
                {log.map((entry) => (
                  <li key={entry.id} className="card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={nameOf(entry.patientId)} size="sm" />
                        <span className="truncate font-semibold text-ink">{nameOf(entry.patientId)}</span>
                      </div>
                      <Badge tone={LOG_TONE[entry.status]} className="capitalize">{entry.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      <span className="font-semibold uppercase">{entry.channel}</span> · {fmtWhen(entry.scheduledFor)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{entry.preview}</p>
                    {entry.error && <p className="mt-1.5 text-xs font-medium text-rose-700">{entry.error}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </StaffShell>
  );
}
