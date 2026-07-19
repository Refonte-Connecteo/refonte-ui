"use client";

import { useState, useEffect } from "react";
import { useInView } from "@/app/hooks/useInView";
import Chronologie from "@/app/components/Chronologie";
import { api } from "@/lib/api";

const visionMissionValeurs = [
  {
    title: "Vision",
    description:
      "Devenir le leader régional du recrutement humain et innovant en Afrique, en créant un écosystème où chaque talent trouve sa place et chaque entreprise, son collaborateur idéal.",
    accent: "#00AFA9",
  },
  {
    title: "Mission",
    description:
    "Connecter les talents aux opportunités avec une approche humaine et sur-mesure, en révélant le potentiel unique de chaque individu à travers des événements immersifs et un accompagnement personnalisé.",
    accent: "#00AFA9",
  },
  {
    title: "Valeurs",
    description:
      "L'excellence, l'humanité, l'innovation et l'intégrité sont les piliers qui guident chacune de nos actions et façonnent notre culture d'entreprise au quotidien.",
    accent: "#FFA900",
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
        transform: inView ? "translateY(0)" : "translateY(40px)",
      }}
    >
      {children}
    </div>
  );
}

export default function APropos() {
  const [stats, setStats] = useState<{value: string; label: string; color: string}[]>([
    { value: "15 000+", label: "Talents accompagnés", color: "#00AFA9" },
    { value: "98%", label: "Satisfaction candidats", color: "#FFA900" },
    { value: "200+", label: "Événements / an", color: "#00AFA9" },
    { value: "12", label: "Agences", color: "#FFA900" },
  ]);

  useEffect(() => {
    api.getActiveKpiStats().then((res) => {
      const colors = ["#00AFA9", "#FFA900"];
      const mapped = res.stats.map((s, i) => ({
        value: s.value,
        label: s.label,
        color: colors[i % colors.length],
      }));
      if (mapped.length > 0) setStats(mapped);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">

      <Chronologie />

      <section className="relative py-28 md:py-36 px-8 md:px-12 lg:px-16 overflow-hidden">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[45rem] h-[45rem] rounded-full bg-[#096475]/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute -right-20 top-1/3 w-[25rem] h-[25rem] rounded-full bg-[#096475]/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FFA900]/[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <Section className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#00AFA9]/40" />
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#0B1D20]/50">
                Notre ADN
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#00AFA9]/40" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1D20] mb-4 leading-tight">
              Ce qui nous <span className="text-[#00AFA9]">définit</span>
            </h2>
            <p className="text-[#0B1D20]/55 max-w-xl mx-auto text-base md:text-lg">
              Vision,  mission et valeurs  : le triptyque qui guide notre engagement au quotidien.
            </p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {visionMissionValeurs.map((item, idx) => (
              <Section key={item.title}>
                <div
                  className="group relative h-full rounded-2xl transition-all duration-500"
                  style={{
                    backgroundColor: `${item.accent}04`,
                    transitionDelay: `${idx * 80}ms`,
                  }}
                >
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <span
                        className="text-xs font-semibold tracking-[0.15em]"
                        style={{ color: item.accent }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="h-px flex-1"
                        style={{ backgroundColor: `${item.accent}12` }}
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-[#0B1D20] mb-3 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-[#0B1D20]/55 leading-relaxed text-[15px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-36 px-8 md:px-12 lg:px-16 overflow-hidden">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[45rem] h-[45rem] rounded-full bg-[#096475]/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute -right-20 top-1/4 w-[25rem] h-[25rem] rounded-full bg-[#096475]/[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative">
          <Section>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#FFA900]/40" />
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#0B1D20]/50">
                Chiffres clés
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#FFA900]/40" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1D20] mb-4 leading-tight">
              Connecteo en <span className="text-[#00AFA9]">chiffres</span>
            </h2>
            <p className="text-[#0B1D20]/55 max-w-xl mx-auto text-base md:text-lg mb-16 md:mb-20">
              L&apos;impact concret de notre engagement au service des talents et des entreprises.
            </p>
          </Section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {stats.map((stat, idx) => (
              <Section key={stat.label}>
                <div
                  className="relative rounded-2xl p-7 md:p-9 bg-white transition-all duration-700 hover:-translate-y-1"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                    transitionDelay: `${idx * 80}ms`,
                  }}
                >

                  <span className="block text-3xl md:text-5xl font-bold mb-2 tracking-tight" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="text-[13px] text-[#0B1D20]/50 uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
