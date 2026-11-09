"use client";

import * as React from "react";
import Link from "next/link";
import { ButtonLink, IconButton, IconMenu, IconX } from "@/components/ui";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Demo" },
];

/** Compact menu for < md screens. */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <IconButton
        label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="text-white hover:bg-white/10 hover:text-white"
      >
        {open ? <IconX size={22} /> : <IconMenu size={22} />}
      </IconButton>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full animate-fade-in border-b border-white/10 bg-brand-950/95 px-4 pb-5 pt-2 backdrop-blur-xl"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center rounded-xl px-3 text-base font-semibold text-white/90 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid gap-2">
            <ButtonLink href="/staff/day" size="lg" fullWidth className="bg-white text-brand-900 hover:bg-brand-50">
              Open staff desk
            </ButtonLink>
            <ButtonLink
              href="/book"
              size="lg"
              variant="ghost"
              fullWidth
              className="border border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Book a visit
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
