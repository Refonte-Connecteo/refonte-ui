"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
    title: "Notre histoire",
    subtitle: "",
    description:
      "Création de Connecteo à Antananarivo, au sein du Groupe Axian.",
    accent: "#00AFA9",
  },
  {
    year: 2019,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Création de Connecteo à Antananarivo, au sein du Groupe Axian.",
    accent: "#FFA900",
  },
  {
    year: 2020,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Premier centre de contact multi-clients et déploiement digital.",
    accent: "#00AFA9",
  },
  {
    year: 2021,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Premier centre de contact multi-clients et déploiement digital.",
    accent: "#FFA900",
    stat: "",
    statLabel: "Talents",
  },
  {
    year: 2022,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Ouverture vers d'autres pays africains et lancement des offres spécialisées.",
    accent: "#00AFA9",
    stat: "",
    statLabel: "Événements",
  },
  {
    year: 2023,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Création de Connecteo à Antananarivo, au sein du Groupe Axian.",
    accent: "#FFA900",
  },
  {
    year: 2024,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Création du pôle Consulting et accélération sur la transformation CX.",
    accent: "#00AFA9",
    stat: "",
    statLabel: "Agences",
  },
  {
    year: 2025,
    title: "Notre histoire",
    subtitle: "",
    description:
      "Création du pôle Consulting et accélération sur la transformation CX.",
    accent: "#FFA900",
  },
  {
    year: 2026,
    title: "Notre histoire",
    subtitle: "",
    description:
      "850+ collaborateurs au service d'une expérience client réinventée",
    accent: "#00AFA9",
  },
];

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
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 lg:px-16 overflow-hidden bg-[#096475]">
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeMilestone.accent}15, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="md:px-14 mt-6 md:mt-10">
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
          className="flex items-center w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 pb-2 pt-6 md:pt-10"
        >
          <div className="flex items-center w-full min-w-[38rem] md:min-w-0 gap-2 md:gap-3">
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
                    className="w-full rounded-full transition-all duration-500 ease-out group-hover:-translate-y-0.5"
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
