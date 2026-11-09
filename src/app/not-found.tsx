import { ButtonLink, IconArrowRight, IconSearch, Logo } from "@/components/ui";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <Logo />
      <span className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <IconSearch size={28} />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-700">Error 404</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">We can’t find that page</h1>
      <p className="mt-3 max-w-md text-[16px] text-slate-600">
        The link may be old or mistyped. Head back to the start, or jump straight into the staff desk.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <ButtonLink href="/" size="lg">
          Back to home <IconArrowRight size={18} />
        </ButtonLink>
        <ButtonLink href="/staff/day" size="lg" variant="outline">
          Open staff desk
        </ButtonLink>
      </div>
    </main>
  );
}
