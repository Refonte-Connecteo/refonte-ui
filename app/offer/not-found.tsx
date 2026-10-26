import Link from "next/link";
import {
  CONSULTING_EXPERTISES,
  OUTSOURCING_EXPERTISES,
  offerHref,
} from "@/lib/solutions";

const SECTIONS = [
  { parent: "Outsourcing", anchor: "/outs", expertises: OUTSOURCING_EXPERTISES },
  { parent: "Consulting", anchor: "/cons", expertises: CONSULTING_EXPERTISES },
];

export default function OfferNotFound() {
  return (
    <main className="min-h-screen bg-[#cfe0e3] pt-25 px-6 py-10 font-sans text-[#0b5f73] md:px-16">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Fil d'Ariane">
          <Link
            href="/outs"
            className="inline-block rounded-full bg-[#00b0ac] px-6 py-3 text-xs font-bold text-[#0b5f73] transition-colors hover:bg-[#00c2bd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5f73]"
          >
            Outsourcing / Consulting
          </Link>
        </nav>

        <header className="mt-14">
          <h1 className="text-3xl md:text-4xl">Offre introuvable</h1>
          <p className="mt-2 max-w-md text-xl leading-snug md:text-2xl">
            Cette page n&apos;existe pas ou plus. Retrouvez ci-dessous
            l&apos;ensemble de nos offres.
          </p>
        </header>

        {SECTIONS.map((section) => (
          <section key={section.parent} className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold">{section.parent}</h2>
              <Link
                href={section.anchor}
                className="text-sm font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5f73]"
              >
                Voir toutes les offres {section.parent}
              </Link>
            </div>

            <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.expertises.map((expertise) =>
                expertise.offers.map((offer) => (
                  <li key={offerHref(expertise.slug, offer.slug)}>
                    <Link
                      href={offerHref(expertise.slug, offer.slug)}
                      className="text-sm leading-snug hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5f73]"
                    >
                      {offer.title}
                    </Link>
                    <p className="mt-1 text-xs text-[#0b5f73]/70">
                      {expertise.label}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
