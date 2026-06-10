import { AnalyticsBrowser } from "@customerio/cdp-analytics-browser";

// Customer.io Data Pipelines browser client.
//
// The write key is public by design (NEXT_PUBLIC_*) and only loads in the
// browser. We keep the AnalyticsBrowser instance itself in module state — it
// buffers page/identify/track calls until the SDK finishes loading. Do not
// wrap it in an async initializer: the instance is thenable, so awaiting it can
// unwrap the client and drop the buffered analytics methods.
const writeKey = process.env.NEXT_PUBLIC_CIO_CDP_WRITE_KEY;

export const cioAnalytics =
  typeof window !== "undefined" && writeKey
    ? AnalyticsBrowser.load({ writeKey })
    : undefined;
