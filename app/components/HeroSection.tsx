"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { resolveAssetUrl, sanitizeUrl } from "@/lib/security";
import type { HeroPage } from "@/app/admin/types";

/** Un slide = une image qui contient déjà son texte. Seuls le bouton et les indicateurs sont superposés. */
export interface HeroSlideView {
  image: string;
  mobileImage?: string | null;
  /** Texte de l'image, lu par les lecteurs d'écran. */
  alt: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

interface HeroSectionProps {
  page: HeroPage;
  /** Titre de la page, invisible à l'écran mais lu par les moteurs de recherche et les lecteurs d'écran. */
  heading: string;
  /** Bouton affiché quand le slide n'en définit pas. */
  defaultCta: { label: string; href: string };
  /** Slides affichés si l'admin n'en a publié aucun pour cette page. */
  fallbackSlides?: HeroSlideView[];
  /** Hero affiché à la place du carrousel si aucun slide n'est disponible. */
  fallback?: ReactNode;
}

const SWIPE_THRESHOLD_PX = 40;

function CtaButton({ label, href, small = false }: { label: string; href: string; small?: boolean }) {
  const safeHref = sanitizeUrl(href, "#");
  const external = /^https?:\/\//i.test(safeHref);
  const Icon = /matterport/i.test(safeHref) ? MapPin : ArrowRight;
  const className = `btn-shine group relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-[#FFA900] font-semibold uppercase tracking-wider text-[#0B1D20] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
    small ? "px-5 py-2.5 text-xs" : "px-5 py-2.5 text-xs lg:px-7 lg:py-3 lg:text-sm"
  }`;
  const content = (
    <>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 transition-transform duration-300 group-hover:scale-110">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      </span>
      {label}
    </>
  );

  if (external) {
    return (
      <a href={safeHref} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }
  if (safeHref.startsWith("/")) {
    return <Link href={safeHref} className={className}>{content}</Link>;
  }
  return <a href={safeHref} className={className}>{content}</a>;
}

/**
 * Carrousel hero administrable (Slides Hero dans l'admin).
 * Ordinateur : image au format 8:3 (1920 × 720), bouton et indicateurs superposés en bas.
 * Mobile : version portrait 4:5 si chaque slide en a une, sinon l'image entière ; bouton et indicateurs sous l'image.
 */
export default function HeroSection({ page, heading, defaultCta, fallbackSlides = [], fallback }: HeroSectionProps) {
  const [slides, setSlides] = useState<HeroSlideView[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getActiveHeroSlides(page)
      .then(({ slides: rows }) => {
        if (!active) return;
        const mapped = rows.map((s) => ({
          image: resolveAssetUrl(s.image_url, ""),
          mobileImage: s.mobile_image_url ? resolveAssetUrl(s.mobile_image_url, "") : null,
          alt: s.title ?? "",
          ctaLabel: s.cta_label,
          ctaUrl: s.cta_url,
        }));
        setSlides(mapped.filter((s) => s.image));
      })
      .catch(() => active && setSlides([]));
    return () => {
      active = false;
    };
  }, [page]);

  const list = slides === null ? null : slides.length > 0 ? slides : fallbackSlides;
  const count = list?.length ?? 0;
  const index = count > 0 ? current % count : 0;

  const goTo = useCallback((i: number) => count > 0 && setCurrent(((i % count) + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Met le carrousel en pause quand l'onglet est caché.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (list !== null && count === 0 && fallback) return <>{fallback}</>;

  const useMobileImages = count > 0 && list!.every((s) => s.mobileImage);
  const slide = list?.[index];
  // Un lien refusé par sanitizeUrl (javascript:, //hôte…) retombe sur le bouton par défaut.
  const cta =
    slide?.ctaLabel && slide.ctaUrl && sanitizeUrl(slide.ctaUrl, "")
      ? { label: slide.ctaLabel, href: slide.ctaUrl }
      : defaultCta;

  // Le slide suivant arrive à la fin de la barre de progression : la pause et la réduction des animations en découlent.
  const dots = count > 1 && (
    <div className="flex items-center" role="group" aria-label="Choisir une image">
      {list!.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goTo(i)}
          className="group relative flex h-11 min-w-9 items-center justify-center px-1"
          aria-label={`Image ${i + 1} sur ${count}`}
          aria-current={i === index}
        >
          <span
            className={`relative block overflow-hidden rounded-full transition-all duration-500 ${
              i === index ? "h-2.5 w-8 bg-current/25" : "h-2.5 w-2.5 bg-current/40 group-hover:bg-current/70"
            }`}
          >
            {i === index && (
              <span
                key={`${index}-${s.image}`}
                className="hero-progress absolute inset-0 rounded-full bg-[#FFA900]"
                style={{ animationPlayState: paused ? "paused" : "running" }}
                onAnimationEnd={next}
              />
            )}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <section
      aria-roledescription="carrousel"
      aria-label={heading}
      className="w-full bg-white px-4 pt-[5.25rem] sm:px-6 sm:pt-24 md:px-8 md:pt-28"
    >
      <h1 className="sr-only">{heading}</h1>
      <div
        className="relative mx-auto max-w-[1920px]"
        // Le carrousel défile toujours, même sous la souris ou après un clic sur un indicateur.
        // Seule la navigation au clavier (Tab) le met en pause, pour laisser le temps de lire (WCAG 2.2.2).
        onFocus={(e) => setPaused(e.target.matches(":focus-visible"))}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      >
        <div
          className={`relative overflow-hidden rounded-[1.25rem] bg-[#E5F3F3] shadow-[0_24px_60px_-40px_rgba(9,100,117,0.6)] md:rounded-[2rem] ${
            useMobileImages ? "aspect-[4/5] md:aspect-[8/3]" : "aspect-[8/3]"
          } ${list === null ? "animate-pulse" : ""}`}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > SWIPE_THRESHOLD_PX) goTo(dx < 0 ? index + 1 : index - 1);
          }}
        >
          {list?.map((s, i) => (
            <picture key={`${i}-${s.image}`}>
              {useMobileImages && s.mobileImage && <source media="(max-width: 767px)" srcSet={s.mobileImage} />}
              <img
                src={s.image}
                alt={i === index ? s.alt : ""}
                aria-hidden={i !== index}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </picture>
          ))}

          {/* Ordinateur : bouton en bas à gauche, indicateurs en bas à droite */}
          {list && (
            <div className="pointer-events-none absolute inset-x-[4.5%] bottom-[8%] hidden items-end justify-between gap-4 md:flex">
              <div className="pointer-events-auto">
                <CtaButton label={cta.label} href={cta.href} />
              </div>
              {dots && (
                <div className="pointer-events-auto rounded-full bg-[#0B1D20]/35 px-2 text-white backdrop-blur-md">
                  {dots}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile : bouton et indicateurs sous l'image, pour ne jamais cacher son texte */}
        {list && (
          <div className="flex items-center justify-between gap-3 pt-3 text-[#096475] md:hidden">
            <CtaButton label={cta.label} href={cta.href} small />
            {dots}
          </div>
        )}
      </div>
    </section>
  );
}
