import type { AdapterConfig, AnalyticsAdapter, WebVitalMetric } from "../core/types";

let cfg: AdapterConfig | null = null;

const tag = (kind: string) => `[chimi-analytics:${cfg?.site ?? "?"}] ${kind}`;

export const consoleAdapter: AnalyticsAdapter = {
  name: "console",
  init(c) { cfg = c; console.info(tag("init"), c); },
  pageview(url, props) { console.info(tag("pageview"), { url, ...props }); },
  track(event, props) { console.info(tag("track"), event, props ?? {}); },
  perfMetric(metric: WebVitalMetric) { console.info(tag("perf"), metric.name, metric.value, metric.rating); },
};
