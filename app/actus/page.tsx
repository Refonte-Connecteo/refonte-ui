"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/security";
import Reveal from "../components/Reveal";
import { ArticleCard, FeaturedArticleCard } from "../components/actus/ArticleCard";
import type { NewsArticle } from "../components/actus/ArticleCard";
import ArticleModal from "../components/actus/ArticleModal";

const INITIAL_ARTICLES = 7;
const ARTICLES_STEP = 6;
const ALL_TYPES = "Tous";

const typeLabel = (type: string | null) => {
  const value = (type || "Article").trim();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

type Photo = { src: string; alt: string };
type EventItem = {
  date: string;
  title: string;
  description: string;
  photos: Photo[];
};

// src vide = vignette grise. Ex. de vraie photo : { src: "/images/events/talents-day-1.jpg", alt: "…" }
const placeholders = (n = 6): Photo[] =>
  Array.from({ length: n }, (_, i) => ({ src: "", alt: `Photo ${i + 1}` }));

const EVENTS: EventItem[] = [
  {
    date: "Novembre 2025",
    title: "Connecteo Talents Day",
    description:
      "Une journée dédiée au recrutement, aux métiers et aux talents de la relation client.",
    photos: placeholders(),
  },
  {
    date: "Septembre 2025",
    title: "Forum CX Afrique",
    description:
      "Connecteo partenaire du grand rendez-vous de la relation client sur le continent.",
    photos: placeholders(),
  },
  {
    date: "Juillet 2025",
    title: "Événement Connecteo Consulting",
    description: "Présentation officielle de nos nouvelles offres.",
    photos: placeholders(),
  },
];

// 👉 Vidéo : rediriger vers YouTube
const YOUTUBE_URL = "https://www.youtube.com/watch?v=UKMOb0rkvxw";
const VIDEO_BG = "/images/youtubeI.png";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${dir === "left" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CarouselButton({
  dir,
  label,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0b4f5c] transition-all duration-200 hover:bg-[#0b4f5c]/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0b4f5c] disabled:pointer-events-none disabled:opacity-30 sm:flex"
    >
      <Chevron dir={dir} />
    </button>
  );
}

function PhotoCarousel({ photos, title }: { photos: Photo[]; title: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="mt-5 flex items-center gap-1 sm:gap-3">
      <CarouselButton
        dir="left"
        label={`Photos précédentes — ${title}`}
        disabled={edges.start}
        onClick={() => scroll(-1)}
      />
      <ul
        ref={trackRef}
        onScroll={update}
        className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <li
            key={i}
            className="group relative aspect-[4/3] shrink-0 basis-[78%] snap-start overflow-hidden rounded-2xl bg-[#d9d9d9] sm:basis-[calc((100%-2rem)/3)]"
          >
            {p.src && (
              <Image
                src={p.src}
                alt={p.alt}
                fill
                // Les photos de l'admin viennent de l'API ou d'une URL libre : next/image
                // refuserait tout domaine non déclaré et ferait planter la page.
                unoptimized={/^https?:/i.test(p.src)}
                sizes="(min-width: 640px) 30vw, 78vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            )}
          </li>
        ))}
      </ul>
      <CarouselButton
        dir="right"
        label={`Photos suivantes — ${title}`}
        disabled={edges.end}
        onClick={() => scroll(1)}
      />
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [articlesLoaded, setArticlesLoaded] = useState(false);
  const [activeType, setActiveType] = useState(ALL_TYPES);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ARTICLES);
  const [openArticle, setOpenArticle] = useState<NewsArticle | null>(null);
  const [events, setEvents] = useState<
    { id: number; date: string; title: string; description: string; photos: Photo[] }[]
  >([]);

  useEffect(() => {
    api
      .getPublishedArticles()
      .then((res) => {
        setArticles(
          res.articles.map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description || "",
            type: typeLabel(a.type),
            date: a.published_at
              ? new Date(a.published_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
              : "",
            fileUrl: resolveAssetUrl(a.file_url, ""),
          })),
        );
      })
      .catch(() => {})
      .finally(() => setArticlesLoaded(true));

    api
      .getPublishedEvents()
      .then((res) => {
        const mapped = res.events
          .map((e) => {
            const eventDate = e.event_date ? new Date(e.event_date) : null;
            const photos =
              e.event_images && e.event_images.length > 0
                ? e.event_images
                    .sort((x, y) => x.position - y.position)
                    .map((img) => ({ src: resolveAssetUrl(img.image_url, ""), alt: img.caption || e.title }))
                : placeholders();
            return {
              id: e.id,
              date: eventDate ? eventDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "",
              title: e.title,
              description: e.description || "",
              photos,
            };
          });
        setEvents(mapped);
      })
      .catch(() => {});
  }, []);

  const articleTypes = useMemo(() => [...new Set(articles.map((a) => a.type))], [articles]);
  const filteredArticles =
    activeType === ALL_TYPES ? articles : articles.filter((a) => a.type === activeType);
  const [featuredArticle, ...otherArticles] = filteredArticles.slice(0, visibleCount);

  const selectType = (type: string) => {
    setActiveType(type);
    setVisibleCount(INITIAL_ARTICLES);
  };

  return (
    <main className="font-sans text-[#0b4f5c]">
      {/* Titre */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#00aeaa] to-[#0b6171] px-6 pt-32 pb-28 md:px-12 md:pt-36 md:pb-36 lg:px-16">
        <div className="halo-drift absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="halo-drift absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl [animation-direction:alternate-reverse]" />
        <div className="relative mx-auto max-w-6xl">

          <h1 className="cons-fade text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            L&apos;actualité de Connecteo.
          </h1>
          <p className="cons-fade mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base" style={{ animationDelay: "120ms" }}>
            Découvrez nos dernières actualités, études et événements à la une.
          </p>
        </div>
        <div className="absolute -bottom-[1px] left-0 right-0">
          <svg viewBox="0 0 1440 120" className="h-[70px] w-full md:h-[90px]" preserveAspectRatio="none">
            <path d="M0,0 C360,90 1080,90 1440,0 L1440,120 L0,120 Z" fill="#d8e7ea" />
          </svg>
        </div>
      </header>

      {/* Cartes d'actualité */}
      <section className="relative -mt-[1px] bg-[#d8e7ea] px-6 py-12 md:px-12 md:py-16 lg:px-16">
        <div className="relative mx-auto max-w-6xl">
          {articleTypes.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrer les actualités">
              {[ALL_TYPES, ...articleTypes].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => selectType(type)}
                  aria-pressed={activeType === type}
                  className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4f5c] ${
                    activeType === type
                      ? "bg-[#0b6171] text-white shadow-md"
                      : "bg-white text-[#0b4f5c] hover:bg-[#0b6171]/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {featuredArticle && (
            <Reveal key={`${activeType}-${featuredArticle.id}`}>
              <FeaturedArticleCard article={featuredArticle} onOpen={() => setOpenArticle(featuredArticle)} />
            </Reveal>
          )}

          {otherArticles.length > 0 && (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((article, index) => (
                <li key={article.id}>
                  <Reveal className="h-full" delay={(index % 3) * 100}>
                    <ArticleCard article={article} onOpen={() => setOpenArticle(article)} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          {filteredArticles.length > visibleCount && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + ARTICLES_STEP)}
                className="min-h-11 rounded-full bg-[#0b6171] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0b4f5c] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4f5c]"
              >
                Voir plus
              </button>
            </div>
          )}

          {articlesLoaded && articles.length === 0 && (
            <p className="py-10 text-center text-sm text-[#0b4f5c]/70">Aucune actualité pour le moment.</p>
          )}
        </div>
      </section>

      {/* Évènements */}
      <section className="bg-white px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 md:mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0b6171]/60">
              Événements
            </span>
            <h2 className="mt-3 text-xl font-bold md:text-2xl lg:text-3xl">
              Événements — retour en images
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Revivez les temps forts de Connecteo à travers nos rencontres et événements.
            </p>
          </div>

          <div className="space-y-16">
            {(events.length > 0 ? events : EVENTS).map((ev: any, idx: number) => {
              const list = events.length > 0 ? events : EVENTS;
              return (
              <Reveal key={ev.id || ev.title}>
              <article className="relative">
                {idx !== list.length - 1 && (
                  <div className="absolute -bottom-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0b4f5c]/8 to-transparent" />
                )}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00aeaa]">
                      {ev.date}
                    </p>
                    <h3 className="mt-1 text-lg font-bold md:text-xl">{ev.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                      {ev.description}
                    </p>
                  </div>
                </div>
                <PhotoCarousel photos={ev.photos} title={ev.title} />
              </article>
              </Reveal>
            );
            })}
          </div>
        </div>
      </section>

      {/* Vidéo */}
      <section className="relative isolate overflow-hidden bg-[#0b6171] px-6 py-16 text-center text-white md:py-24">
        <Image
          src={VIDEO_BG}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b6171]/80 via-[#0b4f5c]/70 to-[#0b6171]/80" />

        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Vidéo
          </span>
          <h2 className="mt-3 text-xl font-bold md:text-2xl lg:text-3xl">
            Découvrez Connecteo en vidéo
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
            Nos équipes, nos métiers et notre façon de faire, en quelques minutes.
          </p>
        </div>

        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Voir la vidéo sur YouTube"
          className="pulse-ring group relative mx-auto mt-10 flex h-18 w-18 items-center justify-center rounded-full border border-white/70 transition-all duration-300 hover:scale-105 hover:border-[#f5a30f] hover:bg-[#f5a30f]/15 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a30f]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-7 w-7 transition-colors duration-300 group-hover:text-[#f5a30f]" fill="currentColor">
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </a>
        <p className="mx-auto mt-5 text-xs uppercase tracking-[0.3em] text-white/50">
          Voir sur YouTube
        </p>
      </section>

      {openArticle && <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />}
    </main>
  );
}