/**
 * Public types — kept stable on purpose. Any provider you ever plug in must
 * fit through this surface; the apps never import provider SDKs directly.
 */

export type AdapterName = "google" | "console" | "noop";

export type EventProps = Record<string, string | number | boolean | null | undefined>;

export interface AdapterConfig {
  /** Logical site (blog, talks, techconf, recall-for-papers, …). Sent with every event. */
  site: string;
  /** Build/runtime tag, e.g. "production" or "preview". */
  environment?: string;
  /** Google Analytics Measurement ID (e.g. G-XXXXXXX). Without it the google adapter sends nothing. */
  measurementId?: string;
}

export interface WebVitalMetric {
  /** Standard names from web-vitals: LCP, INP, CLS, FCP, TTFB. */
  name: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  /** Per-page-load id from web-vitals; useful to dedupe. */
  id: string;
  navigationType?: string;
}

export interface AnalyticsAdapter {
  name: AdapterName;
  init(config: AdapterConfig): void;
  pageview(url: string, props?: EventProps): void;
  track(event: string, props?: EventProps): void;
  perfMetric(metric: WebVitalMetric): void;
}

export interface InitOptions {
  site: string;
  /** Google Analytics Measurement ID (e.g. G-XXXXXXX), required by the google adapter. */
  measurementId?: string;
  /** Single adapter or an array (events fan out to all). */
  adapter?: AdapterName | AdapterName[];
  /** Auto-collect Web Vitals (LCP, INP, CLS, FCP, TTFB). */
  perf?: boolean;
  /** Auto-fire a pageview on init. SPAs may want false and call pageview() manually on route changes. */
  autoPageview?: boolean;
  environment?: string;
  /** When true, swap any chosen adapter for "console" — handy in dev. */
  debug?: boolean;
}
