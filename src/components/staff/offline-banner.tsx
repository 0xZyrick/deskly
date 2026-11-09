"use client";

import * as React from "react";
import { IconAlert } from "@/components/ui/icons";

export function OfflineBanner() {
  const [offline, setOffline] = React.useState(false);

  React.useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-rose-600 px-4 py-2 text-center text-[13px] font-semibold text-white"
    >
      <IconAlert size={16} />
      You&apos;re offline. Changes may not save until the connection returns.
    </div>
  );
}
