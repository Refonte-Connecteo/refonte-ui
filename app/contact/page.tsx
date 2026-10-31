"use client";

import { api } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/contact";
import { useState, type FormEvent } from "react";

const LABEL_CLASS = "block text-xs font-semibold tracking-wide text-[#0B1D20]/60 uppercase";
const FIELD_CLASS =
  "border border-gray-400 w-full px-4 py-3.5 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/25 text-sm transition-all duration-300 outline-none ring-1 ring-transparent hover:border-gray-500 focus:border-[#00AFA9] focus:ring-2 focus:ring-[#00AFA9]/30 focus:bg-white focus:shadow-lg focus:shadow-[#00AFA9]/10";

export default function Contact() {
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", societe: "", pays: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const nameParts = formData.nom.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      // Beaucoup de personnes n'ont qu'un seul nom : l'API exige les deux champs.
      const lastName = nameParts.slice(1).join(" ") || "-";
      await api.createContactMessage({
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.telephone || undefined,
        company: formData.societe || undefined,
        country: formData.pays || undefined,
        message: formData.message,
      });
      setSuccess("Votre message a été envoyé avec succès !");
      setFormData({ nom: "", email: "", telephone: "", societe: "", pays: "", message: "" });
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
            className="cons-fade w-full max-w-lg space-y-5"
            style={{ animationDelay: "150ms" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-nom" className={LABEL_CLASS}>
                  Nom &amp; prénom
                </label>
                <input
                  id="contact-nom"
                  required
                  type="text"
                  autoComplete="name"
                  className={FIELD_CLASS}
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  autoComplete="email"
                  className={FIELD_CLASS}
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-telephone" className={LABEL_CLASS}>
                  Téléphone
                </label>
                <input
                  id="contact-telephone"
                  type="tel"
                  autoComplete="tel"
                  className={FIELD_CLASS}
                  placeholder=""
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-societe" className={LABEL_CLASS}>
                  Société
                </label>
                <input
                  id="contact-societe"
                  type="text"
                  autoComplete="organization"
                  className={FIELD_CLASS}
                  placeholder="Votre société"
                  value={formData.societe}
                  onChange={(e) => setFormData({ ...formData, societe: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-pays" className={LABEL_CLASS}>
                  Pays
                </label>
                <input
                  id="contact-pays"
                  type="text"
                  autoComplete="country-name"
                  className={FIELD_CLASS}
                  placeholder="Madagascar"
                  value={formData.pays}
                  onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className={LABEL_CLASS}>
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                className={`${FIELD_CLASS} resize-none`}
                placeholder="En quoi puis-je vous aider&nbsp;?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

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
