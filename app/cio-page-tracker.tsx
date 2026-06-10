"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cioAnalytics } from "@/lib/cio-analytics";

// Fires a Customer.io `page` event on initial load and on every App Router
// navigation. Renders nothing.
export function CioPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    cioAnalytics?.page();
  }, [pathname]);

  return null;
}
