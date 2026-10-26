"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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

// 👉 Vidéo : fichier dans /public/videos et image d'aperçu dans /public/images
const VIDEO_SRC = "/videos/connecteo.mp4";
const VIDEO_POSTER = "/images/video-poster.jpg";

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
  const [playing, setPlaying] = useState(false);

  return (
    <main className="font-sans text-[#0b4f5c]">
      {/* Titre */}
      <header className="bg-[#00aeaa] px-6 py-10 md:px-16 md:py-14">
        <h1 className="mx-auto max-w-6xl text-3xl font-bold text-white md:text-4xl">
          L&apos;actualité de Connecteo.
        </h1>
      </header>

      {/* Cartes d'actualité */}
      <section className="bg-[#cfe0e3] px-6 py-14 md:px-16 md:py-20">
        <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:gap-6">
          {NEWS.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="group flex h-full min-h-[10rem] flex-col rounded-3xl bg-white p-6 transition-shadow duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4f5c] md:p-8"
              >
                <span className="text-sm font-bold">{n.label}</span>
                <span className="mt-2 text-sm leading-relaxed text-slate-700">
                  {n.text}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-auto pt-4 text-lg transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Évènements */}
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-bold md:text-2xl">
            Évènements — retour en images
          </h2>

          <div className="mt-10 space-y-14">
            {EVENTS.map((ev) => (
              <article key={ev.title}>
                <p className="text-xs font-bold">{ev.date}</p>
                <h3 className="mt-0.5 text-sm font-bold">{ev.title}</h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600">
                  {ev.description}
                </p>
                <PhotoCarousel photos={ev.photos} title={ev.title} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vidéo */}
      <section className="relative isolate overflow-hidden bg-[#0b6171] px-6 py-16 text-center text-white md:py-24">
        <Image
          src={VIDEO_POSTER}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-30 blur-sm"
        />

        <h2 className="text-xl font-bold md:text-2xl">
          Découvrez Connecteo en vidéo
        </h2>

        {playing ? (
          <video
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            controls
            autoPlay
            playsInline
            className="mx-auto mt-8 aspect-video w-full max-w-3xl rounded-2xl bg-black"
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Lire la vidéo"
              className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a30f]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </button>
            <p className="mx-auto mt-6 max-w-md text-xs text-white/85">
              Nos équipes, nos métiers et notre façon de faire, en quelques
              minutes.
            </p>
          </>
        )}
      </section>
    </main>
  );
}