import type { AdapterName, AnalyticsAdapter } from "../core/types";
import { noopAdapter } from "./noop";
import { consoleAdapter } from "./console";
import { googleAdapter } from "./google";

const REGISTRY: Record<AdapterName, AnalyticsAdapter> = {
  noop: noopAdapter,
  console: consoleAdapter,
  google: googleAdapter,
};

export function resolveAdapters(names: AdapterName[]): AnalyticsAdapter[] {
  return names.map((n) => REGISTRY[n] ?? noopAdapter);
}
