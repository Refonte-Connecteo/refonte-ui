"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Factory,
  HandHeart,
  HeartPulse,
  Landmark,
  ShoppingCart,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "../hooks/useInView";
import SolutionModal from "./SolutionModal";
import { secteurs, type Secteur } from "@/lib/secteurs";

const VISUALS: Record<string, { image: string; icon: LucideIcon }> = {
  telecoms: { image: "/images/c3.jpg", icon: Wifi },
  banque: { image: "/images/c4.jpg", icon: Landmark },
  energie: { image: "/images/c5.jpg", icon: Zap },
  distribution: { image: "/images/c6.jpg", icon: ShoppingCart },
  industrie: { image: "/images/c7.jpg", icon: Factory },
  public: { image: "/images/c8.jpg", icon: Building2 },
  ong: { image: "/images/c9.jpg", icon: HandHeart },
  sante: { image: "/images/c10.jpg", icon: HeartPulse },
};

const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.2em]";

function CardContent({ s, isActive }: { s: Secteur; isActive: boolean }) {
  const { image } = VISUALS[s.id];
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white transition-all duration-500"
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: isActive ? "rgba(255, 169, 0, 0.5)" : "rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? "0 8px 50px rgba(255, 169, 0, 0.2), 0 0 80px rgba(0, 175, 169, 0.08)"
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="300px"
          className="object-cover transition-all duration-700 ease-out"
          style={{
            scale: isActive ? "1" : "1.05",
            filter: isActive ? "none" : "grayscale(0.7) brightness(0.4) blur(3px)",
          }}
        />
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        )}
        {/* <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFA900] text-[#0B1D20] shadow-lg">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span> */}
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
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-0.5 shrink-0 rounded-full bg-gradient-to-r from-[#FFA900] to-[#00AFA9]" />
            <h3 className="text-lg font-bold leading-snug text-[#0B1D20]">{s.name}</h3>
          </div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#008b87]">
            {s.tagline}
          </p>
          <p className="text-sm text-[#0B1D20]/65 leading-relaxed">{s.title}</p>
        </div>
      </div>
    </div>
  );
}

function SecteurDetail({ s }: { s: Secteur }) {
  const { kpis } = s.caseStudy;
  const [openSolution, setOpenSolution] = useState<string | null>(null);
  return (
    <div className="cons-fade mt-12 grid gap-5 lg:grid-cols-2 xl:mt-16" aria-live="polite">
      {/* Enjeux et sous-secteurs */}
      <div className="rounded-[1.75rem] border border-white/20 bg-[#0b4f5c]/70 p-6 shadow-xl md:p-8">
        <p className={`${eyebrow} text-[#FFA900]/80`}>{s.name}</p>
        <h3 className="mt-3 text-xl font-bold leading-snug text-white md:text-2xl">{s.challengeTitle}</h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-white/80">{s.intro}</p>
        <p className="mt-3 text-sm font-light leading-relaxed text-white/80">{s.challenge}</p>

        <p className={`${eyebrow} mt-7 text-white/65`}>Sous-secteurs</p>
        <ul className="mt-4 space-y-4">
          {s.subSectors.map((sub) => (
            <li key={sub.name}>
              <p className="text-sm font-semibold text-white">{sub.name}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sub.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-[#c8eeec]">
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Solutions mobilisées */}
      <div className="rounded-[1.75rem] border border-white/20 bg-[#0b4f5c]/70 p-6 shadow-xl md:p-8">
        <p className={`${eyebrow} text-white/65`}>Solutions mobilisées</p>
        <ul className="mt-4 space-y-3">
          {s.solutions.map((sol) => (
            <li key={sol.name}>
              <button
                type="button"
                onClick={() => setOpenSolution(sol.name)}
                aria-haspopup="dialog"
                className="group flex w-full gap-3 rounded-2xl border border-white/15 p-4 text-left transition-colors hover:border-[#FFA900]/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA900]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFA900]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">{sol.name}</span>
                  <span className="mt-1 block text-xs font-light leading-relaxed text-white/75">{sol.description}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#FFA900] transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {openSolution && (
        <SolutionModal name={openSolution} onClose={() => setOpenSolution(null)} />
      )}

      {/* Cas concret */}
      <div className="rounded-[1.75rem] border border-[#FFA900]/40 bg-[#0b4f5c]/70 p-6 shadow-xl md:p-8 lg:col-span-2">
        <p className={`${eyebrow} text-[#FFA900]`}>Cas concret</p>
        <h3 className="mt-3 text-xl font-bold leading-snug text-white">{s.caseStudy.title}</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-white">Le défi</p>
            <p className="mt-1 text-sm font-light leading-relaxed text-white/80">{s.caseStudy.defi}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Notre approche</p>
            <p className="mt-1 text-sm font-light leading-relaxed text-white/80">{s.caseStudy.approche}</p>
          </div>
        </div>
        {kpis.length > 0 && (
          <dl className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="flex flex-col-reverse rounded-2xl border border-white/10 bg-white/10 p-4">
                <dt className="mt-1 text-xs leading-snug text-white/80">{kpi.label}</dt>
                <dd className="text-2xl font-bold text-[#FFA900]">{kpi.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

export default function SecteursActivite() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView();

  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => setActive(index);

  const handleSwipeEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 50) return;
    const step = distance < 0 ? 1 : -1;
    setActive((current) => (current + step + secteurs.length) % secteurs.length);
  };

  return (
    <section
      ref={ref}
      id="secteurs-activite"
      className="relative w-full bg-[#0b6171] pb-16 pt-28 md:pb-24 md:pt-32 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl"
          style={{ backgroundColor: "#FFA900" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.06] blur-3xl"
          style={{ backgroundColor: "#00AFA9" }}
        />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full opacity-[0.04] blur-3xl bg-[#FFA900]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-5">
        <div className="flex flex-col xl:flex-row xl:items-center gap-10 xl:gap-20">
          <div
            className="xl:w-2/5 shrink-0 transition-all duration-1000 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(40px)",
            }}
          >
            {/* <span className="inline-block text-sm font-semibold uppercase tracking-[0.15em] text-[#FFA900]/80 mb-4">
              Notre Expertise
            </span> */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-white mb-5 tracking-tight">
              Nos Secteurs<br />d&apos;Activité
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-white/80 max-w-md font-light">
              Enjeux, sous-secteurs, cas concrets et solutions CX mobilisées : passez du contexte de
              votre métier à l&apos;offre qui y répond.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="inline-block w-10 h-0.5 bg-gradient-to-r from-[#FFA900] to-[#00AFA9]" />
              <span className="text-sm text-white/65 font-light tracking-wide">
                {secteurs.length} secteurs d&apos;activité
              </span>
            </div>
          </div>

          {/* Mobile */}
          <div
            className="block xl:hidden w-full"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX)}
          >
            <div key={active} className="cons-fade w-full max-w-sm mx-auto">
              <CardContent s={secteurs[active]} isActive />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden xl:block flex-1 relative" style={{ height: "520px" }}>
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

                const arcRadius = 320;
                const translateX = sinA * arcRadius;
                const translateY = -(1 - Math.abs(cosA)) * 50;
                const scale = 0.45 + 0.55 * cosA;
                const opacity = Math.max(0, 0.1 + 0.9 * cosA);
                const zIdx = Math.round(50 + cosA * 50);

                const isActive = index === active;

                return (
                  <div
                    key={s.id}
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

        <div className="flex flex-wrap items-center justify-center mt-6 xl:mt-10">
          {secteurs.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(index)}
              className="group relative flex h-11 min-w-8 items-center justify-center px-1.5"
              aria-label={`Afficher le secteur ${s.name}`}
              aria-current={index === active ? "true" : undefined}
            >
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width: index === active ? "2rem" : "0.4rem",
                  height: "0.4rem",
                  backgroundColor: index === active ? "#FFA900" : "rgba(255,255,255,0.3)",
                }}
              />
            </button>
          ))}
        </div>

        <SecteurDetail key={secteurs[active].id} s={secteurs[active]} />
      </div>
    </section>
  );
}
