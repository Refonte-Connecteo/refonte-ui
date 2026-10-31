"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

/* ----------------------------------------------------------------------------
 * ⚠️ La capture était petite : les textes ci-dessous sont reconstitués au mieux.
 * Relisez-les et remplacez-les par les textes exacts.
 * ------------------------------------------------------------------------- */

type NewsItem = { href: string; label: string; text: string };

const NEWS: NewsItem[] = [
  {
    href: "/actualites/ia-relation-client-africaine",
    label: "Article · Mars 2026",
    text: "L'IA au service de la relation client africaine : quand intelligence artificielle et esprit humain se combinent pour des parcours plus fluides.",
  },
  {
    href: "/actualites/rapport-inclusion-jeunes",
    label: "Rapport · Janvier 2026",
    text: "Notre engagement pour l'inclusion, la formation et l'employabilité des jeunes.",
  },
  {
    href: "/actualites/cx-trends-afrique-2025",
    label: "Étude · Décembre 2025",
    text: "CX Trends Afrique 2025 : les grandes tendances de l'expérience client sur le continent.",
  },
  {
    // La maquette répète la même étude : à remplacer
    href: "/actualites/cx-trends-afrique-2025-bis",
    label: "Étude · Décembre 2025",
    text: "CX Trends Afrique 2025 : les grandes tendances de l'expérience client sur le continent.",
  },
];

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
const VIDEO_BG = "/youtubeI.png";

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
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#0b4f5c] transition-colors hover:bg-[#0b4f5c]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0b4f5c] disabled:pointer-events-none disabled:opacity-30"
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
            className="relative aspect-[4/3] shrink-0 basis-[72%] snap-start overflow-hidden rounded-2xl bg-[#d9d9d9] sm:basis-[calc((100%-2rem)/3)]"
          >
            {p.src && (
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 640px) 30vw, 72vw"
                className="object-cover"
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
  const [articles, setArticles] = useState<
    { id: number; label: string; text: string; href: string }[]
  >([]);
  const [events, setEvents] = useState<
    { id: number; date: string; title: string; description: string; photos: Photo[] }[]
  >([]);

  useEffect(() => {
    api
      .getPublishedArticles()
      .then((res) => {
        const mapped = res.articles.map((a) => ({
          id: a.id,
          label: `${a.type || "Article"} · ${a.published_at ? new Date(a.published_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : ""}`.replace(/ · $/, ""),
          text: a.description || a.title,
          href: a.file_url || `/actualites/${a.id}`,
        }));
        setArticles(mapped);
      })
      .catch(() => {});

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
                    .map((img) => ({ src: img.image_url, alt: img.caption || e.title }))
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

  return (
    <main className="font-sans text-[#0b4f5c]">
      {/* Titre */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#00aeaa] to-[#0b6171] px-6 pt-12 pb-28 md:px-16 md:pt-16 md:pb-36">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mt-20 mx-auto max-w-6xl">

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            L&apos;actualité de Connecteo.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
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
      <section className="relative -mt-[1px] bg-[#d8e7ea] px-6 py-12 md:px-16 md:py-16">
        <ul className="relative mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:gap-5">
          {(articles.length > 0 ? articles : NEWS).map((n: any) => (
            <li key={n.id || n.href}>
              <Link
                href={n.href}
                className="group relative flex h-full aspect-[5/4] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-white px-5 py-6 text-center shadow-[0_30px_50px_-30px_rgba(11,79,92,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_60px_-30px_rgba(11,79,92,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4f5c] md:px-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00aeaa]/80 to-[#0b6171]/80" />
                <div className="flex max-w-[88%] flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0b6171]/70">
                    {n.label}
                  </span>
                  <span className="mt-3 text-sm font-semibold leading-relaxed text-[#0b4f5c] md:text-base">
                    {n.text}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#00aeaa] transition-all duration-300 group-hover:translate-x-1"
                  >
                    Lire la suite
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Évènements */}
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
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
              <article key={ev.id || ev.title} className="relative">
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
          className="group mx-auto mt-10 flex h-18 w-18 items-center justify-center rounded-full border border-white/70 transition-all duration-300 hover:scale-105 hover:border-[#f5a30f] hover:bg-[#f5a30f]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a30f]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-7 w-7 transition-colors duration-300 group-hover:text-[#f5a30f]" fill="currentColor">
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </a>
        <p className="mx-auto mt-5 text-xs uppercase tracking-[0.3em] text-white/50">
          Voir sur YouTube
        </p>
      </section>
    </main>
  );
}