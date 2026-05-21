/**
 * @chimi/analytics — adapter-based analytics + web vitals client.
 *
 * Usage (in a site's base layout):
 *
 *   import { initAnalytics } from "@chimi/analytics";
 *   initAnalytics({ site: "blog", adapter: "google", perf: true });
 *
 * Usage (in any client component):
 *
 *   import { track } from "@chimi/analytics";
 *   track("rfp_chip_click", { style: "humorous" });
 */
import type { AdapterName, EventProps, InitOptions } from "./core/types";
import { getAdapters, getOptions, isBrowser, setState } from "./core/state";
import { resolveAdapters } from "./adapters";
import { startWebVitals } from "./perf/webVitals";

export type { EventProps, InitOptions, WebVitalMetric, AnalyticsAdapter, AdapterName } from "./core/types";

export function initAnalytics(opts: InitOptions): void {
  const wantedNames: AdapterName[] = opts.debug
    ? ["console"]
    : Array.isArray(opts.adapter)
      ? opts.adapter
      : opts.adapter
        ? [opts.adapter]
        : ["noop"];

  const adapters = resolveAdapters(wantedNames);
  for (const a of adapters) {
    try { a.init({ site: opts.site, environment: opts.environment }); }
    catch (e) { console.warn(`[chimi-analytics] adapter ${a.name} failed to init`, e); }
  }
  setState(adapters, opts);

  if (opts.autoPageview !== false && isBrowser()) {
    pageview();
  }
  if (opts.perf && isBrowser()) {
    startWebVitals((m) => {
      for (const a of getAdapters()) {
        try { a.perfMetric(m); } catch (e) { console.warn(`[chimi-analytics] perf failed (${a.name})`, e); }
      }
    });
  }
}

export function pageview(url?: string, props?: EventProps): void {
  if (!isBrowser()) return;
  const resolved = url ?? window.location.pathname + window.location.search;
  for (const a of getAdapters()) {
    try { a.pageview(resolved, props); } catch (e) { console.warn(`[chimi-analytics] pageview failed (${a.name})`, e); }
  }
}

export function track(event: string, props?: EventProps): void {
  if (!isBrowser()) return;
  for (const a of getAdapters()) {
    try { a.track(event, props); } catch (e) { console.warn(`[chimi-analytics] track failed (${a.name})`, e); }
  }
}

/** Escape hatch for advanced consumers (debugging, custom integrations). */
export function _internal() {
  return { adapters: getAdapters(), options: getOptions() };
}
