import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="relative w-full bg-[#0B1D20] py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-3xl bg-[#00AFA9]" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl bg-[#FFA900]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold text-white tracking-tight">
          Construisons votre prochaine<br />
          <span style={{ color: "#00AFA9" }}>expérience ensemble.</span>
        </h2>

        <p className="mt-6 text-base md:text-lg lg:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
          Parlons de vos enjeux. Notre équipe revient vers vous sous 48h.
        </p>

        <div className="mt-10 md:mt-12">
          <Link
            href="#"
            className="group inline-flex items-center gap-3 rounded-full bg-[#FFA900] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-gray-900 transition-all duration-500 hover:bg-[#00AFA9] hover:text-white hover:shadow-2xl hover:shadow-[#00AFA9]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:scale-110">
              <svg
                className="ml-0.5 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
            Contactez-nous
          </Link>
        </div>
      </div>
    </section>
  );
}
