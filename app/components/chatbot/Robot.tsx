/** Le petit robot de Connecteo : uniquement du SVG, animé en CSS (globals.css). */
export default function Robot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 80" className={className} aria-hidden="true">
      <ellipse className="robot-shadow" cx="36" cy="76" rx="17" ry="3" fill="#0B1D20" opacity="0.18" />

      <g className="robot-bob">
        {/* Antenne */}
        <path d="M36 15V7" stroke="#096475" strokeWidth="3" strokeLinecap="round" />
        <circle className="robot-antenna" cx="36" cy="6" r="4" fill="#FFA900" />

        {/* Bras gauche et bras qui salue */}
        <path d="M17 50c-5 1-7 5-7 9" fill="none" stroke="#096475" strokeWidth="5" strokeLinecap="round" />
        <path
          className="robot-wave"
          d="M55 50c5-1 8-5 9-10"
          fill="none"
          stroke="#096475"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Jambes */}
        <path className="robot-leg" d="M28 66v6" stroke="#096475" strokeWidth="6" strokeLinecap="round" />
        <path className="robot-leg robot-leg-alt" d="M44 66v6" stroke="#096475" strokeWidth="6" strokeLinecap="round" />

        {/* Corps */}
        <rect x="17" y="42" width="38" height="26" rx="12" fill="#00AFA9" />
        <circle cx="36" cy="55" r="5" fill="#FFA900" />
        <circle cx="36" cy="55" r="2" fill="#fff" />

        {/* Tête */}
        <rect x="12" y="14" width="48" height="31" rx="15" fill="#00AFA9" />
        <rect x="18" y="20" width="36" height="19" rx="9.5" fill="#0B1D20" />
        <g className="robot-eyes">
          <circle className="robot-eye" cx="28" cy="29" r="3.4" fill="#5CE6E0" />
          <circle className="robot-eye" cx="44" cy="29" r="3.4" fill="#5CE6E0" />
        </g>
        <path d="M32 34.5c2.4 1.8 5.6 1.8 8 0" fill="none" stroke="#5CE6E0" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
