import type { ReactNode } from "react";

export interface LegalSection {
  /** Ancre du sommaire (#id). */
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  /** Date affichée « Dernière mise à jour ». */
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

/** Gabarit commun des pages légales : bandeau, sommaire, sections numérotées. */
export default function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <div className="font-sans text-[#1f3337]">
      <header className="bg-[#096475] px-4 pb-14 pt-32 text-white sm:px-8 md:pb-16 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7fe0dc]">
            Informations légales
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-white/70">Dernière mise à jour : {updated}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-8 md:py-16 lg:grid-cols-[14rem_1fr] lg:gap-14">
        <nav aria-label="Sommaire" className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#096475]">
            Sommaire
          </p>
          <ol className="space-y-2 border-l border-[#d5e6e8] text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l-2 border-transparent py-0.5 pl-3 text-[#4b6266] transition-colors hover:border-[#00AFA9] hover:text-[#096475]"
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0 max-w-[70ch] text-[15px] leading-relaxed sm:text-base">
          {intro && <div className="mb-10 space-y-4">{intro}</div>}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="mb-10 scroll-mt-28 last:mb-0">
              <h2 className="mb-4 text-xl font-bold text-[#096475] sm:text-2xl">
                {i + 1}. {s.title}
              </h2>
              <div className="space-y-4 [&_a]:font-medium [&_a]:text-[#00807b] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#096475] [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-[#0B1D20]">
                {s.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}

/** Liste à puces des pages légales. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-6 marker:text-[#00AFA9]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Information encore inconnue, à fournir par Connecteo avant publication. */
export function ToComplete({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[0.9em] font-medium text-amber-900">
      [à compléter : {children}]
    </span>
  );
}
