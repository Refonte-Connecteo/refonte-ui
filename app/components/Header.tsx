"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Notre ADN", href: "#" },
  { label: "Expérience Client", href: "#" },
  { label: "Carrière", href: "#" },
  { label: "Actus & Événement", href: "#" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "top-3 mx-4 md:top-4 md:mx-8 lg:mx-auto lg:left-6 lg:right-6 xl:left-0 xl:right-0 xl:max-w-7xl xl:mx-auto rounded-2xl  backdrop-blur-3xl shadow-xl shadow-black/5 border border-white/20"
          : "top-0 bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "px-5 py-3 md:px-8 md:py-3"
            : "px-6 py-4 max-w-7xl"
        }`}
      >
              <a href="#" className="shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="h-15 w-auto transition-transform duration-300 hover:scale-105"
                />
              </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-sm font-medium transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#FFA900] after:transition-all after:duration-300 hover:after:w-full ${
                scrolled ? "text-white hover:text-white" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className={`inline-block rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
              scrolled
                ? "bg-[#FFA900] text-gray-900 hover:bg-[#00AFA9] hover:text-white hover:shadow-lg hover:shadow-[#00AFA9]/30"
                : "border border-white/30 text-white hover:bg-white hover:text-gray-900"
            }`}
          >
            Contactez-nous
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span
            className={`block h-0.5 w-6 transition-all duration-300 ${
              scrolled ? "bg-gray-700" : "bg-white"
            } ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 transition-all duration-300 ${
              scrolled ? "bg-gray-700" : "bg-white"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 transition-all duration-300 ${
              scrolled ? "bg-gray-700" : "bg-white"
            } ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4 bg-white/90 backdrop-blur-xl px-6 pb-6 pt-2 shadow-lg rounded-b-2xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-[#00AFA9]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="self-start rounded-full bg-[#FFA900] px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-[#00AFA9] hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Contactez-nous
          </a>
        </nav>
      </div>
    </header>
  );
}
