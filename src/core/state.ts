import type { AnalyticsAdapter, InitOptions } from "./types";

/**
 * Module-scoped singleton. analytics is initialised once per page load by the
 * site's base layout; subsequent imports just see the resolved adapters.
 */
interface State {
  adapters: AnalyticsAdapter[];
  options: InitOptions | null;
}

const state: State = { adapters: [], options: null };

export function setState(adapters: AnalyticsAdapter[], options: InitOptions): void {
  state.adapters = adapters;
  state.options = options;
}

export function getAdapters(): AnalyticsAdapter[] {
  return state.adapters;
}

export function getOptions(): InitOptions | null {
  return state.options;
}

export const isBrowser = (): boolean => typeof window !== "undefined";
