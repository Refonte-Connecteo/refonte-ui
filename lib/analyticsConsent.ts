/**
 * Mesure d'audience interne (tableau de bord admin) : identifiant de visiteur et refus.
 *
 * Pour rester exemptée de consentement (pas de bandeau), la mesure doit :
 * - utiliser un identifiant qui expire au bout de 13 mois au plus ;
 * - pouvoir être refusée simplement (interrupteur de la page /cookies).
 * Toutes les données restent dans le navigateur ; tout accès au stockage est protégé.
 */

const VID_KEY = "connecteo_vid";
const VID_CREATED_KEY = "connecteo_vid_created";
const OPTOUT_KEY = "connecteo_analytics_optout";
const CHANGE_EVENT = "connecteo:analytics-consent";

/** 13 mois, en millisecondes (395 jours, comme la purge côté API). */
export const VISITOR_ID_MAX_AGE_MS = 395 * 24 * 60 * 60 * 1000;

export function isAnalyticsOptedOut(): boolean {
  try {
    return localStorage.getItem(OPTOUT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Refuse (true) ou réautorise (false) la mesure. Le refus efface l'identifiant. */
export function setAnalyticsOptOut(optOut: boolean): void {
  try {
    if (optOut) {
      localStorage.setItem(OPTOUT_KEY, "1");
      localStorage.removeItem(VID_KEY);
      localStorage.removeItem(VID_CREATED_KEY);
    } else {
      localStorage.removeItem(OPTOUT_KEY);
    }
  } catch {
    // Stockage indisponible : rien à mémoriser.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Abonnement pour useSyncExternalStore (cet onglet et les autres onglets). */
export function subscribeAnalyticsConsent(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Identifiant anonyme du navigateur, renouvelé après 13 mois. */
export function getVisitorId(now: number = Date.now()): string {
  try {
    const existing = localStorage.getItem(VID_KEY);
    const created = Number(localStorage.getItem(VID_CREATED_KEY));
    if (existing && Number.isFinite(created) && created > 0 && now - created < VISITOR_ID_MAX_AGE_MS) {
      return existing;
    }
    if (existing && !created) {
      // Identifiant d'avant cette règle : on le garde, sa durée de vie démarre maintenant.
      localStorage.setItem(VID_CREATED_KEY, String(now));
      return existing;
    }
    const fresh = crypto.randomUUID();
    localStorage.setItem(VID_KEY, fresh);
    localStorage.setItem(VID_CREATED_KEY, String(now));
    return fresh;
  } catch {
    return "unknown";
  }
}
