"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const subMenuItems = [
  { label: "À propos de nous", href: "/notre-adn/a-propos" },
  { label: "Impact and Sustainability", href: "/impact" },
  { label: "AXIAN Group", href: "https://www.axian.com" },
];

const experienceClientSubItems = [
  { label: "Nos Solutions CX", href: "/solutions" },
  { label: "Outsourcing", href: "/outs" },
  { label: "Consulting", href: "/cons" },
];

const mainLinks = [
  { label: "Carrière", href: "/carriere2" },
  { label: "Actus & Evenement", href: "/actus" },
];

const STAGGER_MS = 50;

const underline = (active: boolean) =>
  `relative text-sm font-medium whitespace-nowrap text-white transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-[#FFA900] after:transition-all after:duration-300 ${
    active ? "after:w-full" : "after:w-0 hover:after:w-full"
  }`;

const dropdownPanel = (open: boolean) =>
  `absolute left-0 top-full mt-2 origin-top-right rounded-xl border border-white/10 bg-[#0B1D20]/95 backdrop-blur-3xl p-2 shadow-2xl transition-all duration-200 ${
    open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
  }`;

function Chevron({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DropdownLinks({ items, open }: { items: typeof subMenuItems; open: boolean }) {
  return items.map((item, index) => (
    <a
      key={item.label}
      href={item.href}
      style={{ animationDelay: `${index * STAGGER_MS}ms` }}
      className={`block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-all duration-200 hover:translate-x-0.5 hover:bg-[#00AFA9]/10 hover:text-white backdrop-blur-2xl shadow-xl ${
        open ? "menu-item-in" : ""
      }`}
    >
      {item.label}
    </a>
  ));
}

function MobileGroup({
  label,
  items,
  open,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: typeof subMenuItems;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-white/80"
      >
        {label}
        <Chevron open={open} className="text-white/40" />
      </button>
      <div
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-4 space-y-1 border-l border-white/10 pl-3">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:text-white"
                onClick={onNavigate}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [ecSubOpen, setEcSubOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const subRef = useRef<HTMLLIElement>(null);
  const ecSubRef = useRef<HTMLLIElement>(null);

  const isActive = (href: string) => pathname === href || !!pathname?.startsWith(`${href}/`);
  const isGroupActive = (items: typeof subMenuItems) => items.some((item) => isActive(item.href));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) {
        setSubOpen(false);
      }
      if (ecSubRef.current && !ecSubRef.current.contains(e.target as Node)) {
        setEcSubOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSubOpen(false);
    setEcSubOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 top-3 mx-4 sm:mx-6 md:top-4 md:mx-8 lg:mx-auto lg:left-6 lg:right-6 xl:left-0 xl:right-0 xl:max-w-7xl xl:mx-auto rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-2xl border border-white/20 ${
        compact ? "bg-[#0B1D20]/90 shadow-2xl shadow-black/20" : "bg-[#0B1D20]/70 shadow-xl shadow-black/5"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-6 transition-all duration-500 px-4 sm:px-5 md:px-8 ${
          compact ? "py-1.5 sm:py-2" : "py-2.5 sm:py-3"
        }`}
      >
        <a href="/" className="shrink-0">
          <img
            src="/images/logo1.png"
            alt="Logo"
            className={`w-auto transition-all duration-300 hover:scale-105 ${
              compact ? "h-9 sm:h-10 md:h-11 lg:h-12" : "h-10 sm:h-12 md:h-14 lg:h-15"
            }`}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          <li ref={subRef} className="list-none relative">
            <button
              onClick={() => setSubOpen(!subOpen)}
              onMouseEnter={() => setSubOpen(true)}
              className={`flex items-center gap-1.5 ${underline(isGroupActive(subMenuItems))}`}
            >
              Notre ADN
              <Chevron open={subOpen} />
            </button>

            <div className={`w-56 ${dropdownPanel(subOpen)}`} onMouseLeave={() => setSubOpen(false)}>
              <DropdownLinks items={subMenuItems} open={subOpen} />
            </div>
          </li>

          <li ref={ecSubRef} className="list-none relative">
            <button
              onClick={() => setEcSubOpen(!ecSubOpen)}
              onMouseEnter={() => setEcSubOpen(true)}
              className={`flex items-center gap-1.5 ${underline(isGroupActive(experienceClientSubItems))}`}
            >
              Experience Client
              <Chevron open={ecSubOpen} />
            </button>

            <div className={`w-64 ${dropdownPanel(ecSubOpen)}`} onMouseLeave={() => setEcSubOpen(false)}>
              <DropdownLinks items={experienceClientSubItems} open={ecSubOpen} />
            </div>
          </li>

          {mainLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={underline(isActive(item.href))}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/contact"
            className="rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 bg-[#FFA900] text-gray-900 hover:bg-[#00AFA9] hover:text-white hover:shadow-lg hover:shadow-[#00AFA9]/30 active:scale-[0.97]"
          >
            Contactez-nous
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          menuOpen ? "max-h-[calc(100svh-6rem)]" : "max-h-0"
        }`}
      >
        <nav className="flex max-h-[calc(100svh-6rem)] flex-col gap-1 overflow-y-auto overscroll-contain bg-[#0B1D20]/95 backdrop-blur-2xl px-5 sm:px-6 pb-6 pt-3 shadow-lg rounded-b-[1.5rem] md:rounded-b-[2rem]">
          <div className={menuOpen ? "menu-item-in" : ""}>
            <MobileGroup
              label="Notre ADN"
              items={subMenuItems}
              open={subOpen}
              onToggle={() => setSubOpen(!subOpen)}
              onNavigate={() => { setMenuOpen(false); setSubOpen(false); }}
            />
          </div>
          <div
            className={menuOpen ? "menu-item-in" : ""}
            style={{ animationDelay: `${STAGGER_MS}ms` }}
          >
            <MobileGroup
              label="Experience Client"
              items={experienceClientSubItems}
              open={ecSubOpen}
              onToggle={() => setEcSubOpen(!ecSubOpen)}
              onNavigate={() => { setMenuOpen(false); setEcSubOpen(false); }}
            />
          </div>
          {mainLinks.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              style={{ animationDelay: `${(index + 2) * STAGGER_MS}ms` }}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:text-white ${
                isActive(item.href) ? "text-[#FFA900]" : "text-white/80"
              } ${menuOpen ? "menu-item-in" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div
            className={`pt-3 mt-2 border-t border-white/10 ${menuOpen ? "menu-item-in" : ""}`}
            style={{ animationDelay: `${4 * STAGGER_MS}ms` }}
          >
            <a
              href="/contact"
              className="inline-block rounded-full bg-[#FFA900] px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-[#00AFA9] hover:text-white active:scale-[0.97]"
              onClick={() => setMenuOpen(false)}
            >
              Contactez-nous Maintenant
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
