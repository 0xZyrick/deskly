import Link from "next/link";
import {
  Avatar,
  Badge,
  ButtonLink,
  IconAlert,
  IconArrowRight,
  IconBell,
  IconBuilding,
  IconCalendar,
  IconCalendarCheck,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconLayout,
  IconLock,
  IconMessage,
  IconShield,
  IconSparkles,
  IconUser,
  IconUsers,
  IconWallet,
  IconWalkIn,
  Logo,
  SimulatedBadge,
  StatusChip,
  type AppointmentStatus,
} from "@/components/ui";
import { MobileNav } from "./_landing/mobile-nav";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Demo" },
];

const SCHEDULE: { t: string; n: string; s: string; st: AppointmentStatus }[] = [
  { t: "09:00", n: "Chinwe Okeke", s: "Initial consultation", st: "checked-in" },
  { t: "09:30", n: "James Mensah", s: "Follow-up", st: "scheduled" },
  { t: "10:00", n: "Fatima Bello", s: "Physiotherapy session", st: "scheduled" },
  { t: "10:45", n: "Emeka Nwosu", s: "Initial consultation", st: "waitlist" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:shadow-pop"
      >
        Skip to content
      </a>

      {/* ───────── Hero (with nav) ───────── */}
      <div className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-grid-faint [background-size:44px_44px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" aria-hidden />

        <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-950/70 backdrop-blur-xl">
          <div className="container-page relative flex h-16 items-center justify-between">
            <Logo tone="light" />
            <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3.5 py-2 text-[14.5px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 md:flex">
              <ButtonLink href="/book" variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                Book a visit
              </ButtonLink>
              <ButtonLink href="/staff/day" size="sm" className="bg-white text-brand-900 shadow-none hover:bg-brand-50">
                Open staff desk
              </ButtonLink>
            </div>
            <MobileNav />
          </div>
        </header>

        <main id="main">
          <section className="container-page grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-24">
            <div className="max-w-xl">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-brand-100">
                  <IconSparkles size={14} />
                  Front desk software for small clinics
                </span>
              </div>
              <h1
                className="mt-5 animate-fade-up text-balance font-heading text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl"
                style={{ animationDelay: "80ms" }}
              >
                A calmer front desk, <span className="text-brand-300">from first booking to last patient.</span>
              </h1>
              <p
                className="mt-5 max-w-lg animate-fade-up text-pretty text-lg leading-relaxed text-white/75"
                style={{ animationDelay: "160ms" }}
              >
                Patients book and pay a deposit from their phone. Your team runs the whole day from one screen. Reminders go out
                on their own, without a word of clinical detail.
              </p>
              <div className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
                <ButtonLink href="/staff/day" size="lg" className="bg-white text-brand-900 shadow-pop hover:bg-brand-50">
                  Open staff desk
                  <IconArrowRight size={18} />
                </ButtonLink>
                <ButtonLink
                  href="/book"
                  size="lg"
                  variant="ghost"
                  className="border border-white/25 text-white hover:bg-white/10 hover:text-white"
                >
                  Book a visit as a patient
                </ButtonLink>
              </div>
              <ul
                className="mt-9 grid animate-fade-up gap-2.5 text-[14.5px] font-medium text-white/80 sm:grid-cols-1"
                style={{ animationDelay: "320ms" }}
              >
                {["No clinical data stored", "Reminders without medical details", "Works on any phone, no app to install"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-400/25 text-brand-200">
                      <IconCheck size={13} strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <HeroMock />
          </section>
        </main>
      </div>

      {/* ───────── Proof strip ───────── */}
      <section aria-label="Demo figures" className="border-b border-slate-200 bg-white">
        <div className="container-page py-10">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {[
              ["9 min", "saved per booking"],
              ["3 taps", "to check a patient in"],
              ["24 h", "automatic reminder lead time"],
              ["0", "clinical details in any message"],
            ].map(([v, l]) => (
              <div key={l} className="text-center lg:text-left">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block font-heading text-4xl font-semibold tracking-tight text-brand-700">{v}</span>
                  <span className="mt-1 block text-[14.5px] text-slate-600">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-center text-xs font-medium text-slate-400 lg:text-left">Demo figures for illustration only.</p>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-page">
          <SectionHead
            eyebrow="Everything in one place"
            title="Built for the way small clinics actually run"
            body="No sprawling hospital system. Just the tools a front desk reaches for a hundred times a day."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
            <Feature
              className="md:col-span-4"
              icon={<IconCalendarCheck size={22} />}
              title="Online booking patients finish"
              body="Seven short steps on any phone: service, clinician, time, details, intake, consent, deposit. Progress is saved if they step away."
            >
              <div className="mt-5 flex gap-1.5 overflow-hidden" aria-hidden>
                {["Service", "Clinician", "Time", "Details", "Intake", "Consent", "Deposit"].map((s, i) => (
                  <span
                    key={s}
                    className={`min-w-0 flex-1 truncate rounded-lg px-1 py-2 text-center text-[10px] font-semibold sm:px-2 sm:text-xs ${
                      i < 3 ? "bg-brand-600 text-white" : i === 3 ? "bg-brand-100 text-brand-800 ring-2 ring-brand-300" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Feature>

            <Feature
              className="md:col-span-2"
              icon={<IconWallet size={22} />}
              title="Deposits that cut no-shows"
              body="Hold the slot with a small deposit. Refund in one click."
            >
              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3" aria-hidden>
                <span className="text-sm text-slate-500">Deposit</span>
                <span className="font-heading text-xl font-semibold text-ink">₦5,000</span>
              </div>
            </Feature>

            <Feature
              className="md:col-span-3"
              icon={<IconLayout size={22} />}
              title="A live day view"
              body="Check in with one tap, see who is waiting, search by name or phone."
            >
              <div className="mt-5 space-y-2" aria-hidden>
                {SCHEDULE.slice(0, 2).map((r) => (
                  <div key={r.t} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                    <span className="w-11 text-sm font-semibold tabular-nums text-ink">{r.t}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{r.n}</span>
                    <StatusChip status={r.st} size="sm" />
                  </div>
                ))}
              </div>
            </Feature>

            <Feature
              className="md:col-span-3"
              icon={<IconBell size={22} />}
              title="Reminders that stay non-clinical"
              body="SMS and email on your schedule. Templates reject clinical words on save."
            >
              <div className="mt-5 rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700" aria-hidden>
                Hi Chinwe, a reminder for your appointment at Harbour Light Clinic on 6 Nov at 09:00. Reply STOP to opt out.
              </div>
            </Feature>

            <Feature
              className="md:col-span-3"
              icon={<IconUsers size={22} />}
              title="Waitlist that fills the gaps"
              body="When someone cancels or no-shows, offer the freed slot to the next person."
            >
              <div className="mt-5 flex items-center gap-3" aria-hidden>
                <Badge tone="violet">3 waiting</Badge>
                <IconArrowRight size={16} className="text-slate-300" />
                <Badge tone="ok">Slot offered</Badge>
              </div>
            </Feature>

            <Feature
              className="md:col-span-3"
              icon={<IconWalkIn size={22} />}
              title="Walk-ins without the scramble"
              body="Add someone who just arrived in seconds. Conflicts are checked for you."
            >
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600" aria-hidden>
                <IconClock size={16} className="text-brand-600" /> Starts now · Dr. Adebayo
              </div>
            </Feature>
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section id="how" className="scroll-mt-20 border-y border-slate-200 bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHead eyebrow="How it works" title="Live in an afternoon" body="Three steps, each with its own screens you can try right now." />
          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                n: "01",
                icon: <IconBuilding size={22} />,
                t: "Set up in minutes",
                b: "Add your clinic, services, team, opening hours, deposit and reminder preferences. A checklist tells you when you are ready.",
                href: "/onboarding",
                cta: "Try clinic setup",
              },
              {
                n: "02",
                icon: <IconUser size={22} />,
                t: "Patients book themselves",
                b: "Share one link. Patients pick a service and a time that is genuinely free, then pay a deposit to hold it.",
                href: "/book",
                cta: "Try patient booking",
              },
              {
                n: "03",
                icon: <IconLayout size={22} />,
                t: "Run the day from one screen",
                b: "Check in, reschedule, mark no-shows, take walk-ins and review payments and reminders without switching tools.",
                href: "/staff/day",
                cta: "Open the staff desk",
              },
            ].map((s) => (
              <li key={s.n} className="card relative flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{s.icon}</span>
                  <span className="font-heading text-3xl font-semibold text-slate-200">{s.n}</span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-ink">{s.t}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">{s.b}</p>
                <Link
                  href={s.href}
                  className="mt-5 inline-flex h-11 items-center gap-1.5 text-[15px] font-semibold text-brand-700 hover:text-brand-800"
                >
                  {s.cta} <IconArrowRight size={16} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Demo entry ───────── */}
      <section id="demo" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-page">
          <SectionHead eyebrow="Explore the demo" title="Pick a role and dive in" body="Everything runs on simulated data. Nothing you do here touches a real patient." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/staff/day", icon: <IconCalendar size={22} />, t: "Staff desk", d: "Day and week schedule, check-in, walk-ins, payments and reminders." },
              { href: "/book", icon: <IconUser size={22} />, t: "Patient booking", d: "The seven-step mobile flow from service choice to confirmation." },
              { href: "/onboarding", icon: <IconBuilding size={22} />, t: "Clinic setup", d: "Onboarding wizard that ends with a go-live checklist." },
              { href: "/design", icon: <IconLayout size={22} />, t: "Design system", d: "Every component and state in the Deskly UI kit." },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  {c.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-lg font-semibold text-ink">{c.t}</span>
                  <span className="mt-0.5 block text-[15px] text-slate-600">{c.d}</span>
                </span>
                <IconArrowRight size={18} className="mt-1 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Trust ───────── */}
      <section className="pb-20 sm:pb-28" aria-labelledby="trust-h">
        <div className="container-page">
          <div className="relative isolate overflow-hidden rounded-3xl bg-brand-950 px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="absolute inset-0 -z-10 bg-hero-glow opacity-80" aria-hidden />
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-brand-300">
                  <IconShield size={16} /> Built for trust
                </span>
                <h2 id="trust-h" className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  Scheduling, not medical records
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/75">
                  Deskly keeps contact details and appointment times only. That keeps your front desk fast and your risk small.
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { i: <IconLock size={20} />, t: "No clinical data", d: "Intake asks for a reason to visit, never a diagnosis." },
                  { i: <IconMessage size={20} />, t: "Clean reminders", d: "Templates containing clinical words are blocked on save." },
                  { i: <IconAlert size={20} />, t: "Simulated here", d: "Payments, SMS and email are all simulated in this build." },
                  { i: <IconCheckCircle size={20} />, t: "Clear consent", d: "Patients agree to how their details are used before paying." },
                ].map((x) => (
                  <li key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-brand-200">{x.i}</span>
                    <p className="mt-3 font-semibold">{x.t}</p>
                    <p className="mt-0.5 text-sm text-white/65">{x.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="pb-20 sm:pb-28">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Give your front desk its time back
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-600">Walk through the whole product in a few minutes. No sign-up needed.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/staff/day" size="lg">
              Open staff desk <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/onboarding" size="lg" variant="outline">
              Set up a clinic
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-slate-600">Front desk software for small private clinics.</p>
            <SimulatedBadge className="mt-3" />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-[15px] sm:grid-cols-3">
            {[
              ["/staff/day", "Staff desk"],
              ["/book", "Patient booking"],
              ["/onboarding", "Clinic setup"],
              ["/design", "Design system"],
              ["#features", "Features"],
              ["#how", "How it works"],
            ].map(([h, l]) => (
              <Link key={h} href={h} className="flex h-10 items-center font-medium text-slate-600 hover:text-brand-700">
                {l}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-slate-100">
          <p className="container-page py-5 text-xs text-slate-500">© 2026 Deskly. Simulated data only. No real patients, payments or messages.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</p>
      <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      <p className="mt-4 text-pretty text-[17px] leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`card flex min-w-0 flex-col p-6 ${className}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{icon}</span>
      <h3 className="mt-4 font-heading text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{body}</p>
      {children}
    </article>
  );
}

function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] animate-fade-up lg:mx-0 lg:justify-self-end" style={{ animationDelay: "200ms" }} aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-400/20 blur-3xl" />
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-white shadow-pop">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200">
            deskly.app/staff/day
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Thursday 5 November</p>
              <p className="font-heading text-xl font-semibold text-ink sm:text-2xl">Today</p>
            </div>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              ["Booked", "9"],
              ["Checked in", "3"],
              ["Waiting", "6"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-[11px] font-medium text-slate-500">{l}</p>
                <p className="font-heading text-2xl font-semibold text-ink">{v}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {SCHEDULE.map((r) => (
              <li key={r.t} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
                <span className="w-11 text-sm font-semibold tabular-nums text-ink">{r.t}</span>
                <Avatar name={r.n} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">{r.n}</span>
                  <span className="block truncate text-xs text-slate-500">{r.s}</span>
                </span>
                <span className="hidden sm:block">
                  <StatusChip status={r.st} size="sm" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute -left-3 top-16 hidden animate-float items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 pr-4 shadow-pop sm:flex lg:-left-10">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <IconWallet size={18} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">Deposit received</span>
          <span className="block text-xs text-slate-500">₦5,000 · Aisha Yusuf</span>
        </span>
      </div>
      <div
        className="absolute -bottom-5 right-2 flex animate-float items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 pr-4 shadow-pop sm:-right-3 lg:-right-6"
        style={{ animationDelay: "1.5s" }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <IconBell size={18} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">Reminder sent</span>
          <span className="block text-xs text-slate-500">SMS · 24 h before</span>
        </span>
      </div>
    </div>
  );
}
