"use client";

import { useSyncExternalStore } from "react";
import {
  isAnalyticsOptedOut,
  setAnalyticsOptOut,
  subscribeAnalyticsConsent,
} from "@/lib/analyticsConsent";

/** Interrupteur « Mesurer ma visite » (mesure d'audience interne). */
export default function AnalyticsOptOut() {
  const measured = useSyncExternalStore(
    subscribeAnalyticsConsent,
    () => !isAnalyticsOptedOut(),
    () => true,
  );

  return (
    <div className="rounded-2xl border border-[#d5e6e8] bg-[#f3f9f9] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p id="analytics-optout-label" className="font-semibold text-[#0B1D20]">
            Mesure d&apos;audience
          </p>
          <p id="analytics-optout-desc" className="mt-1 text-sm text-[#4b6266]">
            Statistiques de visite anonymes, conservées par Connecteo uniquement.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={measured}
          aria-labelledby="analytics-optout-label"
          aria-describedby="analytics-optout-desc"
          onClick={() => setAnalyticsOptOut(measured)}
          className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#096475] ${
            measured ? "bg-[#00AFA9]" : "bg-[#b9c7c9]"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              measured ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>
      <p className="mt-4 text-sm font-medium text-[#096475]" aria-live="polite">
        {measured
          ? "Activée : vos visites sont comptées dans nos statistiques."
          : "Désactivée : vos visites ne sont plus mesurées sur ce navigateur."}
      </p>
    </div>
  );
}
