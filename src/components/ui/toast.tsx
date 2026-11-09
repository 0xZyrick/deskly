"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconAlert, IconCheckCircle, IconInfo, IconX } from "./icons";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  onDismiss?: (id: string) => void;
  duration?: number;
}

const ICONS: Record<ToastVariant, { icon: React.ReactNode; wrap: string }> = {
  default: { icon: <IconInfo size={20} />, wrap: "bg-slate-100 text-slate-600" },
  success: { icon: <IconCheckCircle size={20} />, wrap: "bg-emerald-100 text-emerald-700" },
  error: { icon: <IconAlert size={20} />, wrap: "bg-rose-100 text-rose-700" },
  warning: { icon: <IconAlert size={20} />, wrap: "bg-amber-100 text-amber-700" },
};

export function Toast({ id, title, description, variant = "default", onDismiss, duration = 5000 }: ToastProps) {
  React.useEffect(() => {
    if (!onDismiss || !duration) return;
    const t = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(t);
  }, [id, onDismiss, duration]);

  const v = ICONS[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 pr-2.5 shadow-pop"
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", v.wrap)}>{v.icon}</span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && <p className="mt-0.5 text-[13px] text-slate-600">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
          aria-label="Dismiss notification"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastProps[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-4 pb-24 sm:items-end sm:pb-6 lg:pr-6"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/** Tiny hook so pages can fire toasts without wiring state by hand. */
export function useToasts() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const dismiss = React.useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  const push = React.useCallback((t: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p.slice(-2), { ...t, id }]);
  }, []);
  const node = <ToastContainer toasts={toasts} onDismiss={dismiss} />;
  return { push, dismiss, toasts, node };
}
