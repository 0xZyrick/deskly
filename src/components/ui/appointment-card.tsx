import * as React from "react";
import { cn } from "@/lib/utils";
import { StatusChip, type AppointmentStatus } from "./status-chip";
import { Button } from "./button";
import { Avatar } from "./surfaces";

export interface AppointmentCardProps {
  id: string;
  patientName: string;
  serviceName: string;
  clinicianName?: string;
  time: string;
  durationMinutes?: number;
  status: AppointmentStatus;
  onCheckIn?: () => void;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

export function AppointmentCard({
  patientName,
  serviceName,
  clinicianName,
  time,
  durationMinutes,
  status,
  onCheckIn,
  onClick,
  className,
  loading,
}: AppointmentCardProps) {
  const dim = ["cancelled", "no-show", "completed"].includes(status);
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "group flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition",
        onClick && "cursor-pointer hover:border-brand-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20",
        loading && "pointer-events-none opacity-60",
        className
      )}
    >
      <div className="flex w-[68px] shrink-0 flex-col items-center justify-center border-r border-slate-100 bg-slate-50/80 py-3">
        <span className="font-heading text-[17px] font-semibold tabular-nums leading-none text-ink">{time}</span>
        {durationMinutes != null && <span className="mt-1 text-[11px] font-medium text-slate-500">{durationMinutes} min</span>}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3">
        <Avatar name={patientName} size="md" className={cn(dim && "opacity-60")} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={cn("truncate text-[15px] font-semibold text-ink", dim && "text-slate-600")}>{patientName}</span>
            <StatusChip status={status} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-slate-500">
            {serviceName}
            {clinicianName ? ` · ${clinicianName}` : ""}
          </p>
        </div>
        {status === "scheduled" && onCheckIn && (
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onCheckIn();
            }}
          >
            Check in
          </Button>
        )}
      </div>
    </div>
  );
}
