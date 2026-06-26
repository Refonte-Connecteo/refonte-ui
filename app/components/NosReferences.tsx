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
    <section ref={ref} className="relative w-full bg-[#0B1D20] py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full opacity-[0.04] blur-3xl bg-[#00AFA9]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-[0.03] blur-3xl bg-[#FFA900]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-5">
        <div className="text-center mb-14 md:mb-18">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Nos Références
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/50 font-light max-w-lg mx-auto">
            Ils nous font confiance
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
          {partenaires.map((p, index) => (
            <div
              key={index}
              className="group w-[130px] h-[80px] md:w-[150px] md:h-[90px] lg:w-[170px] lg:h-[100px] rounded-xl bg-white flex items-center justify-center p-4 transition-all duration-500 hover:scale-105 hover:shadow-lg"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                transition: `all 0.6s ease-out ${index * 0.08}s`,
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-contain transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
