import Link from "next/link";
import { cn } from "@/lib/utils";

/** Deskly mark: a rounded "D" whose counter is an open appointment slot. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("shrink-0", className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="dk-g" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1F9C90" />
          <stop offset="1" stopColor="#0D4B47" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#dk-g)" />
      <path
        d="M13 10.5h6.2c5.6 0 9.3 3.4 9.3 9.5s-3.7 9.5-9.3 9.5H13a1 1 0 0 1-1-1V11.5a1 1 0 0 1 1-1Z"
        fill="#fff"
        fillOpacity=".16"
      />
      <path
        d="M14.5 12.5h4.7c4.5 0 7.3 2.6 7.3 7.5s-2.8 7.5-7.3 7.5h-4.7V12.5Z"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="19.5" cy="20" r="2.1" fill="#9BE7DC" />
    </svg>
  );
}

export function Logo({
  href = "/",
  size = "md",
  showWord = true,
  tone = "dark",
  className,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWord?: boolean;
  tone?: "dark" | "light";
  className?: string;
}) {
  const px = size === "lg" ? 40 : size === "sm" ? 30 : 34;
  return (
    <Link
      href={href}
      aria-label="Deskly home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
        className
      )}
    >
      <LogoMark size={px} />
      {showWord && (
        <span
          className={cn(
            "font-heading font-bold tracking-tight",
            size === "lg" ? "text-2xl" : "text-[19px]",
            tone === "light" ? "text-white" : "text-ink"
          )}
        >
          Deskly
        </span>
      )}
    </Link>
  );
}
