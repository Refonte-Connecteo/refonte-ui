"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CoverSlide {
  color: string;
  title: string;
  image?: string;
}

interface OfferDetail {
  slug: string;
  category: "Outsourcing" | "Consulting";
  slides: CoverSlide[];
  pourQui: string;
  pourVosEnjeux: string[];
  ceQueNousFaisons: string[];
}

const OFFERS: Record<string, OfferDetail> = {
  init: {
    slug: "init",
    category: "Outsourcing",
    slides: [
      { color: "#F5A623", title: "Offres Connecteo INIT" },
      { color: "#0E7490", title: "Démarrez vite, sans risque" },
      { color: "#8FA37E", title: "Un partenariat testé simplement" },
    ],
    pourQui:
      "Aux entreprises qui souhaitent démarrer rapidement, tester un partenariat ou soulager leurs équipes internes.",
    pourVosEnjeux: [
      "Saturation des équipes internes",
      "Manque de visibilité sur la relation client",
      "Besoin d'une solution rapide et fiable",
    ],
    ceQueNousFaisons: [
      "Gestion des appels entrants N1 : Accueil, conseil et prise en charge des demandes clients",
      "Appel sortant N1 : Développement commercial et mise à jour des données clients",
      "Back-office : Certification, Mise en service, Résiliation, Opérations systèmes avancées",
    ],
  },
  advanced: {
    slug: "advanced",
    category: "Outsourcing",
    slides: [
      { color: "#F5A623", title: "Offres Connecteo ADVANCED" },
      { color: "#0E7490", title: "Un pilotage qualité renforcé" },
      { color: "#8FA37E", title: "La performance multicanale" },
    ],
    pourQui:
      "Aux entreprises déjà externalisées qui veulent gagner en performance, en qualité de service et en pilotage.",
    pourVosEnjeux: [
      "Besoin d'un pilotage qualité renforcé",
      "Volumes multicanaux (voix, chat, mail, réseaux sociaux)",
      "Exigence de reporting et de KPI précis",
    ],
    ceQueNousFaisons: [
      "Gestion multicanale N1/N2 : voix, chat, mail, réseaux sociaux",
      "Pilotage qualité dédié avec reporting régulier et plans d'action",
      "Formation continue des équipes et montée en compétence progressive",
    ],
  },
  partenaires: {
    slug: "partenaires",
    category: "Outsourcing",
    slides: [
      { color: "#F5A623", title: "Offres Connecteo PARTENAIRES" },
      { color: "#0E7490", title: "Un plateau dédié, co-construit" },
      { color: "#8FA37E", title: "Un engagement sur le long terme" },
    ],
    pourQui:
      "Aux entreprises qui cherchent un partenariat stratégique de long terme, avec un plateau dédié et co-construit.",
    pourVosEnjeux: [
      "Volumétrie importante et récurrente",
      "Besoin d'une équipe dédiée et stable",
      "Recherche d'un partenaire, pas seulement d'un prestataire",
    ],
    ceQueNousFaisons: [
      "Plateaux dédiés avec équipes recrutées et formées sur mesure",
      "Co-construction des process, scripts et outils avec vos équipes",
      "Comité de pilotage stratégique et amélioration continue partagée",
    ],
  },
  audit: {
    slug: "audit",
    category: "Consulting",
    slides: [
      { color: "#F5A623", title: "Audit & diagnostic" },
      { color: "#0E7490", title: "Un état des lieux objectif" },
      { color: "#8FA37E", title: "Des recommandations priorisées" },
    ],
    pourQui:
      "Aux entreprises qui veulent avoir une vision claire et objective de leur relation client avant d'agir.",
    pourVosEnjeux: [
      "Manque de visibilité sur la performance actuelle",
      "Décisions à prendre sans données fiables",
      "Besoin d'un regard extérieur et objectif",
    ],
    ceQueNousFaisons: [
      "Audit complet des processus, outils et performances actuels",
      "Analyse des irritants clients et des points de friction internes",
      "Restitution avec recommandations priorisées et plan d'action",
    ],
  },
  transfo: {
    slug: "transfo",
    category: "Consulting",
    slides: [
      { color: "#F5A623", title: "Transformation digitale" },
      { color: "#0E7490", title: "Moderniser sans perdre en qualité" },
      { color: "#8FA37E", title: "Vos équipes accompagnées au changement" },
    ],
    pourQui:
      "Aux entreprises qui veulent moderniser leur relation client grâce aux outils et à l'IA.",
    pourVosEnjeux: [
      "Outils vieillissants ou peu intégrés",
      "Volonté d'automatiser sans perdre en qualité",
      "Besoin d'accompagner le changement en interne",
    ],
    ceQueNousFaisons: [
      "Cadrage et choix des outils (CRM, IA, automatisation)",
      "Accompagnement au déploiement et à la conduite du changement",
      "Formation des équipes aux nouveaux usages",
    ],
  },
  pilotage: {
    slug: "pilotage",
    category: "Consulting",
    slides: [
      { color: "#F5A623", title: "Pilotage de la performance" },
      { color: "#0E7490", title: "Des KPI clairs et actionnables" },
      { color: "#8FA37E", title: "Une amélioration continue" },
    ],
    pourQui:
      "Aux entreprises qui veulent structurer durablement le pilotage de leur relation client.",
    pourVosEnjeux: [
      "Absence d'indicateurs de performance clairs",
      "Difficulté à mesurer le ROI de la relation client",
      "Besoin d'un pilotage régulier et actionnable",
    ],
    ceQueNousFaisons: [
      "Définition des KPI et mise en place de tableaux de bord",
      "Comités de pilotage réguliers avec plans d'action",
      "Accompagnement à l'amélioration continue",
    ],
  },
};

const AUTOPLAY_MS = 4000;

export { OFFERS };
export type { OfferDetail, CoverSlide };

export default function OfferDetailPage({
  offerId = "init",
}: {
  offerId?: string;
}) {
  const offer = OFFERS[offerId] ?? OFFERS.init;
  const { slides } = offer;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [offerId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];

  return (
    <section className="w-full">
      <div
        className="relative flex min-h-[240px] w-full flex-col justify-between overflow-hidden px-8 py-8 transition-colors duration-700 md:min-h-[280px] md:px-12"
        style={{ backgroundColor: current.image ? undefined : current.color }}
      >
        {current.image && (
          <>
            <Image
              src={current.image}
              alt={current.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </>
        )}

        <div className="relative z-10 pt-24 md:pt-28">
          <span className="inline-block rounded-full bg-teal-800 px-4 py-1.5 text-xs font-semibold text-white">
            {offer.category}
          </span>
          <h1
            key={activeSlide}
            className="mt-5 max-w-md text-2xl font-bold leading-snug text-teal-900 transition-opacity duration-500 md:text-3xl"
            style={current.image ? { color: "#fff" } : undefined}
          >
            {current.title}
          </h1>
        </div>

        <div className="relative z-10 flex items-center gap-2 self-end">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller au slide ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`h-2.5 rounded-full transition-all ${
                current.image ? "bg-white" : "bg-teal-800"
              } ${i === activeSlide ? "w-6" : "w-2.5 opacity-50"}`}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-neutral-100 p-6">
            <h2 className="mb-3 text-lg font-bold text-teal-900">
              Pour qui ?
            </h2>
            <p className="text-sm leading-relaxed text-neutral-500">
              {offer.pourQui}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-100 p-6">
            <h2 className="mb-3 text-lg font-bold text-teal-900">
              Pour vos enjeux
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-500">
              {offer.pourVosEnjeux.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-neutral-100 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr] sm:items-start">
            <h2 className="text-lg font-bold text-teal-900">
              Ce que nous faisons
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-500">
              {offer.ceQueNousFaisons.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-full bg-teal-50 px-8 py-6 sm:flex-row">
          <p className="text-center text-lg font-bold text-teal-900 sm:text-left">
            Vous voulez
            <br className="hidden sm:block" /> en savoir plus ?
          </p>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </section>
  );
}
