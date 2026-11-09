import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "dark" | "soft-danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const buttonStyles = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} = {}) =>
  cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold",
    "transition-all duration-150 active:scale-[0.985]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
    "disabled:pointer-events-none disabled:opacity-45",
    {
      primary:
        "bg-brand-600 text-white shadow-[0_1px_0_rgba(255,255,255,.18)_inset,0_1px_2px_rgba(4,42,41,.3)] hover:bg-brand-700",
      secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-ink",
      danger: "bg-danger text-white shadow-xs hover:bg-rose-700",
      "soft-danger": "bg-danger-soft text-danger-dark hover:bg-rose-100",
      outline:
        "border border-slate-200 bg-white text-ink shadow-xs hover:border-slate-300 hover:bg-slate-50",
      dark: "bg-ink text-white shadow-xs hover:bg-ink-soft",
    }[variant],
    {
      sm: "h-9 px-3.5 text-[13px]",
      md: "h-11 px-5 text-[15px]",
      lg: "h-[52px] px-6 text-base",
    }[size],
    fullWidth && "w-full"
  );

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading = false, fullWidth = false, disabled, children, type = "button", ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

/** A link that looks like a button (use instead of wrapping <Button> in <Link>). */
export function ButtonLink({
  href,
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...props}>
      {children}
    </Link>
  );
}

export function IconButton({
  className,
  label,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition",
        "hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
