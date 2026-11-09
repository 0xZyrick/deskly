"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OfflineBanner } from "./offline-banner";
import { SimulatedBadge } from "@/components/ui/simulated-badge";
import { Logo, LogoMark } from "@/components/ui/logo";
import {
  IconArrowUpRight,
  IconBell,
  IconCalendar,
  IconGrid,
  IconHome,
  IconWallet,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/staff/day", label: "Day", icon: IconCalendar },
  { href: "/staff/week", label: "Week", icon: IconGrid },
  { href: "/staff/payments", label: "Payments", icon: IconWallet },
  { href: "/staff/reminders", label: "Reminders", icon: IconBell },
];

export function StaffShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:shadow-pop"
      >
        Skip to content
      </a>
      <OfflineBanner />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>

        <div className="px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-heading text-sm font-bold text-white">
              HL
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">Harbour Light Clinic</p>
              <p className="text-xs text-slate-500">Front desk</p>
            </div>
          </div>
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-1 px-4" aria-label="Staff">
          <p className="section-label mb-1 px-3">Workspace</p>
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-xl px-3 text-[14.5px] font-semibold transition-colors",
                  active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                )}
              >
                {active && <span className="absolute -left-4 top-2 h-7 w-1 rounded-r-full bg-brand-600" aria-hidden />}
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-100 p-4">
          <Link
            href="/book"
            className="flex h-10 items-center justify-between rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-ink"
          >
            Patient booking page
            <IconArrowUpRight size={16} />
          </Link>
          <Link
            href="/"
            className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-ink"
          >
            <IconHome size={16} />
            Back to site
          </Link>
          <div className="px-3 pt-2">
            <SimulatedBadge />
          </div>
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 pt-safe backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/" aria-label="Deskly home">
                <LogoMark size={30} />
              </Link>
              <div className="min-w-0">
                <h1 className="truncate font-heading text-[17px] font-semibold leading-tight text-ink">
                  {title ?? "Deskly"}
                </h1>
                {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </div>
        </header>

        {/* Desktop top bar */}
        <div className="sticky top-0 z-20 hidden h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/85 px-8 backdrop-blur lg:flex">
          <div className="min-w-0">
            <h1 className="truncate font-heading text-xl font-semibold tracking-tight text-ink">{title ?? "Deskly"}</h1>
            {subtitle && <p className="truncate text-[13px] text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>

        <main id="main-content" className="mx-auto w-full max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Staff mobile"
      >
        <ul className="grid grid-cols-4">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors",
                    active ? "text-brand-700" : "text-slate-500"
                  )}
                >
                  <span className={cn("flex h-7 w-12 items-center justify-center rounded-full transition-colors", active && "bg-brand-100")}>
                    <Icon size={20} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
