"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { getVisitorId, isAnalyticsOptedOut } from "@/lib/analyticsConsent";

/**
 * Beacon analytics du site public — sans cookie ni donnée personnelle.
 * Envoie une vue par page ; ne perturbe jamais la navigation.
 * Rien n'est envoyé si le visiteur a refusé la mesure (page /cookies).
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;
    if (isAnalyticsOptedOut()) return;

    const referrer = document.referrer;
    const isExternal = referrer && !referrer.startsWith(window.location.origin);
    void api.trackPageView(pathname, getVisitorId(), isExternal ? referrer : undefined);
  }, [pathname]);

  return null;
}
