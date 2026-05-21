import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { WebVitalMetric } from "../core/types";

type Sink = (m: WebVitalMetric) => void;

let started = false;

/**
 * Registers Web Vitals listeners once per page load. Each metric can fire
 * multiple times (CLS keeps updating); the consumer is expected to dedupe
 * by `metric.id` if it cares.
 */
export function startWebVitals(sink: Sink): void {
  if (started || typeof window === "undefined") return;
  started = true;

  const send = (kind: WebVitalMetric["name"]) => (m: { value: number; id: string; rating: string; navigationType?: string }) => {
    sink({
      name: kind,
      value: m.value,
      rating: (m.rating as WebVitalMetric["rating"]) ?? "good",
      id: m.id,
      navigationType: m.navigationType,
    });
  };

  onLCP(send("LCP"));
  onINP(send("INP"));
  onCLS(send("CLS"));
  onFCP(send("FCP"));
  onTTFB(send("TTFB"));
}
