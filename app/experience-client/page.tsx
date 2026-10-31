"use client";

import SecteursActivite from "../components/SecteursActivite";
 
import Image from "next/image";
import { useState, FormEvent } from "react";
import { Download } from "lucide-react";
import Reveal from "../components/Reveal";

export default function ExperienceClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );
 
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
      <div className="relative flex h-[340px] w-full items-center overflow-hidden pt-20 md:h-[440px] md:pt-24">
        <Image
          src="/images/c3.jpg"
          alt="Équipe CONNECTEO"
          fill
          priority
          className="hero-settle object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D20]/80 via-[#0B1D20]/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-5">
          <span className="cons-fade inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 mb-4">
            Nos Solutions
          </span>
          <h1
            className="cons-fade max-w-xl text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white"
            style={{ animationDelay: "120ms" }}
          >
            Des offres au service de <br className="hidden md:block" />votre croissance.
          </h1>
        </div>
      </div>
 
      {/* CTA téléchargement */}
      <div className="flex items-center justify-center bg-[#0B1D20] xl:min-h-screen">
          <SecteursActivite />
      </div>
      <div
        id="catalogue-offres"
        className="w-full scroll-mt-24 bg-teal-800 px-6 md:px-12 lg:px-16 py-14 md:py-20"
      >
        <Reveal className="mx-auto flex max-w-xl flex-col items-center text-center">
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
              className="w-full rounded-full border border-transparent bg-white px-5 py-3 text-sm text-neutral-700 outline-none transition-shadow placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-500 hover:shadow-lg active:translate-y-0 active:scale-[0.98] disabled:opacity-60"
            >
              <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              {status === "success" ? "Envoyé !" : "Téléchargez"}
            </button>
          </form>
        </Reveal>
      </div>


    </section>

  );
}
