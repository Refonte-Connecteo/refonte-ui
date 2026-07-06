"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import ParallaxLayer from "./ParallaxLayer";

export default function StickyStack({
  top,
  bottom,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        {top}
        {bottom}
        <div className="absolute right-0 top-0 bottom-0 w-[39%] pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 via-white/30 to-white/90" />
          <div className="relative w-full h-full">
            <ParallaxLayer speed={-0.15} className="w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src="/images/c12.png"
                  alt=""
                  fill
                  className="object-cover object-left opacity-50"
                />
              </div>
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </div>
  );
}
