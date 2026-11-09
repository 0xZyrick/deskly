"use client";

import * as React from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  EmptyState,
  IconArrowLeft,
  IconBell,
  IconCalendar,
  IconPlus,
  IconUsers,
  IconWallet,
  InlineAlert,
  Input,
  Logo,
  Modal,
  AppointmentCard,
  Segmented,
  Select,
  SimulatedBadge,
  Skeleton,
  StatCard,
  StatusChip,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
  TimeSlotChip,
  useToasts,
  type AppointmentStatus,
  type Step,
} from "@/components/ui";

const STEPS: Step[] = [
  { id: "clinic", title: "Clinic details", description: "Name and contact" },
  { id: "services", title: "Services", description: "What you offer" },
  { id: "clinicians", title: "Clinicians", description: "Your team" },
  { id: "hours", title: "Opening hours", optional: true },
  { id: "go-live", title: "Go live" },
];

const BRAND = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const BRAND_CLASS: Record<(typeof BRAND)[number], string> = {
  50: "bg-brand-50",
  100: "bg-brand-100",
  200: "bg-brand-200",
  300: "bg-brand-300",
  400: "bg-brand-400",
  500: "bg-brand-500",
  600: "bg-brand-600",
  700: "bg-brand-700",
  800: "bg-brand-800",
  900: "bg-brand-900",
  950: "bg-brand-950",
};

const STATUSES: AppointmentStatus[] = ["scheduled", "checked-in", "in-progress", "completed", "cancelled", "no-show", "waitlist"];

const SECTIONS = [
  ["colour", "Colour"],
  ["type", "Type"],
  ["buttons", "Buttons"],
  ["forms", "Forms"],
  ["status", "Status"],
  ["nav", "Navigation"],
  ["data", "Data"],
  ["feedback", "Feedback"],
  ["overlays", "Overlays"],
] as const;

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 py-8 sm:py-10">
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      {desc && <p className="mt-1 max-w-2xl text-[15px] text-slate-600">{desc}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Demo({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="card p-5">
      <p className="section-label mb-4">{label}</p>
      <div className={className}>{children}</div>
    </div>
  );
}

export default function DesignPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [step, setStep] = React.useState(2);
  const [slot, setSlot] = React.useState<string | null>("10:30");
  const [date, setDate] = React.useState("2026-11-05");
  const [tab, setTab] = React.useState("settings");
  const [seg, setSeg] = React.useState("day");
  const [on, setOn] = React.useState(true);
  const [c1, setC1] = React.useState(true);
  const [c2, setC2] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { push, node } = useToasts();

  const fakeLoad = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 sm:inline">Design system</span>
          </div>
          <div className="flex items-center gap-2">
            <SimulatedBadge className="hidden sm:inline-flex" />
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-ink"
            >
              <IconArrowLeft size={16} /> Home
            </Link>
          </div>
        </div>
        <nav aria-label="Sections" className="scroll-hide overflow-x-auto border-t border-slate-100">
          <ul className="container-page flex min-w-max gap-1 py-1.5">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="flex h-9 items-center rounded-lg px-3 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="container-page pb-24 pt-8">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">The Deskly UI kit</h1>
          <p className="mt-3 text-lg text-slate-600">
            One calm teal accent, generous touch targets and soft surfaces. Every component below is the real one used across the app.
          </p>
        </div>

        <Section id="colour" title="Colour" desc="Brand teal is the only accent. Semantic colours carry meaning and are always paired with text.">
          <Demo label="Brand scale">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-11">
              {BRAND.map((n) => (
                <div key={n}>
                  <div className={`h-14 rounded-xl ring-1 ring-black/5 ${BRAND_CLASS[n]}`} />
                  <p className="mt-1.5 text-center text-[11px] font-semibold tabular-nums text-slate-500">{n}</p>
                </div>
              ))}
            </div>
          </Demo>
          <Demo label="Semantic">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Success", "bg-ok", "bg-ok-soft text-ok-dark"],
                ["Warning", "bg-warn", "bg-warn-soft text-warn-dark"],
                ["Danger", "bg-danger", "bg-danger-soft text-danger-dark"],
                ["Info", "bg-info", "bg-info-soft text-info-dark"],
              ].map(([n, solid, soft]) => (
                <div key={n} className="overflow-hidden rounded-xl ring-1 ring-black/5">
                  <div className={`h-10 ${solid}`} />
                  <div className={`px-3 py-2 text-sm font-semibold ${soft}`}>{n}</div>
                </div>
              ))}
            </div>
          </Demo>
        </Section>

        <Section id="type" title="Type" desc="Bricolage Grotesque for headings, Figtree for everything else. Inputs stay at 16px on phones to avoid zoom.">
          <Demo label="Scale" className="space-y-4">
            <p className="font-heading text-5xl font-semibold tracking-tight text-ink">Display 48</p>
            <p className="font-heading text-3xl font-semibold tracking-tight text-ink">Heading 30</p>
            <p className="font-heading text-xl font-semibold text-ink">Title 20</p>
            <p className="text-[15px] text-ink">Body 15. Patients book and pay a deposit from their phone, and the team runs the day from one screen.</p>
            <p className="text-sm text-slate-600">Secondary 14. Supporting detail and descriptions.</p>
            <p className="section-label">Section label</p>
            <p className="text-2xl font-semibold tabular-nums text-ink">₦15,000 · 09:30 · 0801 000 0001</p>
          </Demo>
        </Section>

        <Section id="buttons" title="Buttons" desc="44px by default on touch. Use one primary action per view.">
          <Demo label="Variants" className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="soft-danger">Soft danger</Button>
          </Demo>
          <Demo label="Sizes and states" className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading={loading} onClick={fakeLoad}>
              {loading ? "Saving" : "Click to load"}
            </Button>
            <Button disabled>Disabled</Button>
            <Button>
              <IconPlus size={18} /> With icon
            </Button>
          </Demo>
        </Section>

        <Section id="forms" title="Forms" desc="Labels always visible, errors inline with an icon, hints in neutral text.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Demo label="Inputs" className="space-y-4">
              <Input label="Full name" placeholder="Chinwe Okeke" required />
              <Input label="Phone" type="tel" placeholder="+234 801 000 0000" hint="We only use this for confirmations." />
              <Input label="Email" type="email" defaultValue="not-an-email" error="Enter a valid email or leave blank" />
              <Input label="Disabled" disabled defaultValue="Locked value" />
              <Textarea label="Notes" optional placeholder="e.g. prefers morning appointments" />
            </Demo>
            <Demo label="Choice controls" className="space-y-5">
              <Select
                label="Clinician"
                defaultValue="a"
                options={[
                  { value: "a", label: "Dr. Adebayo · General Practitioner" },
                  { value: "o", label: "Dr. Okoro · Physiotherapist" },
                ]}
              />
              <DatePicker label="Date" value={date} onChange={setDate} />
              <Checkbox checked={c1} onChange={setC1} label="Email reminders" description="Sent 24 hours before" />
              <Checkbox checked={c2} onChange={setC2} label="SMS reminders" />
              <Switch checked={on} onChange={setOn} label="Send appointment reminders" description="Turn off to pause every channel." />
              <div>
                <p className="mb-2 text-[13.5px] font-semibold text-ink">Time slots</p>
                <div className="flex flex-wrap gap-2">
                  {["09:00", "09:30", "10:30", "11:00"].map((t) => (
                    <TimeSlotChip key={t} time={t} selected={slot === t} onClick={() => setSlot(t)} />
                  ))}
                  <TimeSlotChip time="12:00" unavailable />
                </div>
              </div>
            </Demo>
          </div>
        </Section>

        <Section id="status" title="Status" desc="Pills combine a dot and a label so colour is never the only signal.">
          <Demo label="Appointment status" className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <StatusChip key={s} status={s} />
            ))}
          </Demo>
          <Demo label="Badge tones" className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="brand">Brand</Badge>
            <Badge tone="ok">Paid</Badge>
            <Badge tone="warn">Pending</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="violet">Waitlist</Badge>
          </Demo>
        </Section>

        <Section id="nav" title="Navigation and progress">
          <div className="grid gap-6 lg:grid-cols-2">
            <Demo label="Tabs" className="space-y-6">
              <Tabs
                label="Demo tabs"
                value={tab}
                onChange={setTab}
                items={[
                  { id: "settings", label: "Schedule" },
                  { id: "templates", label: "Templates", count: 3 },
                  { id: "log", label: "Log" },
                ]}
              />
              <Segmented
                label="Range"
                value={seg}
                onChange={setSeg}
                items={[
                  { id: "day", label: "Day" },
                  { id: "week", label: "Week" },
                  { id: "month", label: "Month" },
                ]}
              />
            </Demo>
            <Demo label="Stepper (vertical)">
              <Stepper steps={STEPS} currentStep={step} onStepClick={setStep} isClickable={() => true} skipped={[3]} />
            </Demo>
          </div>
          <Demo label="Stepper (horizontal)">
            <Stepper steps={STEPS.map((s) => ({ id: s.id, title: s.title }))} currentStep={step} orientation="horizontal" />
          </Demo>
        </Section>

        <Section id="data" title="Data display">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Appointments" value="9" hint="Today" icon={<IconCalendar size={20} />} />
            <StatCard label="Paid today" value="₦25,000" hint="5 payments" icon={<IconWallet size={20} />} tone="ok" />
            <StatCard label="On waitlist" value="3" icon={<IconUsers size={20} />} tone="warn" />
            <StatCard label="Reminders due" value="—" icon={<IconBell size={20} />} tone="info" loading />
          </div>
          <Demo label="Avatars" className="flex flex-wrap items-center gap-3">
            {["Chinwe Okeke", "James Mensah", "Fatima Bello", "Dr. Adebayo", "Emeka Nwosu"].map((n) => (
              <Avatar key={n} name={n} size="lg" />
            ))}
            <Avatar name="Aisha Yusuf" size="sm" />
            <Avatar name="Tunde Balogun" size="xs" />
          </Demo>
          <Demo label="Appointment cards" className="space-y-3">
            <AppointmentCard id="1" patientName="Chinwe Okeke" serviceName="Initial consultation" clinicianName="Dr. Adebayo" time="09:00" durationMinutes={30} status="checked-in" onClick={() => {}} />
            <AppointmentCard id="2" patientName="James Mensah" serviceName="Follow-up" clinicianName="Dr. Adebayo" time="09:30" durationMinutes={15} status="scheduled" onClick={() => {}} onCheckIn={() => push({ title: "James checked in", variant: "success" })} />
            <AppointmentCard id="3" patientName="Aisha Yusuf" serviceName="Physiotherapy session" clinicianName="Dr. Okoro" time="11:00" durationMinutes={45} status="no-show" />
          </Demo>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Chinwe Okeke", "₦5,000", "ok", "Paid", "3 Nov 2026"],
                ["James Mensah", "₦5,000", "warn", "Pending", "4 Nov 2026"],
                ["Fatima Bello", "₦5,000", "danger", "Failed", "4 Nov 2026"],
              ].map(([n, a, tone, label, d]) => (
                <TableRow key={n}>
                  <TableCell>
                    <span className="flex items-center gap-3 font-semibold text-ink">
                      <Avatar name={n} size="sm" /> {n}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">{a}</TableCell>
                  <TableCell>
                    <Badge tone={tone as "ok" | "warn" | "danger"}>{label}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{d}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section id="feedback" title="Feedback">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <InlineAlert tone="info" title="Heads up">Reminders never include clinical details.</InlineAlert>
              <InlineAlert tone="ok" title="Saved">Your schedule has been updated.</InlineAlert>
              <InlineAlert tone="warn" title="Almost full">Only two slots left today.</InlineAlert>
              <InlineAlert tone="danger" title="Payment failed" action={<Button size="sm" variant="outline">Try again</Button>}>
                The simulated card was declined.
              </InlineAlert>
            </div>
            <EmptyState
              icon={<IconCalendar size={26} />}
              title="No appointments"
              description="Nothing on the schedule yet. Add a walk-in when ready."
              action={{ label: "Add walk-in", onClick: () => push({ title: "Walk-in added", variant: "success" }) }}
            />
          </div>
          <Demo label="Skeleton" className="space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </Demo>
          <Demo label="Toasts" className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => push({ title: "Reminder sent" })}>Default</Button>
            <Button variant="outline" size="sm" onClick={() => push({ title: "Appointment confirmed", description: "Thu 5 Nov at 10:30", variant: "success" })}>Success</Button>
            <Button variant="outline" size="sm" onClick={() => push({ title: "Payment failed", description: "Please try another method.", variant: "error" })}>Error</Button>
            <Button variant="outline" size="sm" onClick={() => push({ title: "Slot almost full", variant: "warning" })}>Warning</Button>
          </Demo>
        </Section>

        <Section id="overlays" title="Overlays" desc="Bottom sheets on phones, centred dialog or side panel from 640px up.">
          <Demo label="Modal and drawer" className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setModalOpen(true)}>Open modal</Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          </Demo>
        </Section>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm refund"
        description="This is a simulated refund. No real money moves."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>Confirm refund</Button>
          </>
        }
      >
        <p className="text-[15px] text-ink">
          Refund <strong>₦5,000</strong> for reference <strong>PAY-1042</strong>?
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Chinwe Okeke"
        description="Thu 5 Nov · 09:00"
        headerExtra={<StatusChip status="checked-in" />}
        footer={<Button variant="outline" fullWidth onClick={() => setDrawerOpen(false)}>Close</Button>}
      >
        <div className="space-y-3 text-sm">
          <p className="text-slate-600">Service</p>
          <p className="font-semibold text-ink">Initial consultation</p>
          <p className="pt-2 text-slate-600">Clinician</p>
          <p className="font-semibold text-ink">Dr. Adebayo</p>
        </div>
      </Drawer>

      {node}
    </div>
  );
}
