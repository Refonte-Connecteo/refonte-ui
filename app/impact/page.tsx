"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/security";
import Reveal from "../components/Reveal";

interface ImpactPillar {
  title: string;
  description: string;
}

interface ImpactReport {
  id: number;
  title: string;
  file_url: string;
  year: number | null;
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
  const [report, setReport] = useState<ImpactReport | null>(null);
  const [reportLoading, setReportLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getImpactReport()
      .then(({ catalogue }) => {
        if (active) setReport(catalogue);
      })
      .catch(() => {
        if (active) setReport(null);
      })
      .finally(() => {
        if (active) setReportLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !report) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      const link = document.createElement("a");
      const fileUrl = resolveAssetUrl(report.file_url, "");
      if (!fileUrl) return;
      const extension = report.file_url.split(".").pop()?.split(/[?#]/)[0];
      link.href = fileUrl;
      link.download = `rapport-impact-${report.year ?? new Date().getFullYear()}${extension ? `.${extension}` : ""}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
    <section className="w-full">
      {/* Hero */}
      <div className="relative flex h-[440px] w-full items-center justify-center overflow-hidden pt-20 md:h-[540px] md:pt-24">
        <Image
          src="/images/c5.jpg"
          alt="Sentier en forêt"
          fill
          priority
          className="hero-settle object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
          <span className="cons-fade mb-5 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-900">
            Impact &amp; Sustainability
          </span>
          <h1 className="cons-fade text-3xl font-bold text-white md:text-5xl" style={{ animationDelay: "120ms" }}>
            Un impact positif, durable.
          </h1>
          <p className="cons-fade mt-4 text-sm text-white/90 md:text-base" style={{ animationDelay: "240ms" }}>
            Parce qu&apos;une entreprise responsable est une entreprise qui
            dure. Voici nos engagements.
          </p>
        </div>
      </div>

      {/* Piliers */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-2 md:gap-10 md:px-10 md:py-20 lg:grid-cols-4 lg:px-6">
        {PILLARS.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 100}>
            <div className="group h-full border-l-2 border-amber-400 pl-4 transition-all duration-300 hover:translate-x-1 hover:border-[#00AFA9]">
              <h3 className="mb-2 text-lg font-bold text-neutral-900">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                {pillar.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA téléchargement */}
      <div className="w-full bg-[#B7C0A5] px-6 py-14 md:py-20">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">
            Téléchargez notre rapport d&apos;impact{report?.year ? ` ${report.year}` : ""}
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
              className="w-full rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm text-neutral-700 outline-none transition-shadow placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-600"
            />
            <button
              type="submit"
              disabled={status === "loading" || reportLoading || !report}
              className="btn-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-teal-700 enabled:hover:shadow-lg enabled:active:translate-y-0 enabled:active:scale-[0.98] disabled:opacity-60"
            >
              <Download size={16} className="transition-transform duration-300 group-enabled:group-hover:translate-y-0.5" />
              {status === "success"
                ? "Envoyé !"
                : reportLoading
                  ? "Chargement..."
                  : report
                    ? "Téléchargez"
                    : "Rapport indisponible"}
            </button>
            {!reportLoading && !report && (
              <p className="text-xs text-neutral-800">
                Aucun rapport d&apos;impact n&apos;est publié pour le moment.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}