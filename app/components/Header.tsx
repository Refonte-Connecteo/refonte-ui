"use client";

import { useState, useEffect, useRef } from "react";

const subMenuItems = [
  { label: "À propos de nous", href: "#" },
  { label: "Impact and Sustainability", href: "#" },
  { label: "AXIAN Group", href: "#" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const subRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) {
        setSubOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "top-3 mx-4 md:top-4 md:mx-8 lg:mx-auto lg:left-6 lg:right-6 xl:left-0 xl:right-0 xl:max-w-7xl xl:mx-auto rounded-2xl  backdrop-blur-2xl shadow-xl shadow-black/5 border border-white/20"
          : "top-0 bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 ${
          scrolled ? "px-5 py-3 md:px-8 md:py-3" : "px-6 py-4 max-w-7xl"
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
          <li ref={subRef} className="list-none relative">
            <button
              onClick={() => setSubOpen(!subOpen)}
              onMouseEnter={() => setSubOpen(true)}
              className={`relative flex items-center gap-1.5 text-sm font-medium transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#FFA900] after:transition-all after:duration-300 hover:after:w-full ${
                scrolled ? "text-white hover:text-white" : "text-white/80 hover:text-white"
              }`}
            >
              Notre ADN
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`absolute left-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-white/10  backdrop-blur-3xl p-2 shadow-2xl transition-all duration-200 ${
                subOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
              onMouseLeave={() => setSubOpen(false)}
            >
              {subMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-4 py-2.5 text-sm text-white transition-all duration-200 hover:bg-[#00AFA9]/10 hover:text-[#00AFA9] backdrop-blur-2xl shadow-xl"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </li>

          {["Expérience Client", "Carrière", "Actus & Événement"].map((label) => (
            <a
              key={label}
              href="#"
              className={`relative text-sm font-medium transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#FFA900] after:transition-all after:duration-300 hover:after:w-full ${
                scrolled ? "text-white hover:text-white" : "text-white/80 hover:text-white"
              }`}
            >
              {label}
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
              scrolled ? "bg-white" : "bg-white"
            } ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 transition-all duration-300 ${
              scrolled ? "bg-white" : "bg-white"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 transition-all duration-300 ${
              scrolled ? "bg-white" : "bg-white"
            } ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          menuOpen ? "max-h-[32rem]" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-3 bg-white/80 backdrop-blur-2xl px-6 pb-6 pt-3 shadow-lg rounded-b-2xl">
          <div className="space-y-1">
            <span className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700">
              Notre ADN
              <svg
                className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
              {subMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:text-[#00AFA9]"
                  onClick={() => { setMenuOpen(false); setSubOpen(false) }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          {["Expérience Client", "Carrière", "Actus & Événement"].map((label) => (
            <a
              key={label}
              href="#"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#00AFA9]"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <a
              href="#"
              className="inline-block rounded-full bg-[#FFA900] px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-[#00AFA9] hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Contactez-nous
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
