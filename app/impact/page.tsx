"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { Download } from "lucide-react";

interface ImpactPillar {
  title: string;
  description: string;
}

const PILLARS: ImpactPillar[] = [
  {
    title: "Inclusion",
    description:
      "Programmes de soutien aux jeunes et associations locales.",
  },
  {
    title: "Communauté",
    description:
      "Égalité des chances, diversité et accessibilité au cœur de nos recrutements.",
  },
  {
    title: "Environnement",
    description:
      "Réduction de notre empreinte et choix d'infrastructures responsables.",
  },
  {
    title: "Formation",
    description: "Une académie interne pour faire grandir les talents.",
  },
];

export default function ImpactSustainabilitySection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // TODO: brancher sur l'API d'envoi du rapport
    setTimeout(() => setStatus("success"), 800);
  };

  return (
    <section className="w-full">
      {/* Hero */}
      <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden md:h-[520px]">
        <Image
          src="/images/c5.jpg"
          alt="Sentier en forêt"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
          <span className="mb-5 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-900">
            Impact &amp; Sustainability
          </span>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Un impact positif, durable.
          </h1>
          <p className="mt-4 text-sm text-white/90 md:text-base">
            Parce qu&apos;une entreprise responsable est une entreprise qui
            dure. Voici nos engagements.
          </p>
        </div>
      </div>

      {/* Piliers */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="border-l-2 border-amber-400 pl-4">
            <h3 className="mb-2 text-lg font-bold text-neutral-900">
              {pillar.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-500">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA téléchargement */}
      <div className="w-full bg-[#B7C0A5] px-6 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">
            Téléchargez notre rapport d&apos;impact 2025
          </h2>
          <p className="mt-2 text-sm text-neutral-800">
            Bilan complet de nos actions et de notre empreinte.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-sm flex-col items-center gap-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.com"
              className="w-full rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-600"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              <Download size={16} />
              {status === "success" ? "Envoyé !" : "Téléchargez"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}