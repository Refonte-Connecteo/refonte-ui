"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useInView } from "../hooks/useInView";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3000";

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  return url;
}

export default function MotDuDG() {
  const { ref, inView } = useInView();
  const [ceo, setCeo] = useState<{ title: string; description: string; image_url: string | null } | null>(null);

  useEffect(() => {
    api.getLatestCeoMessage().then((res) => {
      setCeo(res.message);
    }).catch(() => {});
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full bg-white py-24 md:py-32"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl bg-[#FFA900]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full opacity-[0.03] blur-3xl bg-[#00AFA9]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-5">
        <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-16 lg:gap-24">
          <div
            className="md:w-2/5 shrink-0 flex justify-center transition-all duration-1000 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <div className="relative">
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden rounded-2xl shadow-2xl shadow-[#00AFA9]/15">
                <img
                  src={ceo?.image_url ? resolveImageUrl(ceo.image_url) : "/images/pdg.jpg"}
                  alt={ceo?.title || "PDG"}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl -z-10"
                style={{
                  border: "2px solid rgba(255, 169, 0, 0.2)",
                }}
              />
              <div
                className="absolute -top-3 -left-3 w-full h-full rounded-2xl -z-20"
                style={{
                  border: "1px solid rgba(0, 175, 169, 0.12)",
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
              <div className="absolute -top-10 -left-3 text-8xl leading-none font-bold select-none text-[#FFA900]/15">
                &ldquo;
              </div>
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#0B1D20]/75 font-light relative z-10">
                {ceo?.description || "Chez Connecteo, nous croyons que chaque talent a sa place. Notre mission est de créer des ponts entre les ambitions individuelles et les besoins des entreprises, avec humanité et excellence."}
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <span className="block w-12 h-0.5 bg-gradient-to-r from-[#FFA900] to-[#00AFA9]" />
              <div>
                <p className="text-base font-semibold text-[#0B1D20]">
                  {ceo?.title || "Malik MECHICHE"}
                </p>
                <p className="text-sm font-light tracking-wide text-[#00AFA9]/90">
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
