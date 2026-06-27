"use client";

import Image from "next/image";
import { useInView } from "../hooks/useInView";

const partenaires = [
  { src: "/images/partenaire1.png", alt: "Partenaire 1" },
  { src: "/images/partenaire2.png", alt: "Partenaire 2" },
  { src: "/images/partenaire3.png", alt: "Partenaire 3" },
  { src: "/images/partenaire4.png", alt: "Partenaire 4" },
  { src: "/images/partenaire5.png", alt: "Partenaire 5" },
  { src: "/images/partenaire7.png", alt: "Partenaire 7" },
  { src: "/images/partenaire8.jpg", alt: "Partenaire 8" },
  { src: "/images/partenaire10.jpg", alt: "Partenaire 10" },
];

export default function NosReferences() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative w-full bg-white py-20 md:py-28">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full opacity-[0.04] blur-3xl bg-[#FFA900]" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full opacity-[0.03] blur-3xl bg-[#00AFA9]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-5">
        <div className="text-center mb-14 md:mb-18">
          <span className="inline-block text-sm font-semibold uppercase tracking-[0.15em] text-[#FFA900]/80 mb-4">
            Ils nous font confiance
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1D20] tracking-tight">
            Nos Références
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="w-12 h-0.5 bg-gradient-to-r from-[#FFA900] to-[#00AFA9]" />
            <p className="text-sm text-[#0B1D20]/50 font-light tracking-wide">
              {partenaires.length} partenaires
            </p>
            <span className="w-12 h-0.5 bg-gradient-to-r from-[#00AFA9] to-[#FFA900]" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-5 md:gap-7 lg:gap-9">
          {partenaires.map((p, index) => (
            <div
              key={index}
              className="group w-[130px] h-[80px] md:w-[150px] md:h-[90px] lg:w-[170px] lg:h-[100px] rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#FFA900]/10 hover:border-[#FFA900]/30"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                transition: `all 0.6s ease-out ${index * 0.08}s`,
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-contain transition-all duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
