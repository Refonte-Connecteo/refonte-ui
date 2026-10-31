"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 1600;

/** Sépare "+850", "1.2M" ou "25" en préfixe, nombre et suffixe. */
function parseStat(value: string) {
  const match = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)([\s\S]*)$/);
  if (!match) return null;
  const [, prefix, raw, suffix] = match;
  const separator = raw.includes(",") ? "," : ".";
  return {
    prefix,
    suffix,
    separator,
    target: Number(raw.replace(",", ".")),
    decimals: raw.split(separator)[1]?.length ?? 0,
  };
}

function formatStat(stat: NonNullable<ReturnType<typeof parseStat>>, current: number) {
  const number = current.toFixed(stat.decimals).replace(".", stat.separator);
  return `${stat.prefix}${number}${stat.suffix}`;
}

/** Fait monter une valeur affichée de 0 à sa valeur finale, en gardant son format. */
export function useCountUp(value: string, start: boolean) {
  const stat = parseStat(value);
  const [display, setDisplay] = useState(stat ? formatStat(stat, 0) : value);

  useEffect(() => {
    if (!start) return;
    const parsed = parseStat(value);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    if (!parsed || reduced) {
      frame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // La dernière image affiche la valeur d'origine, sans arrondi.
      setDisplay(progress < 1 ? formatStat(parsed, parsed.target * eased) : value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, start]);

  return display;
}
