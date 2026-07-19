"use client";

import Link from "next/link";
import { useInView } from "../hooks/useInView";

export default function CtaSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative w-full bg-[#096475] py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl bg-[#FFA900]" />
        <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-3xl bg-[#00AFA9]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl bg-gradient-to-br from-[#FFA900] to-[#00AFA9]" />
      </div>

      <div
        className="relative z-10 mx-auto max-w-4xl px-6 md:px-10 text-center transition-all duration-1000 ease-out"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(50px)",
        }}
      >
        <span className="inline-block text-sm font-semibold uppercase tracking-[0.15em] text-[#FFA900]/80 mb-6">
          Travaillons Ensemble
        </span>

        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold text-white tracking-tight">
          Construisons votre prochaine<br />
          <span className="bg-gradient-to-r from-[#FFA900] to-[#00AFA9] bg-clip-text text-transparent">
            expérience ensemble.
          </span>
        </h2>

        <p className="mt-6 text-base md:text-lg lg:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
          Parlons de vos enjeux. Notre équipe revient vers vous sous 48h.
        </p>

        <div className="mt-10 md:mt-12 flex items-center justify-center gap-6">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FFA900] to-[#FFA900] hover:from-[#00AFA9] hover:to-[#00AFA9] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-gray-900 hover:text-white transition-all duration-500 hover:shadow-2xl hover:shadow-[#00AFA9]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:scale-110">
              <svg
                className="ml-0.5 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
            Contactez-nous
          </Link>

          <Link
            href="/notre-adn/a-propos"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-all duration-300"
          >
            <span className="w-0 group-hover:w-6 h-px bg-[#FFA900] transition-all duration-300" />
            En savoir plus
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
