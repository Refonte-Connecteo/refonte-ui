"use client";

import { useState, useEffect } from "react";
import { useInView } from "@/app/hooks/useInView";
import Chronologie from "@/app/components/Chronologie";
import { api } from "@/lib/api";

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

  const [stats, setStats] = useState<{ value: string; label: string; color: string }[]>([
    { value: "850", label: "Collaborateurs", color: "#FFA900" },
    { value: "+100", label: "Collaborateurs", color: "#FFA900" },
    { value: "10", label: "Collaborateurs", color: "#FFA900" },
    { value: "10", label: "Collaborateurs", color: "#FFA900" },
  ]);

  useEffect(() => {
    api.getActiveKpiStats().then((res) => {
      const mapped = res.stats.map((s) => ({
        value: s.value,
        label: s.label,
        color: "#FFA900",
      }));
      if (mapped.length > 0) setStats(mapped);
    }).catch(() => {});
  }, []);

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
                  const isActive = active === i;
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
                          className="text-md text-[#096475] leading-relaxed font-normal break-words md:[font-size:clamp(0.6rem,1.45cqw,0.95rem)]"
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

      {/* Section Chiffres Clés */}
      <section className="pb-20 md:pb-28 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <Section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#096475] tracking-tight">
              Nos chiffres clés
            </h2>
          </Section>

          <Section>
            <div className="bg-[#E5F3F3] rounded-full px-8 py-10 md:px-16 md:py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center items-center">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center">
                    <span className="block text-4xl md:text-6xl font-extrabold text-[#FFA900] mb-3 tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-[#096475] tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>
    </div>
  );
}