"use client";

import SecteursActivite from "../components/SecteursActivite";
 
import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { Download } from "lucide-react";
 
type OfferTab = "outsourcing" | "consulting";
 
interface Offer {
  id: string;
  label: string;
}
 
const OUTSOURCING_OFFERS: Offer[] = [
  { id: "init", label: "Offres CONNECTEO INIT" },
  { id: "advanced", label: "Offres CONNECTEO ADVANCED" },
  { id: "partenaires", label: "Offres CONNECTEO PARTENAIRES" },
];
 
const CONSULTING_OFFERS: Offer[] = [
  { id: "audit", label: "Audit & diagnostic" },
  { id: "transfo", label: "Transformation digitale" },
  { id: "pilotage", label: "Pilotage de la performance" },
];


export default function ExperienceClient() {
   const [activeTab, setActiveTab] = useState<OfferTab>("outsourcing");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );
 
  const offers =
    activeTab === "outsourcing" ? OUTSOURCING_OFFERS : CONSULTING_OFFERS;
 
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      const link = document.createElement("a");
      link.href = "/images/c4.jpg";
      link.download = "catalogue-offres-connecteo.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
     <section className="w-full">
      {/* Hero */}
      <div className="relative flex h-[300px] w-full items-center overflow-hidden md:h-[380px]">
        <Image
          src="/images/c3.jpg"
          alt="Équipe CONNECTEO"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D20]/80 via-[#0B1D20]/50 to-transparent" />

        <div className="relative z-10 max-w-xl px-10 md:px-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 mb-4">
            Nos Solutions
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white">
            Des offres au service de <br className="hidden md:block" />votre croissance.
          </h1>
        </div>
      </div>
 
      {/* Section Solutions — Toggle + Offres */}
      <div className="relative bg-white">
        <div className="relative mx-auto max-w-5xl px-8 md:px-12 lg:px-16 py-14 md:py-20">
          {/* Header éditorial */}
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block text-[11px] font-medium uppercase tracking-[0.25em] mb-3" style={{ color: "#0B1D2040" }}>
              {activeTab === "outsourcing" ? "Externalisation" : "Stratégie & conseil"}
            </span>
            <h2 className="text-3xl md:text-[44px] font-bold tracking-tight leading-[1.2]" style={{ color: "#0B1D20" }}>
              {activeTab === "outsourcing" ? (
                "Votre relation client, notre expertise."
              ) : (
                "Structurer pour mieux performer."
              )}
            </h2>
            <p className="mt-3 max-w-lg mx-auto text-[15px] leading-relaxed font-light" style={{ color: "#0B1D2050" }}>
              {activeTab === "outsourcing"
                ? "Externalisation de la relation client multicanale. Plateaux dédiés, équipes formées, pilotage qualité."
                : "Accompagnement stratégique et opérationnel pour structurer, outiller et monter en compétence vos équipes."}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-10 md:mb-14">
            <div
              className="inline-flex items-center gap-1 p-1.5 rounded-full"
              style={{ backgroundColor: "#0B1D2008" }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("outsourcing")}
                className="relative rounded-full px-7 py-2.5 text-[13px] font-semibold tracking-wide transition-all duration-500"
                style={{
                  backgroundColor: activeTab === "outsourcing" ? "#00AFA9" : "transparent",
                  color: activeTab === "outsourcing" ? "#fff" : "#0B1D2060",
                  boxShadow: activeTab === "outsourcing" ? "0 4px 20px -4px #00AFA950" : "none",
                }}
              >
                Outsourcing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("consulting")}
                className="relative rounded-full px-7 py-2.5 text-[13px] font-semibold tracking-wide transition-all duration-500"
                style={{
                  backgroundColor: activeTab === "consulting" ? "#FFA900" : "transparent",
                  color: activeTab === "consulting" ? "#0B1D20" : "#0B1D2060",
                  boxShadow: activeTab === "consulting" ? "0 4px 20px -4px #FFA90050" : "none",
                }}
              >
                Consulting
              </button>
            </div>
          </div>

          {/* Cartes d'offres — Apple-style minimaliste */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const accent = activeTab === "outsourcing" ? "#00AFA9" : "#FFA900";
              const subtitles = activeTab === "outsourcing"
                ? ["Équipe dédiée, performance garantie", "Solutions évolutives, résultats mesurés", "Partenaire stratégique, croissance partagée"]
                : ["Comprendre pour mieux agir", "Digitaliser pour accélérer", "Piloter pour exceller"];
              return (
                <Link
                  key={offer.id}
                  href={`/oc_init/${offer.id}`}
                  className="group flex flex-col items-center text-center py-14 px-8 transition-all duration-500 hover:bg-[#F8F7F4] rounded-3xl"
                >
                  <h3
                    className="text-[22px] md:text-[24px] font-bold leading-tight tracking-tight"
                    style={{ color: "#0B1D20" }}
                  >
                    {offer.label}
                  </h3>

                  <div className="mt-4 w-8 h-px transition-all duration-500 group-hover:w-12" style={{ backgroundColor: `${accent}40` }} />

                  <p className="mt-5 text-[14px] leading-relaxed font-light max-w-[240px]" style={{ color: "#0B1D2045" }}>
                    {subtitles[index]}
                  </p>

                  <span
                    className="mt-8 inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ color: accent }}
                  >
                    En savoir plus
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
 
      {/* CTA téléchargement */}
      <div className="w-full bg-teal-800 px-8 md:px-12 lg:px-16 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="text-xl font-bold text-white md:text-2xl">
            Téléchargez notre catalogue d&apos;offres
          </h2>
          <p className="mt-2 text-sm text-teal-100">
            Toutes nos solutions, nos méthodologies et des cas clients
            concrets dans un seul document.
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
              className="w-full rounded-full border border-transparent bg-white px-5 py-2.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-amber-500 disabled:opacity-60"
            >
              <Download size={16} />
              {status === "success" ? "Envoyé !" : "Téléchargez"}
            </button>
          </form>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-[#0B1D20]">
          <SecteursActivite />
      </div>
    </section>

  );
}
