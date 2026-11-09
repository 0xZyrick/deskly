import { cn } from "@/lib/utils";

/** Reminds everyone that this build runs on simulated data only. */
export function SimulatedBadge({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider",
        tone === "dark"
          ? "border-white/15 bg-white/10 text-white/80"
          : "border-amber-200 bg-amber-50 text-amber-800",
        className
      )}
      title="Simulated data only. No real patients, payments or messages."
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "dark" ? "bg-amber-300" : "bg-amber-500")} aria-hidden />
      Demo data
    </span>
  );
}
