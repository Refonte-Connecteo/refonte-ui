"use client";

import Image from "next/image";
import { useState } from "react";
import { useInView } from "../hooks/useInView";

const secteurs = [
  {
    image: "/images/c3.jpg",
    title: "Recrutement & Sélection",
    description:
      "Nous identifions et recrutons les meilleurs talents pour votre entreprise, avec une approche personnalisée et rigoureuse.",
  },
  {
    image: "/images/c4.jpg",
    title: "Intérim & CDD",
    description:
      "Des solutions flexibles pour répondre à vos besoins de personnel temporaire, avec un suivi de proximité.",
  },
  {
    image: "/images/c5.jpg",
    title: "Formation & Conseil",
    description:
      "Accompagnement sur-mesure pour développer les compétences de vos équipes et optimiser vos processus RH.",
  },
  {
    image: "/images/c6.jpg",
    title: "Évaluation des Talents",
    description:
      "Des outils d'évaluation innovants pour révéler le potentiel de chaque candidat et collaborateur.",
  },
  {
    image: "/images/c7.jpg",
    title: "Outsourcing RH",
    description:
      "Externalisez vos processus RH en toute confiance grâce à notre expertise et notre réactivité.",
  },
];

export default function SecteursActivite() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView();

  const goTo = (index: number) => setActive(index);

  const CardContent = ({ s, isActive }: { s: typeof secteurs[number]; isActive: boolean }) => (
    <div
      className="rounded-2xl overflow-hidden bg-white transition-all duration-500"
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: isActive
          ? "rgba(0, 175, 169, 0.6)"
          : "rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? "0 8px 50px rgba(0, 175, 169, 0.25)"
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={s.image}
          alt={s.title}
          fill
          className="object-cover transition-all duration-700 ease-out"
          style={{
            scale: isActive ? "1" : "1.05",
            filter: isActive
              ? "none"
              : "grayscale(0.7) brightness(0.4) blur(3px)",
          }}
        />
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        )}
      </div>

      <div className="relative">
        <div
          className="absolute -top-3 left-0 right-0 h-6"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.95) 60%, transparent)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
        <div className="p-6 pt-8">
          <h3 className="text-lg font-semibold text-[#0B1D20] mb-2">
            {s.title}
          </h3>
          <p className="text-sm text-[#0B1D20]/60 leading-relaxed">
            {s.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={ref} className="relative w-full bg-[#0B1D20] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl"
          style={{ backgroundColor: "#00AFA9" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.06] blur-3xl"
          style={{ backgroundColor: "#FFA900" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
          <div
            className="lg:w-2/5 shrink-0 transition-all duration-1000 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-white mb-5 tracking-tight">
              Nos Secteurs<br />d&apos;Activité
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-md font-light">
              De la stratégie de recrutement à l&apos;intégration, nous intervenons
              sur l&apos;ensemble de la chaîne de valeur RH pour accompagner votre
              croissance.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="inline-block w-8 h-px"
                style={{ backgroundColor: "#FFA900" }}
              />
              <span className="text-sm text-white/40 font-light">
                {secteurs.length} domaines d&apos;expertise
              </span>
            </div>
          </div>

          {/* Mobile */}
          <div className="block lg:hidden w-full">
            <div className="w-full max-w-sm mx-auto">
              <CardContent s={secteurs[active]} isActive />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block flex-1 relative" style={{ height: "560px" }}>
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ perspective: "1200px" }}
            >
              {secteurs.map((s, index) => {
                const total = secteurs.length;
                let offset = index - active;
                if (offset > Math.floor(total / 2)) offset -= total;
                if (offset < -Math.floor(total / 2)) offset += total;

                const maxOffset = Math.floor(total / 2);
                const spreadAngle = Math.PI / 2.4;
                const angle = (offset / maxOffset) * spreadAngle;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);

                const arcRadius = 380;
                const translateX = sinA * arcRadius;
                const translateY = -(1 - Math.abs(cosA)) * 50;
                const scale = 0.45 + 0.55 * cosA;
                const opacity = Math.max(0, 0.1 + 0.9 * cosA);
                const zIdx = Math.round(50 + cosA * 50);

                const isActive = index === active;

                return (
                  <div
                    key={index}
                    onClick={() => goTo(index)}
                    className="absolute cursor-pointer transition-all duration-700 ease-out select-none"
                    style={{
                      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                      opacity,
                      zIndex: zIdx,
                      width: "300px",
                    }}
                  >
                    <CardContent s={s} isActive={isActive} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-10">
          {secteurs.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className="group relative flex items-center"
              aria-label={`Aller au secteur ${index + 1}`}
            >
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width: index === active ? "2rem" : "0.4rem",
                  height: "0.4rem",
                  backgroundColor:
                    index === active
                      ? "#00AFA9"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
