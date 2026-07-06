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
    // TODO: brancher sur l'API d'envoi du catalogue
    setTimeout(() => setStatus("success"), 800);
  };

  return (
     <section className="w-full">
      {/* Hero */}
      <div className="relative flex h-[260px] w-full items-center overflow-hidden md:h-[320px]">
        <Image
          src="/images/c3.jpg"
          alt="Équipe CONNECTEO"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 max-w-md px-8">
          <h1 className="text-2xl font-bold leading-snug text-white md:text-3xl">
            Des offres au service de votre croissance.
          </h1>
        </div>
      </div>
 
      {/* Tabs + contenu */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-center gap-10 border-b border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab("outsourcing")}
            className={`relative pb-4 text-lg font-bold transition-colors ${
              activeTab === "outsourcing"
                ? "text-amber-500"
                : "text-neutral-300 hover:text-neutral-400"
            }`}
          >
            Outsourcing
            {activeTab === "outsourcing" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-amber-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("consulting")}
            className={`relative pb-4 text-lg font-bold transition-colors ${
              activeTab === "consulting"
                ? "text-amber-500"
                : "text-neutral-300 hover:text-neutral-400"
            }`}
          >
            Consulting
            {activeTab === "consulting" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-amber-500" />
            )}
          </button>
        </div>
 
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-500">
          {activeTab === "outsourcing"
            ? "Externalisation de la relation client multicanale : voix, chat, mail, réseaux sociaux. Plateaux dédiés, équipes formées, pilotage qualité."
            : "Accompagnement stratégique et opérationnel pour structurer, outiller et faire monter en compétence vos équipes."}
        </p>
 
        <div className="mt-8 flex flex-wrap gap-3">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/oc_init/${offer.id}`}
              className="rounded-full bg-neutral-100 px-5 py-3 text-sm font-semibold text-teal-800 transition-colors hover:bg-neutral-200"
            >
              {offer.label}
            </Link>
          ))}
        </div>
      </div>
 
      {/* CTA téléchargement */}
      <div className="w-full bg-teal-800 px-6 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="text-xl font-bold text-white md:text-2xl">
            Téléchargez notre catalogue d&apos;offres
          </h2>
          <p className="mt-2 text-sm text-teal-100">
            Toutes nos solutions, nos méthodologies et des cas clients
            concrets dans un seul document..
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
