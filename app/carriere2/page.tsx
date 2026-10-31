"use client";

import { api } from "@/lib/api";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Reveal from "../components/Reveal";

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];

type Job = {
  id: number;
  poste: string;
  lieu: string;
  contrat: string;
  description: string;
};

type Status = "idle" | "sending" | "sent" | "error";

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
        className="h-11 w-full rounded-full bg-[#a9c1c6]/80 px-4 text-sm text-[#0b4f5c] outline-none transition-all duration-200 focus:bg-[#c8dadd] focus:ring-2 focus:ring-[#f5a30f]"
      />
    </div>
  );
}

export default function CareersSection() {
  const [offres, setOffres] = useState<Job[]>([]);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const applicationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .getActiveJobPostings()
      .then((res) => {
        if (cancelled) return;
        setOffres(
          res.jobPostings.map((job) => ({
            id: job.id,
            poste: job.title,
            lieu: "Antananarivo",
            contrat: job.contract_type,
            description: job.description || "",
          })),
        );
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setJobsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedJob = offres.find((job) => job.id === selectedJobId) ?? null;

  const handleSelectJob = (id: number) => {
    const isSelecting = selectedJobId !== id;
    setSelectedJobId(isSelecting ? id : null);
    setStatus("idle");
    setErrorMessage("");
    if (isSelecting) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      applicationRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  const handleCvChange = (file: File | null) => {
    setCvError("");
    if (!file) {
      setCvFile(null);
      return;
    }

    const ext = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
    if (!CV_EXTENSIONS.includes(ext)) {
      setCvError("Format de CV non supporté (PDF, DOC ou DOCX uniquement).");
      setCvFile(null);
      return;
    }

    if (file.size > MAX_CV_SIZE_BYTES) {
      setCvError("Le CV ne doit pas dépasser 5 Mo.");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!cvFile) {
      setCvError("Merci de joindre votre CV.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const { url: cvUrl } = await api.uploadCvPublic(cvFile);

      const basePayload = {
        first_name: (data.nom || "").trim(),
        last_name: (data.prenoms || "").trim(),
        email: (data.email || "").trim(),
        phone: (data.telephone || "").trim() || undefined,
        cv_url: cvUrl,
      };

      if (selectedJobId) {
        await api.createApplication({
          ...basePayload,
          job_id: selectedJobId,
          cover_letter: data.message || undefined,
        });
      } else {
        await api.createSpontaneousApplication({
          ...basePayload,
          motivation: data.message || undefined,
        });
      }

      form.reset();
      setCvFile(null);
      setSelectedJobId(null);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Une erreur est survenue, merci de réessayer.",
      );
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b6171] px-6 pb-14 pt-32 font-sans text-white md:px-12 md:pb-20 md:pt-36 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Titre */}
        <header className="text-center">
          <h1 className="cons-fade text-2xl font-bold sm:text-3xl md:text-4xl">
            Devenez acteur·rice de l&apos;expérience client africaine.
          </h1>
          <h2 className="cons-fade mt-8 text-sm font-bold" style={{ animationDelay: "100ms" }}>Postes à pourvoir</h2>
          <p className="cons-fade mt-2 text-sm text-white/70" style={{ animationDelay: "150ms" }}>
            {offres.length > 0
              ? `${offres.length} poste${offres.length > 1 ? "s" : ""} disponible${offres.length > 1 ? "s" : ""} — cliquez sur une offre pour postuler.`
              : jobsLoaded
                ? "Aucune offre disponible pour le moment."
                : "Chargement des offres…"}
          </p>
        </header>

        {/* Offres d'emploi */}
        {offres.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {offres.map((job, index) => {
              const isSelected = selectedJobId === job.id;
              return (
                <li key={job.id} className="cons-fade" style={{ animationDelay: `${index * 70}ms` }}>
                  <button
                    type="button"
                    onClick={() => handleSelectJob(job.id)}
                    aria-pressed={isSelected}
                    className={`group flex min-h-[5.5rem] w-full items-center justify-between gap-4 rounded-[3.75rem] border-2 px-6 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                      isSelected
                        ? "border-[#f5a30f] bg-[#00bdb8]"
                        : "border-transparent bg-[#00aeaa] hover:bg-[#00bdb8]"
                    }`}
                  >
                    <span className="text-sm leading-snug p-1.5">
                      <span className="block max-w-[14rem] font-bold">
                        {job.poste}
                      </span>
                      <span className="mt-0.5 block">
                        {job.lieu} · {job.contrat}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                        isSelected ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Candidature */}
        <section
          ref={applicationRef}
          aria-labelledby="candidature-title"
          className="relative mt-16 grid scroll-mt-28 items-center gap-8 lg:mt-24 lg:grid-cols-[1fr_1.1fr] lg:gap-6"
        >
          <Asterisk className="spin-slow pointer-events-none absolute -right-16 bottom-0 h-64 w-64 text-[#00aeaa] opacity-40 lg:bottom-auto lg:left-[26%] lg:right-auto lg:top-1/2 lg:h-[28rem] lg:w-[28rem] lg:-translate-y-1/2 lg:opacity-100" />

          <div className="relative z-10 max-w-md">
            <h2 id="candidature-title" className="text-2xl font-bold sm:text-3xl">
              {selectedJob ? "Candidature" : "Candidature spontanée"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              {selectedJob ? (
                <>
                  Vous postulez au poste de{" "}
                  <span className="font-bold text-white">{selectedJob.poste}</span>{" "}
                  ({selectedJob.lieu} · {selectedJob.contrat}). Complétez le
                  formulaire, nous reviendrons vers vous.
                </>
              ) : (
                <>
                  Vous ne trouvez pas l&apos;offre qui vous correspond ?
                  Présentez-vous, nous reviendrons vers vous.
                </>
              )}
            </p>
            {selectedJob && (
              <button
                type="button"
                onClick={() => setSelectedJobId(null)}
                className="mt-4 text-sm font-medium text-[#f5a30f] underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a30f]"
              >
                Revenir à une candidature spontanée
              </button>
            )}
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
                <label htmlFor="cv" className="mb-1.5 ml-3 block text-xs text-white">
                  CV (PDF, DOC ou DOCX — 5 Mo max)
                </label>
                <label
                  htmlFor="cv"
                  className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-full bg-[#a9c1c6]/80 px-4 text-sm text-[#0b4f5c] transition-colors hover:bg-[#c8dadd] focus-within:ring-2 focus-within:ring-[#f5a30f]"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span className="truncate">
                    {cvFile ? cvFile.name : "Joindre mon CV"}
                  </span>
                  <input
                    id="cv"
                    type="file"
                    accept={CV_EXTENSIONS.join(",")}
                    className="sr-only"
                    onChange={(e) => handleCvChange(e.target.files?.[0] ?? null)}
                  />
                </label>
                {cvError && (
                  <p className="mt-1.5 ml-3 text-xs text-[#ffd166]">{cvError}</p>
                )}
              </div>

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
                {status === "sent" &&
                  "Merci ! Votre candidature a été envoyée avec succès."}
                {status === "error" &&
                  (errorMessage || "Une erreur est survenue, merci de réessayer.")}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-shine relative shrink-0 overflow-hidden rounded-full bg-[#f5a30f] px-7 py-3 text-sm font-bold text-[#0b4f5c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e09400] hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
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
