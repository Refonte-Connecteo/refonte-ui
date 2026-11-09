import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/notre-adn/a-propos" },
  { label: "Impact & Sustainability", href: "/impact" },
  { label: "AXIAN Group", href: "https://www.axian.com" },
];

const serviceLinks = [
  { label: "Outsourcing", href: "/outs" },
  { label: "Consulting", href: "/cons" },
  { label: "Catalogues d'offres", href: "/experience-client#catalogue-offres" },
  { label: "Secteurs d'activité", href: "/experience-client#secteurs-activite" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D1117] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-6 pt-14 md:pt-16 pb-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
              <a href="/" className="shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="h-15 w-auto transition-transform duration-300 hover:scale-105"
                />
              </a>
            {/* <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              Connecter les talents aux opportunités, avec une approche humaine et sur-mesure.
            </p> */}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-white/50 transition-all duration-200 hover:translate-x-0.5 hover:text-[#00AFA9]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-white/50 transition-all duration-200 hover:translate-x-0.5 hover:text-[#00AFA9]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
              Nos services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/50 transition-all duration-200 hover:translate-x-0.5 hover:text-[#00AFA9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#00AFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a
                  href="https://maps.app.goo.gl/U3zmasSkBXVBvyVX9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#00AFA9]"
                >
                  Immeuble TANASHORE Zone FUTURA Andranomena
                </a>
        

              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#00AFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+261 34 10 110 10</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#00AFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-[#00AFA9]">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            {/* <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-white/30 mb-2"> Société du</p>
              <img
                src="/images/partenaire10.jpg"
                alt="Partenaire"
                className="h-10 w-auto"
              />
            </div> */}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} CONNECTEO. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Mentions légales
            </a>
            <span className="hidden text-white/10 sm:inline">·</span>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Politique de confidentialité
            </a>
            <span className="hidden text-white/10 sm:inline">·</span>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
