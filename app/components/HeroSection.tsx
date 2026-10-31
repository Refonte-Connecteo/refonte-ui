"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3000";
const SLIDE_DURATION_MS = 6000;
const FALLBACK_SLIDES = [
  {
    image: "/images/c8.jpg",
    title: "Bienvenue chez Connecteo",
    description: "Ensemble, connectons les talents aux opportunités de demain.",
    cta_label: null,
    cta_url: null,
  },
];

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  return url;
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<{image: string; title: string; description: string; cta_label: string | null; cta_url: string | null}[]>([]);
  const [zoomStarted, setZoomStarted] = useState(false);

  useEffect(() => {
    api.getActiveHeroSlides().then((res) => {
      const mapped = res.slides.map(s => ({
        image: resolveImageUrl(s.image_url),
        title: s.title || "",
        description: s.description || "",
        cta_label: s.cta_label,
        cta_url: s.cta_url,
      }));
      setSlides(mapped.length > 0 ? mapped : FALLBACK_SLIDES);
    }).catch(() => setSlides(FALLBACK_SLIDES));
  }, []);
  const [scrollY, setScrollY] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const goTo = (index: number) => setCurrent(index);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (slides.length > 0 && (isNaN(current) || current >= slides.length)) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  // Le minuteur repart à chaque slide : la pastille reste synchronisée après un clic.
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setTimeout(next, SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [next, slides.length, current]);

  // Le premier slide doit être peint une fois avant de zoomer, sinon la transition ne part pas.
  useEffect(() => {
    if (slides.length === 0) return;
    const frame = requestAnimationFrame(() => setZoomStarted(true));
    return () => cancelAnimationFrame(frame);
  }, [slides.length]);

  return (
    <section className="relative w-full h-svh min-h-[34rem] overflow-hidden bg-black">
      {slides.map((s, index) => (
        <div key={index} className="absolute inset-0">
          <div
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${scrollY * 0.35}px)` }}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`hero-image absolute inset-0 w-full h-full object-cover ${
                index === current ? "opacity-100" : "opacity-0"
              } ${index === current && zoomStarted ? "scale-[1.07]" : "scale-100"}`}
              style={{ transition: `opacity 1100ms ease-in-out, scale ${SLIDE_DURATION_MS + 1500}ms linear` }}
            />
          </div>
          <div
            className={`absolute inset-0 bg-gradient-to-br backdrop-blur-[2px] transition-opacity duration-1100 from-black/80 via-black/50 to-[#00AFA9]/30 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-[0.03] blur-3xl"
          style={{ backgroundColor: "#00AFA9" }}
        />
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full opacity-[0.03] blur-3xl"
          style={{ backgroundColor: "#FFA900" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 pt-24 pb-8 md:px-12 lg:px-20">
        <div className="grid w-full">
          {slides.map((s, index) => {
            const isCurrent = index === current;
            return (
              <div
                key={index}
                className={`col-start-1 row-start-1 w-full transition-opacity duration-700 ease-out ${
                  isCurrent ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="max-w-2xl">
                  <h1
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold text-white mb-4 sm:mb-5 tracking-tight transition-all duration-1000 ease-out ${
                      isCurrent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                  >
                    {s.title}
                  </h1>

                  <p
                    className={`text-sm sm:text-base md:text-lg leading-relaxed text-white/70 max-w-lg font-light transition-all duration-1000 ease-out ${
                      isCurrent ? "translate-y-0 opacity-100 delay-200" : "translate-y-8 opacity-0"
                    }`}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-4 sm:mt-10">
          <a
            href="https://my.matterport.com/show/?m=42v2xCu5D9F"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine group relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:gap-3 sm:px-7 sm:py-3 sm:text-sm"
            style={{ backgroundColor: "#FFA900", color: "#0B1D20" }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7">
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </span>
            Visitez notre local
          </a>

          <div className="ml-auto flex items-center">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goTo(dotIndex)}
                className="group relative flex h-11 min-w-11 items-center justify-center px-1"
                aria-label={`Aller à la slide ${dotIndex + 1}`}
                aria-current={dotIndex === current}
              >
                <span
                  className={`relative block overflow-hidden rounded-full transition-all duration-500 ${
                    dotIndex === current
                      ? "h-3 w-7 sm:h-3.5 sm:w-9"
                      : "h-2.5 w-4 group-hover:scale-110 sm:h-3 sm:w-5"
                  }`}
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                  {dotIndex === current && (
                    <span
                      key={current}
                      className={`absolute inset-0 rounded-full bg-[#00AFA9] ${slides.length > 1 ? "hero-progress" : ""}`}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
