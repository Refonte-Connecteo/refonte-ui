"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useInView } from "@/app/hooks/useInView";

interface Milestone {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  stat?: string;
  statLabel?: string;
}

const milestones: Milestone[] = [
  {
    year: 2018,
    title: "La Naissance",
    subtitle: "Fondation de Connecteo",
    description:
      "Connecteo voit le jour avec une vision claire : révolutionner le recrutement à Madagascar en plaçant l'humain au cœur de chaque démarche. Une équipe passionnée, des valeurs fortes, et l'ambition de connecter les talents aux opportunités.",
    accent: "#00AFA9",
  },
  {
    year: 2019,
    title: "Le Premier Pas",
    subtitle: "Partenariat Stratégique",
    description:
      "Connecteo rejoint le Groupe AXIAN, un tournant stratégique qui ancre notre développement dans un écosystème solide tout en préservant notre agilité et notre indépendance opérationnelle.",
    accent: "#FFA900",
  },
  {
    year: 2020,
    title: "Transformation Digitale",
    subtitle: "Lancement de la Plateforme",
    description:
      "Déploiement de notre plateforme digitale de recrutement, connectant talents et recruteurs de manière innovante. Une avancée majeure qui démocratise l'accès aux opportunités professionnelles.",
    accent: "#00AFA9",
  },
  {
    year: 2021,
    title: "Premier Cap",
    subtitle: "100 Talents Accompagnés",
    description:
      "Notre approche sur-mesure porte ses fruits : 100 talents accompagnés vers leur réussite. Un cap symbolique qui valide notre modèle centré sur l'humain et la qualité du matching.",
    accent: "#FFA900",
    stat: "100+",
    statLabel: "Talents",
  },
  {
    year: 2022,
    title: "Rayonnement",
    subtitle: "200 Événements Organisés",
    description:
      "Plus de 200 événements immersifs qui créent un écosystème unique où recruteurs et candidats se rencontrent authentiquement. Des job dating aux forums, chaque rencontre est une opportunité.",
    accent: "#00AFA9",
    stat: "200+",
    statLabel: "Événements",
  },
  {
    year: 2023,
    title: "Expansion",
    subtitle: "Déploiement Régional",
    description:
      "Ouverture de nouvelles agences et déploiement de nos services à travers la région. Un maillage territorial renforcé pour être au plus près des talents et des entreprises.",
    accent: "#FFA900",
  },
  {
    year: 2024,
    title: "Ancrage",
    subtitle: "12 Agences à Madagascar",
    description:
      "Avec 12 agences, Connecteo devient le réseau de recrutement le plus étendu de Madagascar. Une présence nationale au service de l'emploi et du développement des compétences.",
    accent: "#00AFA9",
    stat: "12",
    statLabel: "Agences",
  },
  {
    year: 2025,
    title: "Innovation",
    subtitle: "Programmes & Impact",
    description:
      "Lancement de programmes de formation innovants et d'initiatives à impact social. Connecteo investit dans la préparation des talents de demain avec une vision engagée et durable.",
    accent: "#FFA900",
  },
  {
    year: 2026,
    title: "Vision 2030",
    subtitle: "Leader Régional",
    description:
      "Connecteo trace sa feuille de route pour 2030 : devenir le leader régional du recrutement humain et innovant en Afrique. Une ambition portée par notre équipe et nos valeurs.",
    accent: "#00AFA9",
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

export default function Chronologie() {
  const [activeYear, setActiveYear] = useState(2018);
  const [isLeaving, setIsLeaving] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  const activeMilestone = milestones.find((m) => m.year === activeYear)!;
  const activeIndex = milestones.findIndex((m) => m.year === activeYear);

  const handleYearSelect = useCallback(
    (year: number) => {
      if (year === activeYear || isLeaving) return;
      setIsLeaving(true);
      setTimeout(() => {
        setActiveYear(year);
        setIsLeaving(false);
      }, 250);
    },
    [activeYear, isLeaving]
  );

  useEffect(() => {
    if (activeBtnRef.current && timelineRef.current) {
      const container = timelineRef.current;
      const btn = activeBtnRef.current;
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const scrollLeft = btn.offsetLeft - containerRect.width / 2 + btnRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeYear]);

  return (
    <section className="relative py-28 md:py-36 px-8 md:px-12 lg:px-16 overflow-hidden bg-[#096475]">
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeMilestone.accent}15, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="px-6 md:px-14 mt-14">
          <div className="mb-10 md:mb-14">
            <span className="inline-block bg-[#FFA900] text-[#096475] text-lg font-bold   px-6 py-2 rounded-3xl">
              A propos
            </span>
          </div>

          <div
            className="mb-8 md:mb-12 max-w-4xl"
          style={{
            opacity: isLeaving ? 0 : 1,
            transform: isLeaving ? "translateY(16px)" : "translateY(0)",
            transition: isLeaving
              ? "all 220ms ease-in"
              : "all 450ms cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          <div className="space-y-3">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-[0.15em] transition-colors duration-500"
              style={{ color: activeMilestone.accent }}
            >
              {activeMilestone.subtitle}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {activeMilestone.title}
            </h3>
          </div>

          <p className="text-white/65 leading-relaxed text-base md:text-lg mt-4">
            {activeMilestone.description}
          </p>

          {activeMilestone.stat && (
            <div className="flex items-center gap-3 pt-4 mt-4">
              <div
                className="h-10 w-px transition-colors duration-500"
                style={{ backgroundColor: `${activeMilestone.accent}50` }}
              />
              <div>
                <span
                  className="text-2xl md:text-3xl font-bold transition-colors duration-500"
                  style={{ color: activeMilestone.accent }}
                >
                  {activeMilestone.stat}
                </span>
                <span className="text-white/50 text-sm ml-2 font-medium uppercase tracking-wider">
                  {activeMilestone.statLabel}
                </span>
              </div>
            </div>
          )}
        </div>
        </div>

        <div
          ref={timelineRef}
          className="flex items-center w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-6 md:pt-10"
        >
          <div className="flex items-center w-full gap-2 md:gap-3">
            {milestones.map((m) => {
              const isActive = m.year === activeYear;
              return (
                <button
                  key={m.year}
                  ref={isActive ? activeBtnRef : undefined}
                  onClick={() => handleYearSelect(m.year)}
                  className="flex flex-col items-center gap-2 group cursor-pointer snap-center flex-1 min-w-0"
                  aria-label={`Aller à l'année ${m.year}`}
                >
                  <div
                    className="w-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      height: isActive ? 24 : 18,
                      backgroundColor: isActive ? m.accent : `${m.accent}25`,
                      borderWidth: isActive ? 0 : 1,
                      borderColor: isActive ? "transparent" : `${m.accent}50`,
                      boxShadow: isActive
                        ? `0 0 0 6px ${m.accent}30, 0 4px 16px ${m.accent}30`
                        : "none",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold transition-all duration-500 whitespace-nowrap"
                    style={{
                      color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {m.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {milestones.map((m, i) => (
            <button
              key={m.year}
              onClick={() => handleYearSelect(m.year)}
              className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                width: i === activeIndex ? 32 : 6,
                backgroundColor:
                  i === activeIndex
                    ? m.accent
                    : i < activeIndex
                    ? `${m.accent}40`
                    : "rgba(255,255,255,0.15)",
              }}
              aria-label={`Aller à l'année ${m.year}`}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-all duration-700"
        style={{
          background: `linear-gradient(90deg, transparent, ${activeMilestone.accent}40, transparent)`,
        }}
      />
    </section>
  );
}
