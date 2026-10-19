"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

const VID_KEY = "connecteo_vid";

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VID_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    localStorage.setItem(VID_KEY, fresh);
    return fresh;
  } catch {
    return "unknown";
  }
}

/**
 * Beacon analytics du site public — sans cookie ni donnée personnelle.
 * Envoie une vue par page ; ne perturbe jamais la navigation.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    void api.trackPageView(pathname, getVisitorId(), document.referrer || undefined);
  }, [pathname]);

  return null;
}
