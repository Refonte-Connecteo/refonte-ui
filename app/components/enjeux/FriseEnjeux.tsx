"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import SolutionModal from "../SolutionModal";
import Reveal from "../Reveal";
import { parcours } from "@/lib/enjeux";

const pad = (n: number) => String(n).padStart(2, "0");

export default function FriseEnjeux() {
  const [parcoursIndex, setParcoursIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [openSolution, setOpenSolution] = useState<string | null>(null);
  const stepsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const current = parcours[parcoursIndex];
  const etapes = current.etapes;
  const etape = etapes[step];
  const last = etapes.length - 1;

  const choosePath = (index: number) => {
    setParcoursIndex(index);
    setStep(0);
  };

  const goTo = (index: number, focus = false) => {
    setStep(index);
    const el = stepsRef.current[index];
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    if (focus) el?.focus();
  };

  // Navigation clavier dans la frise (flèches, Début, Fin).
  const onStepKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next: Record<string, number> = {
      ArrowRight: step === last ? 0 : step + 1,
      ArrowLeft: step === 0 ? last : step - 1,
      Home: 0,
      End: last,
    };
    if (e.key in next) {
      e.preventDefault();
      goTo(next[e.key], true);
    }
  };

  // Largeur de la ligne de progression, d'un centre de pastille à l'autre.
  const progress = last === 0 ? 0 : (step / last) * 100;

  return (
    <>
      {/* En-tête */}
      <section className="bg-[#0b6171] px-6 pb-14 pt-32 text-white md:px-12 md:pb-16 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Nos solutions CX
          </Link>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Vos enjeux, nos solutions CX
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-white/85">
            Deux univers de parcours. Choisissez une étape : chaque solution mobilisée s&apos;ouvre pour vous
            présenter l&apos;offre en détail.
          </p>

          <div
            role="radiogroup"
            aria-label="Choix du parcours"
            className="mt-9 inline-flex max-w-full flex-wrap gap-1.5 rounded-full border border-white/20 bg-[#0b4f5c]/70 p-1.5"
          >
            {parcours.map((p, index) => {
              const selected = index === parcoursIndex;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choosePath(index)}
                  className={`min-h-11 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f] ${
                    selected ? "bg-[#f5a30f] text-[#0b4f5c] shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p.label}
                  <span className={`ml-2 text-xs font-normal ${selected ? "text-[#0b4f5c]/75" : "text-white/55"}`}>
                    {p.etapes.length} étapes
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Frise */}
      <section className="bg-[#cfe0e3] px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b6f82]/80">
              {current.pole} · {current.label}
            </p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">{current.intro}</p>
          </Reveal>

          <div className="-mx-6 mt-10 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0">
            <div
              role="tablist"
              aria-label={`Étapes du ${current.label.toLowerCase()}`}
              className="relative grid min-w-[40rem] md:min-w-0"
              style={{ gridTemplateColumns: `repeat(${etapes.length}, minmax(0, 1fr))` }}
            >
              {/* Ligne de fond et ligne de progression, tracées entre la 1re et la dernière pastille */}
              <div
                aria-hidden="true"
                className="absolute top-6 h-1 rounded-full bg-white/70"
                style={{ left: `${50 / etapes.length}%`, right: `${50 / etapes.length}%` }}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00aeaa] to-[#f5a30f] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {etapes.map((e, index) => {
                const selected = index === step;
                const done = index < step;
                return (
                  <button
                    key={`${current.id}-${e.title}`}
                    ref={(el) => {
                      stepsRef.current[index] = el;
                    }}
                    id={`etape-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="etape-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => goTo(index)}
                    onKeyDown={onStepKeyDown}
                    className="group relative flex flex-col items-center px-2 text-center focus-visible:outline-none"
                  >
                    <span
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 group-focus-visible:ring-4 group-focus-visible:ring-[#0b6f82]/40 ${
                        selected
                          ? "scale-110 border-[#f5a30f] bg-[#f5a30f] text-[#0b4f5c] shadow-lg shadow-[#f5a30f]/40"
                          : done
                            ? "border-[#00aeaa] bg-[#00aeaa] text-white"
                            : "border-white bg-white text-[#0b6f82] group-hover:border-[#00aeaa]"
                      }`}
                    >
                      {pad(index + 1)}
                    </span>
                    <span
                      className={`mt-3 text-sm font-semibold leading-snug transition-colors ${
                        selected ? "text-[#0b4f5c]" : "text-[#0b6f82]/80 group-hover:text-[#0b4f5c]"
                      }`}
                    >
                      {e.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Détail de l'étape */}
          <article
            key={`${current.id}-${step}`}
            id="etape-panel"
            role="tabpanel"
            aria-labelledby={`etape-tab-${step}`}
            className="cons-fade mt-10 grid gap-8 rounded-[2rem] bg-white p-6 shadow-[0_30px_50px_-30px_rgba(11,79,92,0.35)] md:grid-cols-[1fr_1.1fr] md:p-10"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b6f82]/70">
                Étape {pad(step + 1)} / {pad(etapes.length)}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0b6f82] md:text-4xl">{etape.title}</h2>
              <p className="mt-5 flex gap-3 rounded-2xl bg-[#f5a30f]/10 p-4 text-base italic leading-relaxed text-[#0b4f5c]">
                <Quote aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#f5a30f]" />
                {etape.quote}
              </p>
              <p className="mt-5 text-base leading-relaxed text-slate-700">{etape.description}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b6f82]/70">
                Solutions mobilisées
              </p>
              <ul className="mt-4 space-y-3">
                {etape.solutions.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setOpenSolution(name)}
                      aria-haspopup="dialog"
                      className="group flex min-h-14 w-full items-center gap-3 rounded-2xl bg-[#0b6171] px-5 py-3.5 text-left text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b4f5c] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f]"
                    >
                      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#f5a30f]" />
                      <span className="flex-1">{name}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-[#f5a30f] transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 md:col-span-2">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#0b6f82] transition-colors hover:bg-[#cfe0e3] disabled:invisible"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                {step > 0 && etapes[step - 1].title}
              </button>
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                disabled={step === last}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f5a30f] px-5 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-[#e09400] disabled:invisible"
              >
                {step < last && etapes[step + 1].title}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#0aa9a5] px-6 py-16 text-center text-white md:py-20">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight">Un enjeu à une autre étape ?</h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/90">
            Parlons-en : nous vous proposons le bon mix de solutions pour votre parcours.
          </p>
          <Link
            href="/contact"
            className="btn-shine relative mt-8 inline-block overflow-hidden rounded-full bg-[#f5a30f] px-8 py-3.5 text-base font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e09400] hover:shadow-lg hover:shadow-[#f5a30f]/40 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-10 md:py-4 md:text-lg"
          >
            Contactez-nous
          </Link>
        </Reveal>
      </section>

      {openSolution && <SolutionModal name={openSolution} onClose={() => setOpenSolution(null)} />}
    </>
  );
}
