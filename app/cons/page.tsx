"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONSULTING_EXPERTISES, offerHref } from "@/lib/solutions";

// Source unique de vérité : les slugs doivent correspondre à ceux résolus
// par /offer/[expertise]/[offer] (cf. lib/solutions.ts), sinon 404.
const EXPERTISES = CONSULTING_EXPERTISES;

const TOTAL_OFFERS = EXPERTISES.reduce((n, e) => n + e.offers.length, 0);

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

  useEffect(() => {
    const applyHash = () => {
      const slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!slug) return;
      const index = EXPERTISES.findIndex((e) => e.slug === slug);
      if (index >= 0) setActive(index);
    };
    applyHash();
    // Un hash d'ancre peut déclencher un scroll natif vers une carte hors-écran
    // (le carrousel étant masqué en overflow-x). On le neutralise.
    window.scrollTo(0, 0);
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#ffab00] pb-14 pt-32 font-sans text-[#0b6477] md:pb-20 md:pt-36">
      <header className="mx-auto max-w-2xl px-6 text-center">
        <h1 className="cons-fade text-4xl font-bold">Consulting</h1>
        <p className="cons-fade mt-5 text-sm leading-relaxed" style={{ animationDelay: "100ms" }}>
          {`${TOTAL_OFFERS} offres réparties en ${EXPERTISES.length} expertises.`}{" "}
          Chaque offre constitue un point d&apos;entrée autonome vers
          l&apos;accompagnement associé.
        </p>
      </header>

      {/* Flèches de navigation */}
      <div className="mt-8 flex justify-end gap-3 pr-6 md:mt-12 md:pr-[8vw]">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Expertise précédente"
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0b6477] transition-all duration-200 hover:bg-[#0b6477]/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6477] disabled:pointer-events-none disabled:opacity-30"
        >
          <Arrow className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === last}
          aria-label="Expertise suivante"
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0b6477] transition-all duration-200 hover:bg-[#0b6477]/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6477] disabled:pointer-events-none disabled:opacity-30"
        >
          <Arrow className="h-4 w-4" />
        </button>
      </div>

      {/* Carrousel : la carte active est centrée et s'élargit sur les petits écrans */}
      <div
        className="mt-6 [--card-w:86vw] [--gap:1rem] md:[--card-w:74vw] md:[--gap:2.5rem] lg:[--card-w:60vw] xl:[--card-w:42vw]"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        <ul
          className="flex items-start gap-[var(--gap)] pl-[calc((100vw-var(--card-w))/2)] transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(${-active} * (var(--card-w) + var(--gap))))`,
          }}
        >
          {EXPERTISES.map((e, i) => {
            const isActive = i === active;
            return (
              <li
                key={e.label}
                className={`cons-card relative flex w-[var(--card-w)] shrink-0 flex-col rounded-[2rem] p-6 transition-all duration-500 md:rounded-[2.5rem] md:p-10 xl:p-12 ${
                  isActive
                    ? "z-10 bg-white shadow-[0_40px_80px_-32px_rgba(11,100,119,0.7)] md:scale-105"
                    : "scale-[0.97] bg-[#9b9b9b] brightness-95"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {!isActive && (
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Afficher : ${e.label}`}
                    className="absolute inset-0 z-10 rounded-[2.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6477]"
                  />
                )}

                <h2
                  className={`max-w-[36rem] text-2xl font-bold leading-snug transition-colors duration-500 md:text-3xl ${
                    isActive ? "text-[#0b6477]" : "text-[#4f7f8a]"
                  }`}
                >
                  {e.label}
                </h2>

                <ul
                  aria-hidden={!isActive}
                  className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5"
                >
                  {e.offers.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={offerHref(e.slug, o.slug)}
                        tabIndex={isActive ? 0 : -1}
                        className="group flex h-full flex-col gap-5 rounded-[1.75rem] bg-[#0b6477] p-6 text-sm leading-relaxed text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0a5565] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffab00]"
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
