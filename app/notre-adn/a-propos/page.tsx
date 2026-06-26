"use client";

import Image from "next/image";
import { useInView } from "@/app/hooks/useInView";
import Chronologie from "@/app/components/Chronologie";

const visionMissionValeurs = [
  {
    title: "Vision",
    description:
      "Devenir le leader régional du recrutement humain et innovant en Afrique, en créant un écosystème où chaque talent trouve sa place et chaque entreprise, son collaborateur idéal.",
    accent: "#00AFA9",
    icon: "vision",
  },
  {
    title: "Valeurs",
    description:
      "L'excellence, l'humanité, l'innovation et l'intégrité sont les piliers qui guident chacune de nos actions et façonnent notre culture d'entreprise au quotidien.",
    accent: "#FFA900",
    icon: "valeurs",
  },
  {
    title: "Mission",
    description:
      "Connecter les talents aux opportunités avec une approche humaine et sur-mesure, en révélant le potentiel unique de chaque individu à travers des événements immersifs et un accompagnement personnalisé.",
    accent: "#00AFA9",
    icon: "mission",
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

function Icon({ type }: { type: string }) {
  switch (type) {
    case "vision":
      return (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case "valeurs":
      return (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "mission":
      return (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function APropos() {
  return (
    <div className="min-h-screen bg-[#0A1A1C]">
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/c8.jpg"
          alt="À propos de Connecteo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-[#00AFA9]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A1C] via-transparent to-black/30" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <Section>
            <span className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#00AFA9] mb-4">
              Notre ADN
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              À propos de nous
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Connecteo est bien plus qu&apos;un cabinet de recrutement — nous sommes un pont entre
              les talents et les opportunités, animés par une vision humaine de l&apos;emploi.
            </p>
          </Section>
        </div>
      </section>

      <Chronologie />

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#00AFA9]/30" />
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Notre ADN
              </span>
              <span className="h-px w-8 bg-[#00AFA9]/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ce qui nous <span className="text-[#00AFA9]">définit</span>
            </h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Vision, valeurs et mission : le triptyque qui guide notre engagement au quotidien.
            </p>
          </Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {visionMissionValeurs.map((item) => (
              <Section key={item.title}>
                <div
                  className="rounded-2xl p-6 md:p-8 h-full border border-white/10 bg-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#00AFA9]/5"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${item.accent}20`, color: item.accent }}
                  >
                    <Icon type={item.icon} />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: item.accent }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Section>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#00AFA9]/30" />
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Chiffres clés
              </span>
              <span className="h-px w-8 bg-[#00AFA9]/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
              Connecteo en <span className="text-[#00AFA9]">chiffres</span>
            </h2>
          </Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "15 000+", label: "Talents accompagnés" },
              { value: "98%", label: "Satisfaction candidats" },
              { value: "200+", label: "Événements / an" },
              { value: "12", label: "Agences" },
            ].map((stat) => (
              <Section key={stat.label}>
                <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5">
                  <span className="block text-3xl md:text-5xl font-bold text-[#00AFA9] mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm text-white/60 uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
