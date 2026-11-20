"use client";

import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/contact";
import { useInView } from "../hooks/useInView";

type Network = (typeof SOCIAL_LINKS)[number]["name"];

// Logos officiels simplifiés (une seule couleur, celle du texte).
const ICONS: Record<Network, string> = {
  Facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

/** Bande « Suivez-nous » affichée sur toutes les pages publiques, juste au-dessus du pied de page. */
export default function SuivezNous() {
  const { ref, inView } = useInView(0.25);

  // Entrée depuis la gauche ou la droite quand la bande arrive à l'écran.
  const slideIn = (fromLeft: boolean) =>
    `transition-all duration-700 ease-out ${
      inView ? "translate-x-0 opacity-100" : `${fromLeft ? "-translate-x-10" : "translate-x-10"} opacity-0`
    }`;

  return (
    <section
      ref={ref}
      aria-labelledby="suivez-nous-title"
      className={`suivez-nous grid w-full md:grid-cols-2 ${inView ? "is-visible" : ""}`}
    >
      {/* Gauche : l'invitation */}
      <div className="relative overflow-hidden bg-[#0D1117] px-6 py-14 md:px-12 md:py-20 lg:px-16">
        {/* <div
          aria-hidden="true"
          className="suivez-halo pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00AFA9] opacity-20 blur-3xl"
        /> */}
        <div className={`relative max-w-md md:ml-auto ${slideIn(true)}`}>
          {/* <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFA900]">Restons connectés</p> */}
          <h2 id="suivez-nous-title" className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            Suivez la vie de Connecteo
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-white/85">
            Nos actualités, nos événements, nos offres d&apos;emploi et nos conseils pour une relation client
            réussie : ne manquez rien.
          </p>
          {/* <Link
            href="/actus"
            className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA900]"
          >
            Voir nos actualités
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link> */}
        </div>
      </div>

      {/* Droite : les réseaux */}
      <div className="relative overflow-hidden bg-[#0D1117] px-6 pt-14 md:px-12 md:pt-20 lg:px-16 xl:pb-20">
        {/* Très grand écran (1280 px et plus) : fond9 en fond, le texte reste lisible grâce au dégradé à gauche */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
          <Image
            src="/images/fond/fond2.jpg"
            alt=""
            fill
            sizes="50vw"
            className={`object-cover object-left transition-transform duration-[1.5s] ease-out ${inView ? "scale-100" : "scale-105"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117] from-25% via-[#0b4f5c]/60 via-50% to-transparent to-75%" />
        </div>
        <div
          aria-hidden="true"
          className="suivez-halo suivez-halo-alt pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full  opacity-15 blur-3xl xl:hidden"
        />
        <div className={`relative max-w-md ${slideIn(false)}`} style={{ transitionDelay: "150ms" }}>
          <p className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            #<span className="suivez-hashtag">CONNECTEO</span>
          </p>
          <p className="mt-3 text-base text-white/85">Rejoignez-nous sur nos réseaux sociaux</p>

          <ul className="mt-8 flex flex-wrap gap-4">
            {SOCIAL_LINKS.map((network, index) => (
              <li key={network.name} className="suivez-tile" style={{ animationDelay: `${300 + index * 120}ms` }}>
                <a
                  href={network.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${network.name} (nouvel onglet)`}
                  className="group flex flex-col items-center gap-2 focus-visible:outline-none"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#0b4f5c] shadow-lg transition-all duration-300 group-hover:-translate-y-1.5 group-hover:bg-[#FFA900] group-hover:shadow-xl group-hover:shadow-[#FFA900]/30 group-focus-visible:ring-4 group-focus-visible:ring-[#FFA900]/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-7 w-7 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                    >
                      <path d={ICONS[network.name]} />
                    </svg>
                  </span>
                  <span className="text-xs font-medium text-white/75 transition-colors group-hover:text-white">
                    {network.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile et tablette : fond9 en bandeau, à sa taille réelle pour rester net */}
        <div aria-hidden="true" className="relative -mx-6 mt-10 aspect-[630/191] md:-mx-12 lg:-mx-16 xl:hidden">
          {/* <Image src="/images/fond/fond2.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /> */}
          {/* <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#0b4f5c] to-transparent" /> */}
        </div>
      </div>
    </section>
  );
}
