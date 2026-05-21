import type { AdapterConfig, AnalyticsAdapter, EventProps, WebVitalMetric } from "../core/types";

let cfg: AdapterConfig | null = null;
let injected = false;

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Google Analytics (GA4) adapter.
 *
 * Injects the gtag snippet and translates our provider-agnostic events into
 * GA4 format.
 */
export const googleAdapter: AnalyticsAdapter = {
  name: "google",
  init(c) {
    cfg = c;
    if (typeof window === "undefined" || injected) return;

    // Use provided measurementId or fallback to an env var (which consumers might provide)
    const measurementId = c.measurementId || (typeof process !== "undefined" && process.env?.PUBLIC_GA_ID) || "G-PLACEHOLDER";
    if (!measurementId || measurementId === "G-PLACEHOLDER") {
      console.warn("[chimi-analytics] Google Analytics adapter initialized without a valid measurementId.");
    }

    // Inject the main gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false, // We handle page views manually for SPAs
    });

    injected = true;
  },
  pageview(url, props) {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_location: url,
      ...withSite(props),
    });
  },
  track(event, props) {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", event, withSite(props));
  },
  perfMetric(metric: WebVitalMetric) {
    if (typeof window === "undefined" || !window.gtag) return;
    // We send performance metrics as custom events to GA4
    window.gtag("event", `web_vital_${metric.name.toLowerCase()}`, {
      ...withSite(),
      value: metric.value,
      rating: metric.rating,
    });
  },
};

function withSite(props?: EventProps): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = { site: cfg?.site ?? "unknown" };
  if (cfg?.environment) out.environment = cfg.environment;
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined) continue;
      out[k] = v;
    }
  }
  return out;
}
