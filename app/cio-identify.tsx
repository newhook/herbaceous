"use client";

import { useEffect } from "react";
import { cioAnalytics } from "@/lib/cio-analytics";

// Associates the current browser with the signed-in user. Email is the stable
// unique key for an account in this app, so we use it as the Customer.io
// identifier and also send it (plus name) as traits. Renders nothing.
export function CioIdentify({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  useEffect(() => {
    if (!email) return;
    cioAnalytics?.identify(email, { email, name: name ?? undefined });
  }, [email, name]);

  return null;
}
