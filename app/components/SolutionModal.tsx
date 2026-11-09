"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { findOfferByTitle } from "@/lib/solutions";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Nombre de bénéfices affichés dans l'aperçu (la fiche offre les montre tous). */
const PREVIEW_BENEFITS = 3;

/** Fenêtre « Explorer cette solution », partagée par Secteurs et Vos enjeux. */
export default function SolutionModal({ name, onClose }: { name: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const summary = findOfferByTitle(name);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // Le clavier reste dans la fenêtre tant qu'elle est ouverte.
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  const benefits = (summary?.offer.benefits ?? []).slice(0, PREVIEW_BENEFITS);

  return createPortal(
    <div
      className="cons-fade fixed inset-0 z-[70] flex items-end justify-center bg-[#0B1D20]/60 backdrop-blur-sm [animation-duration:250ms] sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="solution-modal-title"
        tabIndex={-1}
        className="relative max-h-[calc(100svh-1rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-[1.75rem] border border-white/20 bg-[#0b4f5c] text-white shadow-2xl outline-none sm:max-h-[calc(100svh-3rem)] sm:rounded-[1.75rem]"
      >
        <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-[#00aeaa] to-[#FFA900]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFA900]"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <p className="pr-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFA900]">
            Explorer cette solution
          </p>
          <h2 id="solution-modal-title" className="mt-3 pr-10 text-xl font-bold leading-snug sm:text-2xl">
            {name}
          </h2>

          {summary ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#FFA900] px-3 py-1 text-xs font-semibold text-[#0b4f5c]">
                  {summary.pole}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-[#c8eeec]">
                  {summary.expertise}
                </span>
              </div>

              {summary.offer.scopeText && (
                <p className="mt-5 text-sm font-light leading-relaxed text-white/85">{summary.offer.scopeText}</p>
              )}

              {benefits.length > 0 && (
                <>
                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">Bénéfices</p>
                  <ul className="mt-3 space-y-2.5">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 text-sm leading-relaxed">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFA900]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={summary.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FFA900] px-5 py-2.5 text-sm font-semibold text-[#0b4f5c] transition-all hover:bg-[#00AFA9] hover:text-white active:scale-[0.98]"
                >
                  Voir l&apos;offre
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href={summary.expertiseHref}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Découvrir l&apos;expertise
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-5">
              <p className="text-sm font-light leading-relaxed text-white/85">
                Parlons de votre besoin : nous vous présentons cette solution en détail.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FFA900] px-5 py-2.5 text-sm font-semibold text-[#0b4f5c] transition-all hover:bg-[#00AFA9] hover:text-white"
              >
                Nous contacter
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
