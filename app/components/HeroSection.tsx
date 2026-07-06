"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image: "/images/c8.jpg",
    alt: "Événement Connecteo 1",
    title: "Bienvenue chez Connecteo",
    description:
      "Ensemble, connectons les talents aux opportunités de demain.",
    highlight: "+15 000 talents accompagnés en 2025",
    overlay:
      "from-black/80 via-black/50 to-[#00AFA9]/30",
    accent: "#00AFA9",
    tag: "Événement 2025",
  },
  {
    image: "/images/co90.jpg",
    alt: "Événement Connecteo 2",
    title: "Notre mission et nos engagements",
    description:
      "Faciliter la rencontre entre recruteurs et candidats grâce à une expérience immersive et humaine.",
    highlight: "98% de satisfaction candidats",
    overlay:
      "from-black/80 via-black/50 to-[#FFA900]/30",
    accent: "#00AFA9",
    tag: "Recrutement Immersif",
  },
  {
    image: "/images/c6.jpg",
    alt: "Événement Connecteo 3",
    title: "Innovation & Proximité",
    description:
      "Des événements sur mesure pour révéler le potentiel de chaque talent. Nous concevons et organisons des expériences uniques qui mettent en valeur les compétences, la créativité et les ambitions de chacun.",
    highlight: "200+ événements organisés chaque année",
    overlay:
      "from-black/80 via-black/50 to-[#00AFA9]/30",
    accent: "#00AFA9",
    tag: "Sur-Mesure",
  },
];

const stats = [
  { value: "15 000+", label: "Talents" },
  { value: "98%", label: "Satisfaction" },
  { value: "200+", label: "Événements" },
  { value: "12", label: "Agences" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const slide = slides[current];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

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
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {slides.map((s, index) => (
        <div key={index} className="absolute inset-0">
          <div
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${scrollY * 0.35}px)` }}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              className={`object-cover transition-all duration-1100 ease-in-out ${
                index === current
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
              priority={index === 0}
            />
          </div>
          <div
            className={`absolute inset-0 bg-gradient-to-br backdrop-blur-[2px] transition-opacity duration-1100 ${
              s.overlay
            } ${index === current ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-[0.03] blur-3xl"
          style={{ backgroundColor: slide.accent }}
        />
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full opacity-[0.03] blur-3xl"
          style={{ backgroundColor: slide.accent === "#00AFA9" ? "#FFA900" : "#00AFA9" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 md:px-12 lg:px-20">
        {slides.map((s, index) => (
          <div
            key={index}
            className={`w-full max-w-2xl transition-all duration-1000 ease-out ${
              index === current
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 absolute"
            }`}
          >
            <h1 className="text-5xl md:text-7xl leading-tight font-bold text-white mb-5 tracking-tight">
              {s.title}
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-white/70 max-w-lg font-light">
              {s.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span
                className="inline-block w-8 h-px"
                style={{ backgroundColor: slide.accent }}
              />
              <span className="text-sm text-white/60 font-light">
                {s.highlight}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: slide.accent }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110">
                  <svg className="ml-0.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.5 4.5v11l8-5.5-8-5.5z" />
                  </svg>
                </span>
                Visitez notre local
              </a>

              <a
                href="#"
                className="inline-flex items-center gap-2 bg-[#FFA900] rounded-full border border-white/15 px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white hover:bg-white/5"
              >
                Découvrir
              </a>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16 w-full max-w-xl">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span
                className="block text-2xl font-bold"
                style={{ color: slide.accent }}
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
                    ? slide.accent
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
