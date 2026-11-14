"use client";

import { useState } from "react";
import Image from "next/image";
import { useInView } from "@/app/hooks/useInView";
import Chronologie from "@/app/components/Chronologie";
import CountUp from "@/app/components/CountUp";

// Contenu validé dans « Commentaire Refonte Site Internet V2 », diapositive 4.
type Visual = "afrique" | "axian" | "ia" | "tech";
const singularites: {
  visual: Visual;
  title: string;
  description: string;
  highlight?: { value: string; label: string };
}[] = [
  {
    visual: "afrique",
    highlight: { value: "8", label: "années d'expertise" },
    title: "Au cœur des marchés africains",
    description:
      "Une présence au cœur des marchés africains, renforcée par une expertise offshore sur le marché français, alliant culture locale et standards internationaux.",
  },
  {
    visual: "axian",
    title: "Partenaire privilégié du groupe AXIAN",
    description: "Partenaire privilégié CX et Contact Center pour les filiales d'AXIAN en Afrique.",
  },
  {
    visual: "ia",
    title: "L'humain, augmenté par l'IA",
    description: "Une approche centrée sur l'humain, combinée avec l'IA et la digitalisation.",
  },
  {
    visual: "tech",
    title: "Des partenaires technologiques",
    description:
      "Des partenaires technologiques spécialisés dans l'hébergement des données, l'intégration technique et la customisation de solutions adaptées aux besoins métiers.",
  },
];

/** Puce « IA » dessinée : processeur avec ses broches, aux couleurs de la charte. */
function IaChip() {
  const pins = [22, 28, 36, 42];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-20 w-20 drop-shadow-[0_10px_14px_rgba(9,100,117,0.35)] transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105">
      <defs>
        <linearGradient id="ia-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00AFA9" />
          <stop offset="1" stopColor="#096475" />
        </linearGradient>
      </defs>
      <g stroke="#096475" strokeWidth="2.4" strokeLinecap="round">
        {pins.map((p) => (
          <g key={p}>
            <line x1={p} y1="6" x2={p} y2="14" />
            <line x1={p} y1="50" x2={p} y2="58" />
            <line x1="6" y1={p} x2="14" y2={p} />
            <line x1="50" y1={p} x2="58" y2={p} />
          </g>
        ))}
      </g>
      <rect x="13" y="13" width="38" height="38" rx="8" fill="url(#ia-chip)" />
      <rect x="18.5" y="18.5" width="27" height="27" rx="5" fill="none" stroke="#fff" strokeOpacity="0.4" />
      <text x="32" y="37.6" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="inherit">
        IA
      </text>
      <path d="M50 6l1.6 3.9L55.5 11.5 51.6 13.1 50 17l-1.6-3.9-3.9-1.6 3.9-1.6z" fill="#FFA900" />
    </svg>
  );
}

const visionMissionValeurs = [
  {
    title: "Vision",
    description:
      "Devenir la référence africaine de l'expérience et de la relation client.",
    accent: "#096475",
  },
  {
    title: "Valeurs",
    description:
      "Culture du service · Agilité · Co-construction · Bienveillance.",
    accent: "#096475",
  },
  {
    title: "Mission",
    description:
      "Créer pour chaque marque des parcours mémorables, humains et performants.",
    accent: "#096475",
  },
];

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {children}
    </div>
  );
}

export default function APropos() {
  // Positions en % de la pilule (mesurées sur Figma : pilule 1237 × 476, cercle 382)
  const circles = [
    { rest: { left: -30.9, top: 9.9 }, on: { left: 6.9, top: 9.9 }, center: 22.4 },   // Vision  : vient de la gauche
    { rest: { left: 33.4, top: 105.7 }, on: { left: 33.4, top: 9.9 }, center: 48.9 }, // Valeurs : vient du bas
    { rest: { left: 100.2, top: 9.9 }, on: { left: 62.2, top: 9.9 }, center: 77.7 },  // Mission : vient de la droite
  ];
  const [active, setActive] = useState<number | null>(null); // colonne survolée              // le cercle glisse-t-il ?

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const { ref: singularRef, inView: singularInView } = useInView();

  return (
    <div className="min-h-screen bg-white text-[#0B1D20]">
      <Chronologie />

{/* Section Vision, Valeurs & Mission */}
      <section className="py-12 md:py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <Section>
            <div
              className="relative overflow-hidden bg-[#EFEEED]/70 rounded-[60px] md:rounded-full
                        px-8 py-14 md:p-0 md:aspect-[1237/476] [container-type:inline-size]"
              onMouseLeave={() => setActive(null)}
            >
              {/* Cercles orange : un par colonne, coupés par la pilule (desktop) */}
              {circles.map((c, i) => {
                const pos = active === i ? c.on : c.rest;
                return (
                  <div
                    key={i}
                    aria-hidden
                    className="hidden md:block absolute rounded-full bg-[#FFA900] pointer-events-none"
                    style={{
                      width: "30.9%",
                      aspectRatio: "1 / 1",
                      left: `${pos.left}%`,
                      top: `${pos.top}%`,
                      transition: `left 900ms ${ease}, top 900ms ${ease}`,
                    }}
                  />
                );
              })}

              {/* Colonnes de texte */}
              <div className="relative z-10 grid grid-cols-1 gap-10 md:block md:absolute md:inset-0">
                {visionMissionValeurs.map((item, i) => {
                  return (
                    <div
                      key={item.title}
                      onMouseEnter={() => setActive(i)}
                      className="flex flex-col items-start md:absolute md:top-0 md:h-full md:w-[30.9%]
                                md:items-center md:justify-center md:-translate-x-1/2 md:left-[var(--x)]"
                      style={{ "--x": `${circles[i].center}%` } as React.CSSProperties}
                    >
                      <div className="flex flex-col items-start md:w-[54%]">
                        <h3
                          className="text-3xl text-[#096475] font-light mb-2 tracking-wide md:[font-size:clamp(1.1rem,3.2cqw,2.5rem)]"
                          style={{
                            transition: `color 900ms ${ease}`,
                          }}
                        >
                          {item.title}
                        </h3>
                        <div
                          className="w-16 md:w-[45%] h-[1.5px] mb-6 md:mb-[3cqw]"
                          style={{
                            backgroundColor: "#096475",
                            transition: `background-color 900ms ${ease}`,
                          }}
                        />
                        <p
                          className="text-base text-[#096475] leading-relaxed font-normal break-words md:[font-size:clamp(0.6rem,1.45cqw,0.95rem)]"
                          style={{
                            transition: `color 900ms ${ease}`,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Section Notre singularité (remplace « Nos chiffres clés », affichés sur l'accueil) */}
      <section className="bg-white pb-16 md:pb-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <Section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#096475] tracking-tight">
              Notre singularité
            </h2>
          </Section>

          <div ref={singularRef} className="grid gap-5 md:grid-cols-2">
            {singularites.map((item) => (
              <Section key={item.title}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#096475]/10 bg-white shadow-[0_18px_40px_-30px_rgba(9,100,117,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_48px_-28px_rgba(9,100,117,0.5)]">
                  {/* Carte de l'Afrique en fond */}
                  {item.visual === "afrique" && (
                    <Image
                      src="/images/Afrique.jpg"
                      alt=""
                      width={320}
                      height={350}
                      className="pointer-events-none absolute -right-4 top-1/2 h-[115%] w-auto -translate-y-1/2 opacity-[0.12] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-20"
                    />
                  )}

                  {/* Image technologique au-dessus */}
                  {item.visual === "tech" && (
                    <div className="relative aspect-[3/1] w-full overflow-hidden">
                      <Image
                        src="/images/tech.jpg"
                        alt=""
                        fill
                        sizes="(min-width: 768px) 560px, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className={`relative flex flex-1 flex-col p-6 md:p-8 ${item.visual === "ia" ? "md:justify-center" : ""}`}>
                    {item.visual === "axian" && (
                      <Image
                        src="/images/Axian-logo.png"
                        alt="AXIAN – Let's grow together"
                        width={417}
                        height={160}
                        className="mb-5 h-14 w-auto self-start"
                      />
                    )}
                    {item.visual === "ia" && (
                      <div className="mb-4">
                        <IaChip />
                      </div>
                    )}
                    {item.highlight && (
                      <p className="mb-2 flex items-baseline gap-2 text-[#FFA900]">
                        <span className="text-6xl font-extrabold tabular-nums tracking-tight">
                          <CountUp value={item.highlight.value} start={singularInView} />
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-wide text-[#096475]">
                          {item.highlight.label}
                        </span>
                      </p>
                    )}
                    <h3 className={`text-lg font-bold leading-snug text-[#096475] ${item.visual === "afrique" ? "md:max-w-[75%]" : ""}`}>{item.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed text-[#0B1D20]/75 ${item.visual === "afrique" ? "md:max-w-[75%]" : ""}`}>
                      {item.description}
                    </p>
                  </div>
                </article>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}