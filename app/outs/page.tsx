"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { OUTSOURCING_EXPERTISES, offerHref } from "@/lib/solutions";
import type { Offer } from "@/lib/solutions";

// Source unique de vérité : les slugs doivent correspondre à ceux résolus
// par /offer/[expertise]/[offer] (cf. lib/solutions.ts), sinon 404.
const EXPERTISES = OUTSOURCING_EXPERTISES;

const TOTAL_OFFERS = EXPERTISES.reduce((n, e) => n + e.offers.length, 0);


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

  useEffect(() => {
    const applyHash = () => {
      const slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!slug) return;
      const index = EXPERTISES.findIndex((e) => e.slug === slug);
      if (index >= 0) {
        setActiveExpertise(index);
        setHighlighted(0);
      }
    };
    applyHash();
    // Un hash d'ancre peut déclencher un scroll natif parasite au chargement.
    window.scrollTo(0, 0);
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

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
        href={offerHref(EXPERTISES[activeExpertise].slug, o.slug)}
        onMouseEnter={() => setHighlighted(i)}
        onFocus={() => setHighlighted(i)}
        className={`group flex h-full min-h-[7.5rem] flex-col justify-between rounded-[1.75rem] p-6 text-xs leading-snug transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f] ${
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
    <main className="min-h-screen bg-[#0b6171] px-6 pb-14 pt-32 font-sans text-white md:px-12 md:pb-20 md:pt-36 lg:px-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="cons-fade text-4xl font-bold">Outsourcing</h1>
        <p className="cons-fade mt-5 text-sm leading-relaxed text-white/85" style={{ animationDelay: "100ms" }}>
          {`${TOTAL_OFFERS} offres réparties en ${EXPERTISES.length} expertises métiers.`}{" "} Chaque expertise constitue un point d&apos;entrée vers ses
          offres, sans notion de package
        </p>
      </header>

      <div className="cons-fade mx-auto mt-10 max-w-6xl md:mt-14" style={{ animationDelay: "200ms" }}>
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