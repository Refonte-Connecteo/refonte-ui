"use client";

import { useEffect, useRef } from "react";

interface UseIdleTimerOptions {
  timeoutMs: number;
  enabled: boolean;
  onIdle: () => void;
}

const IDLE_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "wheel",
] as const;

export function useIdleTimer({ timeoutMs, enabled, onIdle }: UseIdleTimerOptions): void {
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  });

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: number | undefined;

    const reset = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    for (const event of IDLE_EVENTS) {
      window.addEventListener(event, reset, { passive: true });
    }
    reset();

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      for (const event of IDLE_EVENTS) {
        window.removeEventListener(event, reset);
      }
    };
  }, [timeoutMs, enabled]);
}
