/** Nom du champ piège, identique côté API (HONEYPOT_FIELD). */
export const HONEYPOT_FIELD = "website";

/**
 * Champ piège anti-robots : invisible et hors de la navigation au clavier, ignoré par les
 * lecteurs d'écran. Un humain le laisse vide ; un robot qui remplit tous les champs le remplit,
 * et l'API ignore alors l'envoi en silence.
 */
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label htmlFor="hp-website">Ne pas remplir ce champ</label>
      <input id="hp-website" name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
