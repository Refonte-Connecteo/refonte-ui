"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

type SolutionKey = "outsourcing" | "consulting";

type SolutionItem = { label: string; href?: string };

type Solution = {
  key: SolutionKey;
  label: string;
  image: string; // à placer dans /public/images
  idleRotation: string; // inclinaison au repos
  smallRotation: string; // inclinaison quand l'autre carte est ouverte
  items: SolutionItem[];
};

// 👉 Remplacez les offres de Consulting par les vraies
const SOLUTIONS: Solution[] = [
  {
    key: "outsourcing",
    label: "Outsourcing",
    image: "/images/outsourcing.png",
    idleRotation: "-rotate-6",
    smallRotation: "-rotate-12",
    items: [
      { label: "Expérience Client Omnicanale Externalisée", href: "/offer-detail" },
      { label: "Back-Office Client & Gestion Administrative" },
      { label: "Support Technique & Continuité de Service" },
      { label: "Activation Commerciale & Croissance Client" },
    ],
  },
  {
    key: "consulting",
    label: "Consulting",
    image: "/images/consulting.png",
    idleRotation: "rotate-6",
    smallRotation: "rotate-[20deg]",
    items: [
      { label: "Stratégie & Transformation de la Relation Client" },
      { label: "Renforcement des Compétences & Excellence Opérationnelle" },
      { label: "Innovation & Digitalisation de la Relation Client" },
      { label: "Mise à Disposition d'Infrastructure & Espaces de Travail" },
      { label: "Études & Voix du Client (VoC)" },
      { label: "Diagnostic CX 360° & Optimisation des Parcours Client" },
    ],
  },
];

function SolutionCard({
  solution,
  active,
  anyActive,
  onOpen,
  onClose,
}: {
  solution: Solution;
  active: boolean;
  anyActive: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const base =
    "relative overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

  // --- Carte ouverte : image floutée + liste des offres ---
  if (active) {
    return (
      <section
        aria-label={solution.label}
        className={`${base} min-h-[380px] w-full -rotate-1 md:w-[46%] ${styles.animateSlideIn}`}
      >
        <Image
          src={solution.image}
          alt=""
          fill
          sizes="(min-width: 768px) 46vw, 100vw"
          className="scale-110 object-cover blur-xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500" />

        <div className={`relative flex h-full min-h-[380px] flex-col p-6 text-left md:p-10 ${styles.animateFadeIn}`}>
          <div className="flex items-start justify-between">
            <h2 className="text-3xl font-bold text-white tracking-tight md:text-4xl">{solution.label}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={`Fermer ${solution.label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl text-white hover:bg-white/35 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f5a30f]"
            >
              ×
            </button>
          </div>

          <ul className="mt-8 grid flex-1 content-center gap-4 sm:grid-cols-2">
            {solution.items.map((item, index) => {
              const pill = `flex min-h-[64px] w-full items-center rounded-full bg-[#00b0ac] px-6 py-3.5 text-[13px] leading-snug text-white shadow-lg md:text-sm ${styles.animateFadeInUp}`;
              const animation = { animationDelay: `${index * 0.08}s` };

              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`${pill} transition-colors duration-300 hover:bg-[#00c2bd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white`}
                      style={animation}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={pill} style={animation}>
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

  // --- Carte fermée (au repos) ou réduite (l'autre est ouverte) ---
  const size = anyActive
    ? `h-72 w-72 md:h-[380px] md:w-[30%] ${solution.smallRotation}`
    : `h-64 w-96 ${solution.idleRotation}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={false}
      className={`${base} group ${size} hover:scale-[1.03] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#f5a30f] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
    >
      <Image
        src={solution.image}
        alt=""
        fill
        sizes="(min-width: 768px) 384px, 320px"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/35" />
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white drop-shadow transition-transform duration-500 group-hover:scale-105">
        {solution.label}
      </span>
    </button>
  );
}

export default function CxSolutions() {
  const [active, setActive] = useState<SolutionKey | null>(null);

  return (
    <main className="font-sans">
      {/* Section 1 : Nos solutions CX */}
      <section className="bg-[#0b7285] px-6 pb-32 pt-28 text-center text-white">
        <h1 className="text-5xl font-bold tracking-tight">Nos solutions CX</h1>
        <p className="mx-auto mt-6 max-w-lg text-lg font-semibold">
          Deux métiers complémentaires
        </p>
        <p className="mx-auto mt-3 max-w-lg text-base text-white/85 leading-relaxed">
          Que vous cherchiez à opérer votre relation client au quotidien ou à la
          transformer en profondeur, choisissez votre point d&apos;entrée
        </p>

        <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-center gap-14 md:flex-row md:gap-16">
          {SOLUTIONS.map((s) => (
            <SolutionCard
              key={s.key}
              solution={s}
              active={active === s.key}
              anyActive={active !== null}
              onOpen={() => setActive(s.key)}
              onClose={() => setActive(null)}
            />
          ))}
        </div>
      </section>

      {/* Section 2 : Vos enjeux en quelques étapes */}
      <section className="bg-[#cfe0e3] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-14 w-14 text-[#f5a30f]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="5" cy="6" r="2" />
            <circle cx="19" cy="18" r="2" />
            <path d="M7 6h8a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />
          </svg>

          <h2 className="mt-6 text-4xl font-bold text-[#0b6f82] tracking-tight">
            Vos enjeux en quelques étapes
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-slate-700 leading-relaxed">
            Suivez votre client final sur 6 étapes (outsourcing) et votre
            transformation sur 4 étapes (consulting). Chaque étape mobilise les
            bonnes solutions.
          </p>

          <a
            href="#frise"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#f5a30f] px-8 py-4 text-lg font-semibold text-slate-900 transition-all duration-300 hover:bg-[#e09400] hover:shadow-lg hover:shadow-[#f5a30f]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6f82]"
          >
            Explorer la frise interactive
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Section 3 : CTA */}
      <section className="bg-[#0aa9a5] px-6 py-28 text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight">Prêt à construire votre dispositif CX ?</h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-white/90 leading-relaxed">
          Parlons de vos enjeux : nous vous proposons le bon mix de solutions,
          avec un démarrage type en 48h.
        </p>
        <a
          href="#contact"
          className="mt-10 inline-block rounded-full bg-[#f5a30f] px-10 py-4 text-lg font-semibold text-slate-900 transition-all duration-300 hover:bg-[#e09400] hover:shadow-lg hover:shadow-[#f5a30f]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Contactez-nous
        </a>
      </section>
    </main>
  );
}