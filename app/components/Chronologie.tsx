"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Robot from "./chatbot/Robot";
import { BOT_NAME } from "@/lib/chatbot";

const SECTION_TITLE = "Notre histoire";

/** Flèches Précédent / Suivant : simples icônes, grande zone cliquable. */
const ARROW_CLASS =
  "flex h-16 w-16 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-full text-white/80 transition-all hover:scale-110 hover:text-[#FFA900] disabled:pointer-events-none disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFA900]";
/** Durée de l'effet « Téo écrit… » entre deux années (le temps que le petit Téo marche jusqu'à l'année). */
const TYPING_MS = 700;
/** Vitesse d'écriture du texte, en millisecondes par caractère. */
const CHAR_MS = 22;

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

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Texte écrit lettre par lettre ; le texte complet est lu d'un coup par les lecteurs d'écran. */
function TypedText({ text, onDone }: { text: string; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    let typed = 0;
    const timer = window.setInterval(() => {
      typed = prefersReducedMotion() ? text.length : typed + 1;
      setCount(Math.min(typed, text.length));
      if (typed >= text.length) {
        window.clearInterval(timer);
        doneRef.current();
      }
    }, CHAR_MS);
    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {count < text.length && <span className="story-caret" />}
      </span>
    </>
  );
}

export default function Chronologie() {
  const [activeYear, setActiveYear] = useState(milestones[0].year);
  /** Année vers laquelle le petit Téo marche (avant que le texte ne change). */
  const [targetYear, setTargetYear] = useState(milestones[0].year);
  const [isLeaving, setIsLeaving] = useState(false);
  const [typedYear, setTypedYear] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  const activeMilestone = milestones.find((m) => m.year === activeYear)!;
  const activeIndex = milestones.findIndex((m) => m.year === activeYear);
  const targetIndex = milestones.findIndex((m) => m.year === targetYear);
  const talking = isLeaving || typedYear !== activeYear;

  const handleYearSelect = useCallback(
    (year: number) => {
      if (year === activeYear || isLeaving) return;
      const from = milestones.findIndex((m) => m.year === activeYear);
      const to = milestones.findIndex((m) => m.year === year);
      setFacingLeft(to < from);
      setWalking(!prefersReducedMotion());
      setTargetYear(year);
      setIsLeaving(true);
      window.setTimeout(() => {
        setActiveYear(year);
        setIsLeaving(false);
      }, prefersReducedMotion() ? 0 : TYPING_MS);
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
      container.scrollTo({ left: scrollLeft, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [targetYear]);

  const count = milestones.length;
  const nodeCenter = (i: number) => `${((i + 0.5) / count) * 100}%`;

  return (
    <section
      // Le Téo flottant (en bas à droite) se cache pendant que celui-ci raconte l'histoire.
      data-hide-teo
      className="relative overflow-hidden bg-[#096475] px-6 pb-16 pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-16"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 mt-4 md:mb-10">
          <span className="inline-block rounded-3xl bg-[#FFA900] px-6 py-2 text-lg font-bold text-[#096475]">
            A propos
          </span>
        </div>

        <h2 className="mb-8 text-2xl font-bold text-white md:mb-12 md:text-3xl">{SECTION_TITLE}</h2>

        {/* L'année puis la citation de Téo, alignées à gauche avec le titre et la frise.
            À partir de 1400 px : chevrons de part et d'autre, dans les marges. Sinon : sous le texte. */}
        <div className="relative">
          <button
            type="button"
            onClick={goPrevious}
            disabled={activeIndex === 0}
            aria-label="Année précédente"
            className={`${ARROW_CLASS} min-[1400px]:absolute min-[1400px]:-left-28 min-[1400px]:top-1/2 min-[1400px]:-translate-y-1/2 max-[1399px]:hidden`}
          >
            <ChevronLeft aria-hidden="true" className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.25} />
          </button>

          <p className="text-5xl font-bold tracking-tight text-white md:text-7xl">{targetYear}</p>

          <blockquote aria-live="polite" className="mt-4 min-h-[8rem] md:mt-6 md:min-h-[7.5rem]">
            {isLeaving ? (
              <p className="flex h-12 items-center gap-1.5" aria-label={`${BOT_NAME} écrit`}>
                <span className="chat-dot !bg-white" />
                <span className="chat-dot !bg-white" style={{ animationDelay: "150ms" }} />
                <span className="chat-dot !bg-white" style={{ animationDelay: "300ms" }} />
              </p>
            ) : (
              <p className="menu-item-in relative max-w-4xl text-2xl font-medium leading-snug text-white md:text-4xl md:leading-snug">
                {/* Guillemet « suspendu » dans la marge : le texte reste aligné avec le titre */}
                <span aria-hidden="true" className="absolute left-0 -translate-x-full pr-1 text-[#FFA900]">&ldquo;</span>
                <TypedText key={activeYear} text={activeMilestone.description} onDone={() => setTypedYear(activeYear)} />
              </p>
            )}
          </blockquote>

          <button
            type="button"
            onClick={goNext}
            aria-label={isLast ? "Recommencer l'histoire" : "Année suivante"}
            className={`${ARROW_CLASS} min-[1400px]:absolute min-[1400px]:-right-28 min-[1400px]:top-1/2 min-[1400px]:-translate-y-1/2 max-[1399px]:hidden`}
          >
            {isLast ? (
              <RotateCcw aria-hidden="true" className="h-10 w-10 md:h-14 md:w-14" strokeWidth={1.25} />
            ) : (
              <ChevronRight aria-hidden="true" className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.25} />
            )}
          </button>

          {/* Écrans plus étroits : les deux flèches sous le texte */}
          <div className="-ml-5 mt-4 flex items-center gap-2 md:-ml-7 min-[1400px]:hidden">
            <button type="button" onClick={goPrevious} disabled={activeIndex === 0} aria-label="Année précédente" className={ARROW_CLASS}>
              <ChevronLeft aria-hidden="true" className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.25} />
            </button>
            <button type="button" onClick={goNext} aria-label={isLast ? "Recommencer l'histoire" : "Année suivante"} className={ARROW_CLASS}>
              {isLast ? (
                <RotateCcw aria-hidden="true" className="h-10 w-10 md:h-14 md:w-14" strokeWidth={1.25} />
              ) : (
                <ChevronRight aria-hidden="true" className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.25} />
              )}
            </button>
          </div>
        </div>

        {/* Frise : le petit Téo marche jusqu'à l'année choisie */}
        <div ref={timelineRef} className="scrollbar-hide -mx-2 mt-12 overflow-x-auto px-2 pb-2 md:mt-16">
          <div className="relative min-w-[38rem] pt-16 md:min-w-0">
            <div
              aria-hidden="true"
              className="absolute top-0 z-10 -ml-6 w-12 transition-[left] duration-700 ease-in-out"
              style={{ left: nodeCenter(targetIndex) }}
              onTransitionEnd={(e) => e.target === e.currentTarget && e.propertyName === "left" && setWalking(false)}
            >
              <span className="block transition-transform duration-300" style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}>
                <Robot
                  limbColor="#7FD6D3"
                  className={`h-14 w-12 ${walking ? "" : "robot-still"} ${talking ? "robot-talking" : ""}`}
                />
              </span>
            </div>

            <div className="flex w-full items-center gap-2 md:gap-3">
              {milestones.map((m) => {
                const isActive = m.year === targetYear;
                return (
                  <button
                    key={m.year}
                    ref={isActive ? activeBtnRef : undefined}
                    type="button"
                    onClick={() => handleYearSelect(m.year)}
                    className="group flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFA900]"
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
                        boxShadow: isActive ? `0 0 0 6px ${m.accent}30, 0 4px 16px ${m.accent}30` : "none",
                      }}
                    />
                    <span
                      className="whitespace-nowrap text-xs font-semibold transition-colors duration-500"
                      style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}
                    >
                      {m.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
