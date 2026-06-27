"use client";

const offres = [
  {
    poste: "Chargé·e de Recrutement",
    lieu: "Antananarivo",
    contrat: "CDI",
    description: "Identifier et recruter les talents qui feront la différence, en déployant une stratégie d&apos;acquisition innovante.",
  },
  {
    poste: "Consultant·e RH Junior",
    lieu: "Antananarivo",
    contrat: "CDI",
    description: "Accompagner nos clients dans leur stratégie RH et les conseiller sur les meilleures pratiques.",
  },
  {
    poste: "Business Developer",
    lieu: "Antananarivo",
    contrat: "CDI",
    description: "Développer notre portefeuille clients et nouer des partenariats stratégiques à fort impact.",
  },

];

export default function Carriere() {
  return (
    <div className="h-screen bg-[#096475]">
      <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="relative px-8 pt-24 pb-16 md:pt-28 md:pb-20 md:pr-12 md:pl-10 lg:pr-16 xl:pr-24 flex flex-col overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                key={offre.poste}
                className="group relative w-full text-left bg-white hover:bg-white rounded-xl transition-all duration-500 cursor-pointer overflow-hidden border border-white/10 hover:border-[#FFA900]/30 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.12)]"
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

        <div className="relative overflow-hidden flex items-center justify-center md:justify-start px-8 md:py-0 md:pl-12 md:pr-10 lg:pl-16 xl:pl-48 h-full" style={{ clipPath: "ellipse(85% 90% at 95% 50%)", backgroundColor: "#ffffff" }}>
          <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-[#0B1D20]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#00AFA9]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-56 h-56 rounded-full bg-[#096475]/[0.02] blur-2xl pointer-events-none" />

          <div className="relative max-w-lg w-full pt-24 pb-16 md:pt-28 md:pb-20">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#0B1D20] leading-[1.08] tracking-tight">
              Devenez acteur-rice de l&apos;expérience client africaine.
            </h1>

            <div className="pt-10 border-t border-[#0B1D20]/10">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1D20]/40 mb-6">
                Candidature spontanée
              </span>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Nom &amp; prénom"
                  />
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Email"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Téléphone"
                  />
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white"
                    placeholder="Poste recherché"
                  />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFA900] file:text-[#0B1D20] hover:file:bg-[#e89e00]"
                  />
                </div>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#f2f1ed] text-[#0B1D20] placeholder-[#0B1D20]/30 text-sm transition-all duration-300 outline-none ring-1 ring-[#0B1D20]/5 focus:ring-2 focus:ring-[#FFA900]/60 focus:bg-white resize-none"
                  placeholder="Message"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#FFA900] text-[#0B1D20] font-semibold py-3 text-sm tracking-wide transition-all duration-300 hover:bg-[#e89e00] active:scale-[0.98] shadow-lg shadow-[#FFA900]/30"
                >
                  Envoyer ma candidature
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
