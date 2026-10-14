"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Offer = {
  slug: string;
  title: string;
  description: string;
};

type Expertise = {
  title: string;
  offers: Offer[];
};

const EXPERTISES: Expertise[] = [
  {
    title: "Stratégie & Transformation de la Relation Client",
    offers: [
      {
        slug: "accompagnement-creation-centre-de-contact",
        title: "Accompagnement à la Création d'un Centre de Contact",
        description: "Votre centre de contact, pensé et lancé par des experts.",
      },
      {
        slug: "optimisation-processus-relation-client",
        title: "Optimisation des Processus de Relation Client",
        description: "Des process qui éliminent enfin les irritants.",
      },
    ],
  },
  {
    title: "Renforcement des Compétences & Excellence Opérationnelle",
    offers: [
      {
        slug: "formation-coaching",
        title: "Formation & Coaching",
        description: "Des équipes formées, motivées, qui durent.",
      },
      {
        slug: "audit-evaluation-competences",
        title: "Audit & Évaluation des Compétences",
        description: "Mesurez les savoir-faire, révélez les potentiels.",
      },
    ],
  },
  {
    title: "Qualité, Satisfaction & Fidélisation",
    offers: [
      {
        slug: "pilotage-qualite-satisfaction",
        title: "Pilotage de la Qualité & Satisfaction",
        description: "Des indicateurs qui racontent la vérité du terrain.",
      },
      {
        slug: "programmes-fidelisation-clients",
        title: "Programmes de Fidélisation Client",
        description: "Transformer les clients satisfaits en clients fidèles.",
      },
    ],
  },
  {
    title: "Digitalisation, Outils & Données Clients",
    offers: [
      {
        slug: "integration-parametrage-crm",
        title: "Intégration & Paramétrage CRM",
        description: "Le bon outil, bien configuré, adopté par tous.",
      },
      {
        slug: "analytics-tableaux-de-bord",
        title: "Analytics & Tableaux de Bord",
        description: "Décidez avec des données, plus avec des intuitions.",
      },
    ],
  },
  {
    title: "Management, Pilotage & Performance des Équipes",
    offers: [
      {
        slug: "accompagnement-managers",
        title: "Accompagnement des Managers",
        description: "Des managers assurés, à l'écoute de leurs équipes.",
      },
      {
        slug: "motivation-engagement-equipes",
        title: "Motivation & Engagement des Équipes",
        description: "L'envie de bien faire, au quotidien.",
      },
    ],
  },
];

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export default function ConsultingExpertises() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const last = EXPERTISES.length - 1;

  const go = (i: number) => setActive(Math.min(Math.max(i, 0), last));

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#ffab00] pt-25 py-14 font-sans text-[#0b6477]">
      <header className="mx-auto max-w-2xl px-6 text-center">
        <h1 className="cons-fade text-4xl font-bold">Consulting</h1>
        <p className="cons-fade mt-5 text-sm leading-relaxed" style={{ animationDelay: "100ms" }}>
          10 offres réparties en 5 expertises. Chaque offre constitue un point
          d&apos;entrée autonome vers l&apos;accompagnement associé.
        </p>
      </header>

      {/* Flèches de navigation */}
      <div className="mt-12 flex justify-end gap-3 pr-6 md:pr-[8vw]">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Expertise précédente"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b6477] transition-opacity hover:bg-[#0b6477]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6477] disabled:pointer-events-none disabled:opacity-30"
        >
          <Arrow className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === last}
          aria-label="Expertise suivante"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b6477] transition-opacity hover:bg-[#0b6477]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6477] disabled:pointer-events-none disabled:opacity-30"
        >
          <Arrow className="h-4 w-4" />
        </button>
      </div>

      {/* Carrousel : la carte active occupe 42% de l'écran, centrée */}
      <div
        className="mt-6 [--card-w:42vw] [--gap:1.5rem] md:[--gap:2.5rem]"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        <ul
          className="flex gap-[var(--gap)] pl-[29vw] transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(${-active} * (var(--card-w) + var(--gap))))`,
          }}
        >
          {EXPERTISES.map((e, i) => {
            const isActive = i === active;
            return (
              <li
                key={e.title}
                className={`cons-card relative flex w-[var(--card-w)] shrink-0 flex-col rounded-[2.5rem] p-12 transition-all duration-500 ${
                  isActive
                    ? "z-10 scale-105 bg-white shadow-[0_40px_80px_-32px_rgba(11,100,119,0.7)]"
                    : "scale-[0.97] bg-[#9b9b9b] brightness-95"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {!isActive && (
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Afficher : ${e.title}`}
                    className="absolute inset-0 z-10 rounded-[2.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6477]"
                  />
                )}

                <h2
                  className={`max-w-[36rem] text-3xl font-bold leading-snug transition-colors duration-500 ${
                    isActive ? "text-[#0b6477]" : "text-[#4f7f8a]"
                  }`}
                >
                  {e.title}
                </h2>

                <ul
                  aria-hidden={!isActive}
                  className="mt-10 grid gap-5 sm:grid-cols-2"
                >
                  {e.offers.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/solutions/consulting/${o.slug}`}
                        tabIndex={isActive ? 0 : -1}
                        className="group flex h-full flex-col gap-5 rounded-[1.75rem] bg-[#0b6477] p-8 text-sm leading-relaxed text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0a5565] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffab00]"
                      >
                        <span>
                          <span className="block text-base font-bold">
                            {o.title}
                          </span>
                          <span className="mt-2 block text-sm text-white/90">
                            {o.description}
                          </span>
                        </span>
                        <Arrow className="mt-auto h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
