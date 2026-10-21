import Link from "next/link";
import type { OfferDetail } from "@/lib/solutions";

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 16"
      className="h-4 w-8 shrink-0 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 8h30M23 1l7 7-7 7" />
    </svg>
  );
}

export default function OfferDetailView({ offer }: { offer: OfferDetail }) {
  const isConsulting = offer.parent === "Consulting";

  const mainClass = isConsulting
    ? "min-h-screen bg-[#F2ECE5] pt-25 px-6 py-10 font-sans text-[#0b5f73] md:px-16"
    : "min-h-screen bg-[#cfe0e3] pt-25 px-6 py-10 font-sans text-[#0b5f73] md:px-16";
  const breadcrumbClass = isConsulting
    ? "inline-block rounded-full bg-[#FFA900] px-6 py-3 text-xs font-bold text-[#0b5f73] transition-colors hover:bg-[#ffaa00c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5f73]"
    : "inline-block rounded-full bg-[#00b0ac] px-6 py-3 text-xs font-bold text-[#0b5f73] transition-colors hover:bg-[#00c2bd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5f73]";

  return (
    <main className={mainClass}>
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Fil d'Ariane">
          <Link href={offer.parentAnchor} className={breadcrumbClass}>
            {offer.parent} / {offer.parentLabel}
          </Link>
        </nav>

        <header className="mt-14">
          <h1 className="text-3xl md:text-4xl">{offer.title}</h1>
          <p className="mt-2 max-w-md text-xl leading-snug md:text-2xl">
            {offer.tagline}
          </p>
        </header>

        <section className="mt-14 flex flex-col gap-4 md:flex-row md:items-start md:gap-0">
          <div className="relative z-10 flex flex-col rounded-3xl bg-[#0b5f73] p-7 text-white shadow-lg md:min-h-[20rem] md:w-[30%] md:shrink-0 md:-mr-6">
            <h2 className="max-w-[10rem] text-2xl leading-snug">
              {offer.scopeTitle}
            </h2>
            <p className="mt-8 text-xs leading-relaxed md:mt-auto">
              {offer.scopeText}
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[2rem] bg-[#a9bcc0] p-7 md:mt-4 md:min-h-[22rem] md:flex-1 md:py-9 md:pl-14 md:pr-10">
            <div className="text-sm leading-relaxed">
              <h3 className="font-bold">Modalités</h3>
              <p className="mt-2 max-w-lg">{offer.modalities}</p>

              <h3 className="mt-6 font-bold">Bénéfices clés :</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {offer.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href={offer.cta.href}
                className="rounded-full bg-[#f5a30f] px-6 py-3 text-sm font-bold text-[#0b5f73] transition-colors hover:bg-[#e09400] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5f73]"
              >
                {offer.cta.label}
              </Link>
            </div>
          </div>
        </section>

        {offer.related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold">Même expertise</h2>
            <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {offer.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="group flex items-center justify-between gap-6 text-sm leading-snug hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5f73]"
                  >
                    <span className="max-w-[14rem]">{r.label}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
