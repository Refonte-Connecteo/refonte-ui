"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Job = {
  slug: string;
  title: string;
  location: string;
  contract: string;
};

// 👉 La maquette montre 6 fois la même offre : remplacez par vos vraies offres
// (ou chargez-les depuis votre API).
const JOBS: Job[] = Array.from({ length: 6 }, (_, i) => ({
  slug: `conseiller-clientele-bilingue-${i + 1}`,
  title: "Conseiller·e clientèle bilingue FR/EN",
  location: "Antananarivo",
  contract: "CDI",
}));

// 👉 À brancher sur votre backend (ex. POST /api/candidatures sur votre API Express).
// Pour l'instant, la fonction se contente de réussir après un court délai.
async function submitApplication(data: Record<string, FormDataEntryValue>) {
  console.log("Candidature spontanée", data);
  await new Promise((resolve) => setTimeout(resolve, 600));
}

function ArrowUpRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="34"
      strokeLinecap="round"
    >
      <path d="M100 20v160M43 43l114 114M43 157L157 43M20 100h160" />
    </svg>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 ml-3 block text-xs text-white">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="h-10 w-full rounded-full bg-[#a9c1c6]/80 px-4 text-sm text-[#0b4f5c] outline-none transition-colors focus:bg-[#c8dadd] focus:ring-2 focus:ring-[#f5a30f]"
      />
    </div>
  );
}

export default function CareersSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      await submitApplication(Object.fromEntries(new FormData(form)));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b6171] px-6 py-14 font-sans text-white md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Titre */}
        <header className="text-center mt-20">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Devenez acteur·rice de l&apos;expérience client africaine.
          </h1>
          <h2 className="mt-8 text-sm font-bold">Postes à pourvoir</h2>
        </header>

        {/* Offres d'emploi */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {JOBS.map((job) => (
            <li key={job.slug}>
              <Link
                href={`/carrieres/${job.slug}`}
                className="group flex min-h-[5.5rem] items-center justify-between gap-4 rounded-[3.75rem] bg-[#00aeaa] px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00bdb8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="text-sm leading-snug p-1.5">
                  <span className="block max-w-[14rem] font-bold">
                    {job.title}
                  </span>
                  <span className="mt-0.5 block">
                    {job.location} · {job.contract}
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Candidature spontanée */}
        <section
          aria-labelledby="spontanee-title"
          className="relative mt-20 grid items-center gap-10 lg:mt-28 lg:grid-cols-[1fr_1.1fr] lg:gap-6"
        >
          <Asterisk className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 text-[#00aeaa] opacity-40 lg:bottom-auto lg:left-[26%] lg:right-auto lg:top-1/2 lg:h-[28rem] lg:w-[28rem] lg:-translate-y-1/2 lg:opacity-100" />

          <div className="relative z-10 max-w-md">
            <h2 id="spontanee-title" className="text-2xl font-bold sm:text-3xl">
              Candidature spontanée
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              Vous ne trouvez pas l&apos;offre qui vous correspond ?
              Présentez-vous, nous reviendrons vers vous.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-[2rem] border border-white/20 bg-[#0b4f5c]/70 p-6 shadow-xl backdrop-blur-xs md:p-8"
          >
            <div className="grid gap-x-9 gap-y-5 sm:grid-cols-2">
              <Field id="nom" label="Nom" autoComplete="family-name" required />
              <Field id="prenoms" label="Prénoms" autoComplete="given-name" required />
              <Field id="email" label="E-mail" type="email" autoComplete="email" required />
              <Field id="telephone" label="Téléphone" type="tel" autoComplete="tel" />
              <Field id="societe" label="Société" autoComplete="organization" />
              <Field id="pays" label="Pays" autoComplete="country-name" />

              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-1.5 ml-3 block text-xs text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full resize-none rounded-3xl bg-[#a9c1c6]/80 px-4 py-3 text-sm text-[#0b4f5c] outline-none transition-colors focus:bg-[#c8dadd] focus:ring-2 focus:ring-[#f5a30f]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p role="status" aria-live="polite" className="text-sm">
                {status === "sent" && "Merci ! Nous reviendrons vers vous."}
                {status === "error" &&
                  "Une erreur est survenue, merci de réessayer."}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-[#f5a30f] px-7 py-2.5 text-sm font-bold text-[#0b4f5c] transition-colors hover:bg-[#e09400] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
              >
                {status === "sending" ? "Envoi…" : "Envoyer"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}