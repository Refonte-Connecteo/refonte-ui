"use client";

import Image from "next/image";
import { useInView } from "../hooks/useInView";

export default function MotDuDG() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#0B1D20] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full opacity-[0.04] blur-3xl bg-[#00AFA9]" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full opacity-[0.03] blur-3xl bg-[#FFA900]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-5">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16 lg:gap-24">
          <div
            className="md:w-2/5 shrink-0 flex justify-center transition-all duration-1000 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <div className="relative">
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden rounded-2xl">
                <Image
                  src="/images/pdg.jpg"
                  alt="Malik MECHICHE"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl -z-10"
                style={{
                  border: "2px solid rgba(0, 175, 169, 0.3)",
                }}
              />
            </div>
          </div>

          <div
            className="md:flex-1 transition-all duration-1000 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(40px)",
              transitionDelay: "200ms",
            }}
          >
            <div className="relative">
              <span
                className="absolute -top-8 -left-2 text-7xl leading-none font-bold select-none"
                style={{ color: "rgba(0, 175, 169, 0.12)" }}
              >
                &ldquo;
              </span>
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-white/80 font-light relative z-10">
                Chez Connecteo, nous croyons que chaque talent a sa place.
                Notre mission est de créer des ponts entre les ambitions
                individuelles et les besoins des entreprises, avec humanité
                et excellence.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <span className="block w-10 h-px bg-[#00AFA9]" />
              <div>
                <p className="text-base font-semibold text-white">
                  Malik MECHICHE
                </p>
                <p
                  className="text-sm font-light tracking-wide"
                  style={{ color: "rgba(0, 175, 169, 0.8)" }}
                >
                  Chief Executive Officer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
