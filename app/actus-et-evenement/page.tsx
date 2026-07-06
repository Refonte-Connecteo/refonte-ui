"use client";

import { useInView } from "@/app/hooks/useInView";

const articles = [
  {
    title: "Guide du Recrutement 2026",
    description:
      "Tendances, outils et bonnes pratiques pour recruter efficacement dans un marché en pleine mutation.",
    tag: "Guide",
  },
  {
    title: "Rapport Annuel 2025",
    description:
      "Bilan d'activité, chiffres clés et perspectives de Connecteo pour l'année à venir.",
    tag: "Rapport",
  },
  {
    title: "Livre Blanc : IA & RH",
    description:
      "Comment l'intelligence artificielle transforme les métiers des ressources humaines.",
    tag: "Livre Blanc",
  },
];

const evenementsAVenir = [
  {
    title: "Job Fair Connecteo 2026",
    date: "15 Septembre 2026",
    lieu: "Antananarivo",
    description:
      "Rencontrez les talents de demain lors de notre grand salon de recrutement. Ateliers, conférences et entretiens sur place.",
  },
  {
    title: "Conférence RH Connect",
    date: "12 Octobre 2026",
    lieu: "En ligne",
    description:
      "Une journée d'échange autour des nouvelles pratiques RH avec des intervenants de renom.",
  },
];

const evenementsPasses = [
  {
    title: "Connecteo Job Day 2025",
    date: "12 Mars 2025",
    lieu: "Antananarivo",
    image: "/images/c3.jpg",
  },
  {
    title: "Africa HR Summit",
    date: "20 Novembre 2025",
    lieu: "Nairobi",
    image: "/images/c4.jpg",
  },
  {
    title: "Forum des Métiers",
    date: "8 Juillet 2025",
    lieu: "Antananarivo",
    image: "/images/c5.jpg",
  },
  {
    title: "Atelier CV & Entretien",
    date: "3 Février 2025",
    lieu: "En ligne",
    image: "/images/c6.jpg",
  },
  {
    title: "Connecteo Tour 2025",
    date: "14 Octobre 2025",
    lieu: "Mahajanga",
    image: "/images/c7.jpg",
  },
  {
    title: "Job Dating Express",
    date: "22 Mai 2025",
    lieu: "Antananarivo",
    image: "/images/c8.jpg",
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
        transform: inView ? "translateY(0)" : "translateY(32px)",
      }}
    >
      {children}
    </div>
  );
}

export default function ActusEvenement() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0B1D20] pt-32 pb-28 md:pt-40 md:pb-36 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FFA900]/[0.03] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFA900]/10 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <Section>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">
              Connecteo
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.04] tracking-tight max-w-3xl mt-5">
              Actus &{" "}
              <span className="text-[#FFA900]">Événements</span>
            </h1>
            <p className="mt-5 text-[15px] md:text-[17px] text-white/40 max-w-lg leading-relaxed">
              Suivez toute l&apos;actualité de Connecteo, découvrez nos rapports exclusifs et revivez nos événements en images.
            </p>
          </Section>
        </div>
      </section>





      {/* Événements à venir */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0B1D20]/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-xl mx-auto mb-16 md:mb-20">
            <Section>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0B1D20]/30">
                  À venir
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1D20] mt-5 leading-tight">
                Nos prochains <span className="text-[#00AFA9]">événements</span>
              </h2>
            </Section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {evenementsAVenir.map((event, idx) => (
              <Section key={event.title}>
                <div
                  className="group relative bg-white border border-[#0B1D20]/5 p-7 md:p-8 transition-all duration-500 hover:border-[#00AFA9]/20 hover:shadow-lg hover:shadow-[#00AFA9]/5"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0B1D20] text-white">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-[#0B1D20]">{event.date}</span>
                      <span className="block text-xs text-[#0B1D20]/35">{event.lieu}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1D20] mb-2 leading-snug group-hover:text-[#00AFA9] transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#0B1D20]/50 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="mt-6 pt-5 border-t border-[#0B1D20]/5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Inscriptions ouvertes
                    </span>
                    <button className="text-xs font-semibold text-[#0B1DTop]/30 group-hover:text-[#FFA900] transition-colors duration-300">
                      En savoir plus →
                    </button>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Événements passés */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0B1D20]/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-xl mx-auto mb-16 md:mb-20">
            <Section>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0B1D20]/30">
                Galerie
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1D20] mt-5 leading-tight">
                Événements <span className="text-[#FFA900]">passés</span>
              </h2>
            </Section>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {evenementsPasses.map((event, idx) => (
              <Section key={event.title}>
                <div
                  className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D20] via-[#0B1D20]/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFA900]/70 mb-1">
                      {event.date}
                    </span>
                    <h3 className="text-white font-semibold text-xs md:text-sm leading-snug">
                      {event.title}
                    </h3>
                    <span className="text-[10px] text-white/30 mt-0.5 block">
                      {event.lieu}
                    </span>
                  </div>
                </div>
              </Section>

              
            ))}
          </div>
        </div>
      </section>

            {/* Vidéo — YouTube */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0B1D20]/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="lg:col-span-1">
              <Section>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0B1D20]/30">
                  Vidéo
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1D20] mt-5 leading-tight">
                  Suivez-nous sur{" "}
                  <span className="text-[#FFA900]">YouTube</span>
                </h2>
                <p className="text-[#0B1D20]/50 text-sm md:text-[15px] mt-4 leading-relaxed max-w-sm">
                  Interviews, reportages, conseils RH et temps forts de nos événements.
                </p>
              </Section>
            </div>

            <div className="lg:col-span-1">
              <Section>
                <a
                  href="https://www.youtube.com/@connecteo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full"
                >
                  <div className="aspect-video bg-[#0B1D20] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFA900]/5 to-transparent" />

                    <div className="relative flex flex-col items-center gap-4">
                      <div className="flex items-center justify-center w-20 h-20 rounded-full border border-white/10 transition-all duration-700 group-hover:border-[#FFA900]/60 group-hover:shadow-[0_0_40px_-8px_rgba(255,169,0,0.3)]">
                        <svg className="h-8 w-8 text-white/40 group-hover:text-[#FFA900] ml-0.5 transition-all duration-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-white/30 text-xs font-medium tracking-widest uppercase">
                        @connecteo
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-xs font-medium text-[#0B1D20]/40 tracking-wide">
                        connecteo
                      </span>
                    </div>
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#0B1D20]/30 group-hover:text-[#FFA900] transition-colors duration-300">
                      Voir la chaîne
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </a>
              </Section>
            </div>
          </div>
        </div>
      </section>

      {/* Articles & Rapports */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden bg-[#0B1D20]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
            <div className="lg:col-span-1 lg:order-last">
              <Section>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/20">
                  Ressources
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-5 leading-tight">
                  Articles &{" "}
                  <span className="text-[#00AFA9]">Rapports</span>
                </h2>
                <p className="text-white/30 text-sm md:text-[15px] mt-4 leading-relaxed max-w-sm">
                  Téléchargez guides, livres blancs et rapports pour rester à la pointe des tendances RH.
                </p>
              </Section>
            </div>

            <div className="lg:col-span-1 space-y-px">
              {articles.map((article, idx) => (
                <Section key={article.title}>
                  <div
                    className="group flex items-center justify-between border-b border-white/[0.04] py-6 md:py-7 transition-all duration-500 hover:border-white/10"
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00AFA9]">
                          {article.tag}
                        </span>
                        <span className="text-white/10">—</span>
                        <span className="text-[10px] text-white/20 font-mono">
                          0{idx + 1}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-base md:text-lg leading-snug group-hover:text-[#00AFA9] transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-white/30 text-xs md:text-sm leading-relaxed mt-1 max-w-lg">
                        {article.description}
                      </p>
                    </div>
                    <div className="shrink-0 ml-6">
                      <button className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white/20 transition-all duration-300 group-hover:border-[#00AFA9] group-hover:text-[#00AFA9] group-hover:bg-[#00AFA9]/5">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Section>
              ))}
              <div className="pt-6">
                <Section>
                  <button className="group inline-flex items-center gap-2 text-xs font-semibold text-white/20 transition-all duration-300 hover:text-[#FFA900]">
                    Toutes les ressources
                    <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Section>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
