"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3000";

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  return url;
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<{image: string; title: string; description: string; cta_label: string | null; cta_url: string | null}[]>([]);
  const [stats, setStats] = useState<{value: string; label: string}[]>([]);

  useEffect(() => {
    api.getActiveHeroSlides().then((res) => {
      const mapped = res.slides.map(s => ({
        image: resolveImageUrl(s.image_url),
        title: s.title || "",
        description: s.description || "",
        cta_label: s.cta_label,
        cta_url: s.cta_url,
      }));
      setSlides(mapped.length > 0 ? mapped : [{ image: "/images/c8.jpg", title: "Bienvenue chez Connecteo", description: "Ensemble, connectons les talents aux opportunités de demain.", cta_label: null, cta_url: null }]);
    }).catch(() => {});
    api.getActiveKpiStats().then((res) => {
      const mapped = res.stats.map(s => ({ value: s.value, label: s.label }));
      setStats(mapped.length > 0 ? mapped : [{ value: "15 000+", label: "Talents" }]);
    }).catch(() => {});
  }, []);
  const [scrollY, setScrollY] = useState(0);
  const slide = slides[current] ?? slides[0];

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

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {slides.map((s, index) => (
        <div key={index} className="absolute inset-0">
          <div
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${scrollY * 0.35}px)` }}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1100 ease-in-out ${
                index === current
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
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

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 md:px-12 lg:px-20">
        {slides.map((s, index) => (
          <div
            key={index}
            className={`w-full max-w-2xl transition-all duration-1000 ease-out ${
              index === current
                ? "opacity-100 translate-y-0 relative"
                : "opacity-0 translate-y-10 absolute pointer-events-none"
            }`}
          >
            <h1 className="text-5xl md:text-7xl leading-tight font-bold text-white mb-5 tracking-tight">
              {s.title}
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-white/70 max-w-lg font-light">
              {s.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://my.matterport.com/show/?m=42v2xCu5D9F"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: "#00AFA9", color: "#fff" }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                Visitez notre local
              </a>

              <a
                href="/experience-client"
                className="group inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: "#FFA900", color: "#0B1D20" }}
              >
                Découvrir
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16 w-full max-w-xl">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span
                className="block text-2xl font-bold"
                style={{ color: "#00AFA9" }}
              >
                {stat.value}
              </span>
              <span className="block text-xs text-white/50 mt-1 font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className="group relative flex items-center"
            aria-label={`Aller à la slide ${index + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: index === current ? "2rem" : "0.4rem",
                height: "0.4rem",
                backgroundColor:
                  index === current
                    ? "#00AFA9"
                    : "rgba(255,255,255,0.2)",
              }}
            />
          </button>
        ))}
      </div>

      <div className="absolute bottom-10 right-8 z-20 hidden md:block">
        <span className="text-[11px] font-mono tracking-widest text-white/20">
          {String(current + 1).padStart(2, "0")}
          <span className="mx-1">/</span>
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
