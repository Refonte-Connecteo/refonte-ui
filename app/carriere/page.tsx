"use client";

import { api } from "@/lib/api";
import { useState, useEffect, type FormEvent } from "react";

export default function Carriere() {
  const [offres, setOffres] = useState<{id: number; poste: string; lieu: string; contrat: string; description: string}[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", poste: "", message: "" });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    api.getActiveJobPostings().then((res) => {
      const mapped = res.jobPostings.map(j => ({
        id: j.id,
        poste: j.title,
        lieu: "Antananarivo",
        contrat: j.contract_type,
        description: j.description || "",
      }));
      setOffres(mapped);
    }).catch(() => {});
  }, []);

  const handleSelectJob = (id: number, poste: string) => {
    setSelectedJobId(id);
    setFormData(prev => ({ ...prev, poste }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);
    try {
      let cvUrl = "";
      if (cvFile) {
        const uploadResult = await api.uploadFile(cvFile);
        cvUrl = uploadResult.url;
      }
      const nameParts = formData.nom.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      if (selectedJobId) {
        await api.createApplication({
          job_id: selectedJobId,
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          phone: formData.telephone || undefined,
          cv_url: cvUrl,
          cover_letter: formData.message || undefined,
        });
      } else {
        await api.createSpontaneousApplication({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          phone: formData.telephone || undefined,
          cv_url: cvUrl,
          motivation: formData.message || undefined,
        });
      }
      setFormSuccess("Votre candidature a été envoyée avec succès !");
      setFormData({ nom: "", email: "", telephone: "", poste: "", message: "" });
      setCvFile(null);
      setSelectedJobId(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#096475]">
      <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="relative px-10 pt-24 pb-16 md:pt-28 md:pb-20 md:pr-16 md:pl-14 lg:pr-20 xl:pr-28 flex flex-col overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="absolute -top-40 -right-32 w-72 h-72 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-16 w-56 h-56 rounded-full bg-[#FFA900]/[0.06] blur-3xl pointer-events-none" />

          <div className="relative mb-10">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 text-[#FFA900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Rejoignez-nous
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Offres <span className="text-[#FFA900]">en cours</span>
            </h2>
            <p className="text-sm text-white/50 mt-1.5 max-w-xs">
              {offres.length} postes à pourvoir — trouvez celui qui vous correspond.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
            {offres.map((offre, index) => (
              <button
                key={offre.id}
                type="button"
                onClick={() => handleSelectJob(offre.id, offre.poste)}
                className={`group relative w-full text-left rounded-xl transition-all duration-500 cursor-pointer overflow-hidden border hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.12)] ${
                  selectedJobId === offre.id
                    ? "bg-[#FFA900] border-[#FFA900]/30"
                    : "bg-white hover:bg-white border-white/10 hover:border-[#FFA900]/30"
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00AFA9] to-[#FFA900] group-hover:from-[#FFA900] group-hover:to-[#00AFA9] transition-all duration-500" />
                <div className="flex flex-col h-full p-5 pl-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm md:text-base font-bold text-[#0B1D20] group-hover:text-[#00AFA9] transition-colors duration-300 leading-snug line-clamp-2 flex-1">
                      {offre.poste}
                    </h3>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#096475]/10 text-[#096475] group-hover:bg-[#FFA900]/10 group-hover:text-[#FFA900] transition-all duration-300">
                      {offre.contrat}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#0B1D20]/40 mb-3">
                    <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{offre.lieu}</span>
                  </div>
                  <p className="text-xs text-[#0B1D20]/50 leading-relaxed line-clamp-3 flex-1">
                    {offre.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#0B1D20]/5">
                    <span className="text-[10px] font-mono font-medium text-[#0B1D20]/15">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-[#0B1D20]/20 group-hover:text-[#00AFA9] transition-all duration-300 group-hover:gap-1.5">
                      Postuler
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden flex items-center justify-center md:justify-start px-10 md:py-0 md:pl-16 md:pr-14 lg:pl-20 xl:pl-52 h-full" style={{ clipPath: "ellipse(85% 90% at 95% 50%)", backgroundColor: "#ffffff" }}>
          <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-[#0B1D20]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#00AFA9]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-56 h-56 rounded-full bg-[#096475]/[0.02] blur-2xl pointer-events-none" />

          <div className="relative max-w-lg w-full pt-24 pb-16 md:pt-28 md:pb-20">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#0B1D20] leading-[1.08] tracking-tight">
              Façonnez l&apos;avenir de l&apos;expérience client en Afrique avec nous
            </h1>

            <div className="pt-10 border-t border-[#0B1D20]/10">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1D20]/40 mb-6">
                {selectedJobId ? `Candidature — ${formData.poste}` : "Candidature spontanée"}
              </span>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {formSuccess && (
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{formSuccess}</div>
                )}
                {formError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{formError}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="border border-gray-300 w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Nom & prénom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    className="border border-gray-300 w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    className="border border-gray-300 w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Téléphone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                  <input
                    type="text"
                    className="border border-gray-300 w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Poste recherché"
                    value={formData.poste}
                    onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <label className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus-within:ring-2 focus-within:ring-[#FFA900]/60 cursor-pointer hover:bg-[#eae9e5]">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm">{cvFile ? cvFile.name : "Joindre mon CV"}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                <textarea
                  rows={3}
                  className="border border-gray-300 w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white resize-none"
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full rounded-full bg-[#FFA900] text-[#0B1D20] font-semibold py-3 text-sm tracking-wide transition-all duration-300 hover:bg-[#e89e00] active:scale-[0.98] shadow-lg shadow-[#FFA900]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Envoi en cours..." : "Envoyer ma candidature"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
