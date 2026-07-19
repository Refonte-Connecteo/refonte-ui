"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";
import { api } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3000";

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  return url;
}

export default function NosReferences() {
  const { ref, inView } = useInView();
  const [partenaires, setPartenaires] = useState<{ src: string; alt: string }[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    api.getActiveReferences().then((res) => {
      const mapped = res.references.map(r => ({ src: r.image_url, alt: r.label }));
      setPartenaires(mapped);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || partenaires.length === 0) return;

    const speed = 0.5;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current -= speed;
        const oneSet = track.scrollWidth / 3;
        if (Math.abs(posRef.current) >= oneSet) {
          posRef.current += oneSet;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [partenaires]);

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
            <p className="text-sm text-[#0B1D20]/50 font-light tracking-wide" />
          </div>
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div ref={trackRef} className="flex w-max will-change-transform">
            {[...partenaires, ...partenaires, ...partenaires].map((p, index) => (
              <div
                key={index}
                className="shrink-0 w-[130px] h-[80px] md:w-[150px] md:h-[90px] lg:w-[170px] lg:h-[100px] mx-2.5 md:mx-3.5 lg:mx-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-[#FFA900]/10 hover:border-[#FFA900]/30"
                style={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
                }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={resolveImageUrl(p.src)}
                    alt={p.alt}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
