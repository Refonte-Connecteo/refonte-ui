"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Robot from "./chatbot/Robot";
import { BOT_NAME } from "@/lib/chatbot";

const SECTION_TITLE = "Notre histoire";
/** Durée de l'effet « Téo écrit… » entre deux années. */
const TYPING_MS = 450;

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
      }, TYPING_MS);
    },
    [activeYear, isLeaving]
  );

  const isLast = activeIndex === milestones.length - 1;
  const goNext = () => handleYearSelect(milestones[isLast ? 0 : activeIndex + 1].year);
  const goPrevious = () => activeIndex > 0 && handleYearSelect(milestones[activeIndex - 1].year);

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

          <h2 className="mb-6 text-2xl font-bold text-white md:mb-8 md:text-3xl">
            {SECTION_TITLE}, <span className="text-[#FFA900]">racontée par {BOT_NAME}</span>
          </h2>

          {/* Téo présente chaque année dans une bulle */}
          <div className="mb-8 flex max-w-4xl flex-col items-start gap-3 md:mb-12 md:flex-row md:items-end md:gap-5">
            <Robot limbColor="#7FD6D3" className="robot-still h-20 w-18 shrink-0 md:h-32 md:w-28" />

            <div className="relative w-full rounded-3xl rounded-tl-md bg-white p-5 text-[#0B1D20] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] md:rounded-tl-3xl md:rounded-bl-md md:p-7">
              {/* Pointe de la bulle, vers Téo */}
              <span
                aria-hidden="true"
                className="absolute -top-2 left-7 h-4 w-4 rotate-45 bg-white md:-left-2 md:bottom-7 md:top-auto"
              />

              <div aria-live="polite" className="relative min-h-[7.5rem]">
                {isLeaving ? (
                  <p className="flex h-[7.5rem] items-center gap-1.5" aria-label={`${BOT_NAME} écrit`}>
                    <span className="chat-dot" />
                    <span className="chat-dot" style={{ animationDelay: "150ms" }} />
                    <span className="chat-dot" style={{ animationDelay: "300ms" }} />
                  </p>
                ) : (
                  <div className="menu-item-in">
                    <p
                      className="text-3xl font-bold tracking-tight md:text-4xl"
                      style={{ color: activeMilestone.accent === "#FFA900" ? "#C27C00" : "#00807B" }}
                    >
                      {activeMilestone.year}
                    </p>
                    {activeMilestone.title && activeMilestone.title !== SECTION_TITLE && (
                      <h3 className="mt-1 text-lg font-bold md:text-xl">{activeMilestone.title}</h3>
                    )}
                    <p className="mt-2 text-base leading-relaxed text-[#0B1D20]/75 md:text-lg">
                      {activeMilestone.description}
                    </p>
                    {activeMilestone.stat && (
                      <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-[#096475]">
                        <span className="mr-2 text-2xl font-bold normal-case tracking-normal">{activeMilestone.stat}</span>
                        {activeMilestone.statLabel}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#0B1D20]/10 pt-4">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={activeIndex === 0}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[#096475] transition-colors hover:bg-[#096475]/10 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFA900]"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Précédent
                </button>
                <span className="text-xs font-medium text-[#0B1D20]/45">
                  {activeIndex + 1} / {milestones.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-shine relative inline-flex min-h-11 items-center gap-1.5 overflow-hidden rounded-full bg-[#FFA900] px-4 text-sm font-semibold text-[#0B1D20] transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#096475]"
                >
                  {isLast ? (
                    <>
                      <RotateCcw aria-hidden="true" className="h-4 w-4" />
                      Recommencer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
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
                  aria-current={isActive ? "step" : undefined}
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
