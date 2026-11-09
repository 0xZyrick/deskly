"use client";

import * as React from "react";
import { Button, ButtonLink, IconAlert, IconRefresh, Logo } from "@/components/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center" role="alert">
      <Logo />
      <span className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <IconAlert size={28} />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-[16px] text-slate-600">
        We hit an unexpected problem. Your data is safe. Try again, and if it keeps happening, head back home.
      </p>
      {error.digest && <p className="mt-3 font-mono text-xs text-slate-400">Ref: {error.digest}</p>}
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <Button size="lg" onClick={reset}>
          <IconRefresh size={18} /> Try again
        </Button>
        <ButtonLink href="/" size="lg" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </main>
  );
}
