"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

type Offer = {
  slug: string;
  title: string;
  description: string;
};

type Expertise = {
  label: string;
  offers: Offer[];
};

// 👉 Seule la 1re expertise est remplie d'après la maquette.
// Complétez les `offers` des 3 autres (18 offres au total).
const EXPERTISES: Expertise[] = [
  {
    label: "Expérience Client Omnicanale Externalisée",
    offers: [
      {
        slug: "accueil-assistance-client-citoyenne",
        title: "Accueil & Assistance Client / Citoyenne",
        description:
          "Une assistance accessible, réactive et cohérente sur chaque canal.",
      },
      {
        slug: "campagnes-sortantes-engagement",
        title: "Campagnes Sortantes & Engagement Client / Citoyen",
        description:
          "Le bon contact au bon moment pour informer, accompagner et engager.",
      },
      {
        slug: "coordination-routage-omnicanal",
        title: "Coordination & Routage Omnicanal",
        description:
          "Une orchestration fluide pour une expérience cohérente sur tous les canaux.",
      },
      {
        slug: "reclamations-resolution-client",
        title: "Réclamations & Résolution Client",
        description:
          "Transformer chaque demande en résolution et chaque réclamation en opportunité de confiance.",
      },
      {
        // ⚠️ Doublon présent dans la maquette : à remplacer par la vraie offre
        slug: "reclamations-resolution-client",
        title: "Réclamations & Résolution Client",
        description:
          "Transformer chaque demande en résolution et chaque réclamation en opportunité de confiance.",
      },
      {
        slug: "support-dedie-grands-comptes-vip",
        title: "Support Dédié Grands Comptes & VIP",
        description:
          "Un accompagnement premium pour vos clients et partenaires stratégiques.",
      },
      {
        slug: "orchestration-cycle-de-vie-client",
        title: "Orchestration du Cycle de Vie Client",
        description: "Le bon message, au bon moment, sur le bon canal.",
      },
      {
        slug: "engagement-animation-communautes-digitales",
        title: "Engagement & Animation des Communautés Digitales",
        description:
          "Des communautés animées, modérées et engagées au quotidien.",
      },
    ],
  },
  { label: "Back-Office Client & Gestion Administrative", offers: [
          {
        slug: "Facturation & Encaissement",
        title: "Facturation & Encaissement",
        description:
          "Des opérations de facturation et d'encaissement fiables, traçables et fluides.",
      },
      {
        slug: "Devis & Contrats ",
        title: "Devis & Contrats ",
        description:
          "Des documents commerciaux traités avec rapidité, précision et rigueur.",
      },
      {
        slug: "Résiliations & Rétention ",
        title: "Résiliations & Rétention ",
        description:
          "Fluidifier la résiliation tout en identifiant les opportunités de rétention.",
      },
      {
        slug: "Activation de Services",
        title: "Activation de Services",
        description:
          "Une mise en service rapide, conforme et sans friction.",
      },
      {
        // ⚠️ Doublon présent dans la maquette : à remplacer par la vraie offre
        slug: "Certification & Conformité Client ",
        title: "Certification & Conformité Client ",
        description:
          "Des contrôles clients rigoureux, traçables et conformes aux exigences réglementaires.",
      },
  ] },
  { label: "Support Technique & Continuité de Service", offers: [
      {
        slug: "Support Technique à Distance ",
        title: "Support Technique à Distance ",
        description:
          "Un incident, une réponse experte et une résolution structurée.",
      },
      {
        // ⚠️ Doublon présent dans la maquette : à remplacer par la vraie offre
        slug: "Assistance & Accompagnement Client Terrain  ",
        title: "Assistance & Accompagnement Client Terrain ",
        description:
          "Prolonger la relation client au plus près des usages et des territoires.",
      },
  ] },
  { label: "Activation Commerciale & Croissance Client", offers: [
      {
        slug: "Télévente & Développement Commercial ",
        title: "Télévente & Développement Commercial ",
        description:
          "Transformer les opportunités qualifiées en croissance mesurable.",
      },
      {
        slug: "Activation & Reconquête Client",
        title: "Activation & Reconquête Client",
        description:
          " Réactiver les clients dormants et reconquérir les clients perdus.",
      },
      {
        slug: "Rétention & Fidélisation Client ",
        title: "Rétention & Fidélisation Client ",
        description:
          "Préserver la valeur de votre base installée et réduire l'attrition.",
      },
      {
        // ⚠️ Doublon présent dans la maquette : à remplacer par la vraie offre
        slug: "Recouvrement & Créances ",
        title: "Recouvrement & Créances ",
        description:
          "Optimiser le recouvrement tout en préservant la qualité de la relation.",
      },
  ] },
];

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export default function OutsourcingExpertises() {
  const [activeExpertise, setActiveExpertise] = useState(0);
  // Carte mise en avant : la 1re par défaut, puis celle survolée / focalisée
  const [highlighted, setHighlighted] = useState(0);

  const offers = EXPERTISES[activeExpertise].offers;
  // 1 ligne par expertise, davantage si l'expertise active a plus de 8 offres
  const rows = Math.max(EXPERTISES.length, Math.ceil(offers.length / 2));

  const selectExpertise = (i: number) => {
    setActiveExpertise(i);
    setHighlighted(0);
  };

  const renderCard = (o: Offer, i: number) => {
    const isOn = i === highlighted;
    return (
      <Link
        href={`/solutions/outsourcing/${o.slug}`}
        onMouseEnter={() => setHighlighted(i)}
        onFocus={() => setHighlighted(i)}
        className={`group flex h-full min-h-[7.5rem] flex-col justify-between rounded-[1.75rem] p-6 text-xs leading-snug transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f] ${
          isOn ? "bg-[#0a8f92] text-white" : "bg-[#0d7280] text-[#86b6bd]"
        }`}
      >
        <span>
          <span className="block font-bold">{o.title}</span>
          <span className="mt-1 block">{o.description}</span>
        </span>
        <span className="mt-4 text-white">
          <Arrow />
        </span>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-[#0b6171] pt-25 px-6 py-14 font-sans text-white md:px-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold">Outsourcing</h1>
        <p className="mt-5 text-sm leading-relaxed text-white/85">
          18 offres réparties en 4 expertises métiers. Chaque expertise
          constitue un point d&apos;entrée vers ses offres, sans notion de
          package
        </p>
      </header>

      <div className="mx-auto mt-14 max-w-6xl">
        {/* Mobile : les expertises deviennent des onglets */}
        <div className="mb-8 flex flex-wrap gap-2 md:hidden">
          {EXPERTISES.map((e, i) => (
            <button
              key={e.label}
              type="button"
              onClick={() => selectExpertise(i)}
              aria-current={i === activeExpertise ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f5a30f] ${
                i === activeExpertise
                  ? "bg-[#f5a30f] text-[#0b4f5c]"
                  : "bg-white/15 text-white"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        {/* Desktop : 1 ligne = 1 légende centrée + ses 2 cartes */}
        <div className="grid gap-4 md:auto-rows-fr md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] md:gap-x-6 md:gap-y-5">
          {Array.from({ length: rows }).map((_, r) => {
            const expertise = EXPERTISES[r];
            const cardA = offers[r * 2];
            const cardB = offers[r * 2 + 1];
            const isActive = r === activeExpertise;

            return (
              <Fragment key={`row-${r}`}>
                {expertise && (
                  <div className="hidden items-center md:col-start-1 md:flex">
                    <button
                      type="button"
                      onClick={() => selectExpertise(r)}
                      aria-current={isActive ? "true" : undefined}
                      className={`max-w-[16rem] border-l-4 py-1 pl-4 text-left leading-snug transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a30f] ${
                        isActive
                          ? "border-[#f5a30f] text-2xl font-bold text-white lg:text-3xl"
                          : "border-transparent text-base font-semibold text-white/90 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {expertise.label}
                    </button>
                  </div>
                )}

                {offers.length === 0 && r === 0 && (
                  <p
                    key={`empty-${activeExpertise}`}
                    className="flex items-center rounded-[1.75rem] bg-[#0d7280] p-8 text-sm text-white/85 md:col-span-2 md:col-start-2"
                  >
                    Les offres de cette expertise seront bientôt disponibles.
                  </p>
                )}

                {cardA && (
                  <div
                    key={`a-${activeExpertise}-${r}`}
                    className="md:col-start-2 motion-safe:animate-[fade_.4s_ease-out]"
                  >
                    {renderCard(cardA, r * 2)}
                  </div>
                )}
                {cardB && (
                  <div
                    key={`b-${activeExpertise}-${r}`}
                    className="md:col-start-3 motion-safe:animate-[fade_.4s_ease-out]"
                  >
                    {renderCard(cardB, r * 2 + 1)}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </main>
  );
}