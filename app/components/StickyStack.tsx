"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import ParallaxLayer from "./ParallaxLayer";
import { api } from "@/lib/api";
import { formatKpiValue } from "@/lib/kpi";
import { useInView } from "../hooks/useInView";
import CountUp from "./CountUp";

export default function StickyStack({
  top,
  bottom,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView: statsInView } = useInView();
  const [contentHeight, setContentHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<{ value: string; label: string }[]>([
    { value: "+850", label: "Collaborateurs" },
    { value: "1.2M", label: "Interactions par mois" },
    { value: "+100k", label: "Contacts digitaux par mois" },
    { value: "25", label: "Ages moyens" },
  ]);

  useEffect(() => {
    setMounted(true);
    api.getActiveKpiStats().then((res) => {
      const mapped = res.stats.map((s) => ({
        value: formatKpiValue(s.value, s.unit),
        label: s.label,
      }));
      if (mapped.length > 0) setStats(mapped);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  const spacerHeight =
    mounted
      ? Math.max(contentHeight, window.innerHeight) + 80
      : 2000;

  return (
    <div style={{ height: spacerHeight }} className="relative">
      <div
        ref={contentRef}
        className="sticky top-0 min-h-screen overflow-y-auto"
      >

        <div className="relative z-10 w-full bg-white">
          <div className="mx-auto max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-10 md:pb-12">
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight tabular-nums text-[#00AFA9] leading-none">
                    <CountUp value={stat.value} start={statsInView} />
                  </span>
                  <span className="block text-sm md:text-[15px] text-[#0B1D20]/45 mt-3 font-normal">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {top}
        {bottom}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[39%] pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 via-white/30 to-white/90" />
          <div className="relative w-full h-full">
            <ParallaxLayer speed={-0.15} className="w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src="/images/c12.png"
                  alt=""
                  fill
                  className="object-cover object-left opacity-30"
                />
              </div>
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </div>
  );
}
