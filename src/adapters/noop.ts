import type { AnalyticsAdapter } from "../core/types";

export const noopAdapter: AnalyticsAdapter = {
  name: "noop",
  init() {},
  pageview() {},
  track() {},
  perfMetric() {},
};
