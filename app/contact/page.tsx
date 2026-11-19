"use client";

import { api } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/contact";
import { checkDocument, DOCUMENT_EXTENSIONS } from "@/lib/documentFile";
import { useRef, useState, type FormEvent } from "react";
import Honeypot, { HONEYPOT_FIELD } from "@/app/components/Honeypot";

const LABEL_CLASS = "block text-xs font-semibold tracking-wide text-[#0B1D20]/60 uppercase";
const FIELD_CLASS =
  "border border-gray-400 w-full px-4 py-3.5 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/25 text-sm transition-all duration-300 outline-none ring-1 ring-transparent hover:border-gray-500 focus:border-[#00AFA9] focus:ring-2 focus:ring-[#00AFA9]/30 focus:bg-white focus:shadow-lg focus:shadow-[#00AFA9]/10";

const EMPTY_FORM = { nom: "", prenom: "", email: "", telephone: "", societe: "", pays: "", message: "" };

type TextKey = Exclude<keyof typeof EMPTY_FORM, "message">;

/** Champs texte, par paires (deux colonnes sur grand écran). Longueurs maximales identiques à l'API. */
const FIELDS: {
  key: TextKey;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete: string;
  maxLength: number;
  placeholder: string;
}[] = [
  { key: "nom", label: "Nom", required: true, autoComplete: "family-name", maxLength: 100, placeholder: "Votre nom" },
  { key: "prenom", label: "Prénom(s)", required: true, autoComplete: "given-name", maxLength: 100, placeholder: "Votre prénom" },
  { key: "email", label: "Email", required: true, type: "email", autoComplete: "email", maxLength: 255, placeholder: "votre@email.com" },
  { key: "telephone", label: "Téléphone", type: "tel", autoComplete: "tel", maxLength: 30, placeholder: "+ …" },
  { key: "societe", label: "Société", autoComplete: "organization", maxLength: 200, placeholder: "Votre société" },
  { key: "pays", label: "Pays", autoComplete: "country-name", maxLength: 100, placeholder: "Madagascar" },
];

/** Astérisque visuel : les lecteurs d'écran s'appuient sur l'attribut `required` du champ. */
const Required = () => (
  <span aria-hidden="true" className="ml-0.5 text-[#c2410c]">
    *
  </span>
);

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAttachmentChange = (file: File | null) => {
    setAttachmentError("");
    const problem = file && checkDocument(file, "La pièce jointe");
    if (!file || problem) {
      if (problem) setAttachmentError(problem);
      clearAttachment();
      return;
    }
    setAttachment(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const website = String(new FormData(e.currentTarget as HTMLFormElement).get(HONEYPOT_FIELD) ?? "");
      const attachmentUrl = attachment ? (await api.uploadContactAttachment(attachment)).url : undefined;
      await api.createContactMessage({
        first_name: formData.prenom.trim(),
        last_name: formData.nom.trim(),
        email: formData.email.trim(),
        phone: formData.telephone || undefined,
        company: formData.societe || undefined,
        country: formData.pays || undefined,
        message: formData.message,
        attachment_url: attachmentUrl,
        website,
      });
      setSuccess("Votre message a été envoyé avec succès !");
      setFormData(EMPTY_FORM);
      clearAttachment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div
          className="relative overflow-hidden flex items-center justify-center md:justify-start rounded-b-[3rem] px-6 pt-32 pb-14 sm:px-10 md:rounded-none md:[clip-path:ellipse(90%_90%_at_0%_50%)] md:pb-16 md:pl-10 md:pr-20 lg:pl-16 xl:pl-24"
          style={{ backgroundColor: "#096475" }}
        >
          <div className="halo-drift absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#0B1D20]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-white/[0.02] blur-2xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-32 h-32 rounded-full bg-white/[0.03] blur-xl pointer-events-none" />

          <div className="relative max-w-lg">
            {/* <span className="cons-fade inline-block text-[#FFA900] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Contact
            </span> */}
            <h1
              className="cons-fade text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.08] tracking-tight"
              style={{ animationDelay: "100ms" }}
            >
              Devenons partenaires de votre excellence opérationnelle
            </h1>

            <div
              className="cons-fade mt-10 pt-8 md:mt-14 md:pt-10 border-t border-white/15"
              style={{ animationDelay: "200ms" }}
            >
              {/* <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
                Parlons de votre projet
              </span> */}
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                Décrivez votre besoin
              </h2>
              {/* <p className="text-white/65 leading-relaxed mt-2 max-w-sm">
                Notre équipe vous répond sous 48&nbsp;h ouvrées.
              </p> */}
            </div>

            {/* <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#FFA900]"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {CONTACT_EMAIL}
            </a> */}
          </div>
        </div>

        <div className="px-6 py-12 sm:px-10 md:pt-32 md:pb-16 md:pr-10 md:pl-8 lg:pr-20 xl:pr-24 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="cons-fade relative w-full max-w-lg space-y-5"
            style={{ animationDelay: "150ms" }}
          >
            <Honeypot />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label htmlFor={`contact-${f.key}`} className={LABEL_CLASS}>
                    {f.label}
                    {f.required && <Required />}
                  </label>
                  <input
                    id={`contact-${f.key}`}
                    required={f.required}
                    type={f.type ?? "text"}
                    autoComplete={f.autoComplete}
                    maxLength={f.maxLength}
                    className={FIELD_CLASS}
                    placeholder={f.placeholder}
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className={LABEL_CLASS}>
                Message
                <Required />
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                maxLength={5000}
                className={`${FIELD_CLASS} resize-none`}
                placeholder="Décrivez votre besoin ou votre projet de collaboration"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-attachment" className={LABEL_CLASS}>
                Pièce jointe <span className="font-normal normal-case tracking-normal">(facultatif)</span>
              </label>
              <div className="flex items-center gap-2">
                <label
                  className={`${FIELD_CLASS} flex min-w-0 cursor-pointer items-center gap-2 focus-within:border-[#00AFA9] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00AFA9]/30`}
                >
                  <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-[#096475]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className={`truncate ${attachment ? "" : "text-[#0B1D20]/40"}`}>
                    {attachment ? attachment.name : "Joindre un document"}
                  </span>
                  <input
                    id="contact-attachment"
                    ref={fileInputRef}
                    type="file"
                    accept={DOCUMENT_EXTENSIONS.join(",")}
                    aria-describedby="contact-attachment-hint"
                    className="sr-only"
                    onChange={(e) => handleAttachmentChange(e.target.files?.[0] ?? null)}
                  />
                </label>
                {attachment && (
                  <button
                    type="button"
                    onClick={clearAttachment}
                    className="shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-[#096475] transition-colors hover:bg-[#096475]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AFA9]"
                  >
                    Retirer
                  </button>
                )}
              </div>
              <p id="contact-attachment-hint" className="text-xs text-[#0B1D20]/60">
                Pour une demande de collaboration : cahier des charges, présentation… PDF, DOC ou DOCX, 5&nbsp;Mo maximum.
              </p>
              {attachmentError && (
                <p role="alert" className="text-xs text-red-700">
                  {attachmentError}
                </p>
              )}
            </div>

            <p className="text-xs text-[#0B1D20]/60">
              <span aria-hidden="true" className="text-[#c2410c]">*</span> Champs obligatoires. Vos informations
              servent uniquement à traiter votre demande.
            </p>

            {success && (
              <div role="status" className="menu-item-in rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div role="alert" className="menu-item-in rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-full bg-[#FFA900] text-[#0B1D20] font-semibold py-3.5 text-sm tracking-wide transition-all duration-300 hover:bg-[#e89e00] active:scale-[0.98] shadow-lg shadow-[#FFA900]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{loading ? "Envoi en cours…" : "Envoyer"}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
