import Link from "next/link";

const navLinks = [
  { label: "Notre ADN", href: "#" },
  { label: "Expérience Client", href: "#" },
  { label: "Carrière", href: "#" },
  { label: "Actus & Événement", href: "#" },
  { label: "Notre Réseau", href: "#" },
  { label: "FAQ", href: "#" },
];

const serviceLinks = [
  { label: "Recrutement & Sélection", href: "#" },
  { label: "Intérim & CDD", href: "#" },
  { label: "Formation & Conseil", href: "#" },
  { label: "Évaluation des Talents", href: "#" },
  { label: "Outsourcing RH", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D1117] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
              <a href="#" className="shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="h-15 w-auto transition-transform duration-300 hover:scale-105"
                />
              </a>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              Connecter les talents aux opportunités, avec une approche humaine et sur-mesure.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#00AFA9] hover:bg-[#00AFA9]/10 hover:text-[#00AFA9]"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#00AFA9] hover:bg-[#00AFA9]/10 hover:text-[#00AFA9]"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-[#00AFA9]"
                  >
                    {link.label}
                  </Link>
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
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-[#00AFA9]"
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
                <span>123 Avenue des Champs-Élysées, 75008 Paris</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#00AFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#00AFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@connecteo.fr" className="transition-colors hover:text-[#00AFA9]">
                  contact@connecteo.fr
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-white/30 mb-2">Membre du</p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors duration-200 hover:text-[#FFA900]"
              >
                Groupe AXIAN
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} CONNECTEO. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Mentions légales
            </a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Politique de confidentialité
            </a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
