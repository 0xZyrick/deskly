"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "./button";
import { IconX } from "./icons";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "right" | "left";
  className?: string;
  /** Optional element rendered beside the title (e.g. a status chip) */
  headerExtra?: React.ReactNode;
}

/** Side panel on tablet/desktop; bottom sheet on phones. */
export function Drawer({ open, onClose, title, description, children, footer, side = "right", className, headerExtra }: DrawerProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <div className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "absolute flex flex-col bg-white shadow-pop outline-none",
          // phone: bottom sheet
          "inset-x-0 bottom-0 max-h-[92dvh] animate-sheet-up rounded-t-3xl",
          // sm+: full-height side panel
          "sm:inset-y-0 sm:max-h-none sm:w-full sm:max-w-[440px] sm:animate-slide-left sm:rounded-none",
          side === "right" ? "sm:left-auto sm:right-0 sm:rounded-l-3xl" : "sm:left-0 sm:right-auto sm:rounded-r-3xl",
          className
        )}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-4 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate font-heading text-xl font-semibold tracking-tight text-ink">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-sm text-slate-600">
                {description}
              </p>
            )}
            {headerExtra && <div className="mt-2">{headerExtra}</div>}
          </div>
          <IconButton label="Close panel" onClick={onClose} className="-mr-2 -mt-1">
            <IconX size={20} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 pb-safe sm:px-6 sm:pb-4">{footer}</div>}
      </div>
    </div>
  );
}
