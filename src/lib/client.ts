"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False while the page is being rendered on the server and during hydration,
 * true afterwards. Lets a component render a stable, server-safe fallback and
 * then read browser-only state (storage, the clock, `document`) without an
 * effect that immediately sets state.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Re-renders the caller once a second, with the current time in seconds. */
export function useClockSeconds(): number | null {
  return useSyncExternalStore(subscribeToSeconds, secondsNow, () => null);
}

function subscribeToSeconds(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

function secondsNow() {
  return Math.floor(Date.now() / 1000);
}
