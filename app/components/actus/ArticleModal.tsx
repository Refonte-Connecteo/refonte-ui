"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { ArticleMeta } from "./ArticleCard";
import type { NewsArticle } from "./ArticleCard";

type DocumentKind = "pdf" | "image" | "other";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

function documentKind(url: string): DocumentKind {
  const extension = url.split(/[?#]/)[0].split(".").pop()?.toLowerCase() ?? "";
  if (extension === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) return "image";
  return "other";
}

function DocumentActions({ url, canOpen }: { url: string; canOpen: boolean }) {
  const buttonClass =
    "inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4f5c]";
  return (
    <div className="flex flex-wrap gap-3">
      {canOpen && (
        <a href={url} target="_blank" rel="noopener noreferrer" className={`${buttonClass} bg-[#0b6171] text-white hover:bg-[#0b4f5c]`}>
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          Ouvrir
        </a>
      )}
      <a href={url} download target="_blank" rel="noopener noreferrer" className={`${buttonClass} bg-[#FFA900] text-[#0b4f5c] hover:bg-[#e89e00]`}>
        <Download aria-hidden="true" className="h-4 w-4" />
        Télécharger
      </a>
    </div>
  );
}

/**
 * L'API interdit l'affichage direct de ses fichiers dans une iframe : le PDF est
 * récupéré puis affiché depuis une URL locale, sans affaiblir ces protections.
 */
function PdfPreview({ url, title }: { url: string; title: string }) {
  const [blobUrl, setBlobUrl] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        objectUrl = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (failed) {
    return <p className="mb-3 text-sm text-slate-600">L&apos;aperçu n&apos;est pas disponible pour ce document.</p>;
  }
  if (!blobUrl) {
    return <div className="mb-3 h-40 animate-pulse rounded-2xl bg-[#d8e7ea]" aria-label="Chargement du document" />;
  }
  return <iframe src={blobUrl} title={title} className="mb-3 h-[70svh] w-full rounded-2xl border border-[#0b4f5c]/10" />;
}

function DocumentSection({ article }: { article: NewsArticle }) {
  const kind = documentKind(article.fileUrl);
  // La plupart des navigateurs mobiles n'affichent pas un PDF intégré.
  const [isMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  return (
    <section className="mt-8 border-t border-[#0b4f5c]/10 pt-6">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-[#0b4f5c]">
        <FileText aria-hidden="true" className="h-5 w-5" />
        Document
      </h3>
      {kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.fileUrl} alt={`Document : ${article.title}`} className="mb-3 w-full rounded-2xl" />
      )}
      {kind === "pdf" && !isMobile && <PdfPreview url={article.fileUrl} title={`Document : ${article.title}`} />}
      {kind === "other" && (
        <p className="mb-3 text-sm text-slate-600">Ce document s&apos;ouvre après téléchargement.</p>
      )}
      <DocumentActions url={article.fileUrl} canOpen={kind !== "other"} />
    </section>
  );
}

export default function ArticleModal({ article, onClose }: { article: NewsArticle; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

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

  return (
    <div
      className="cons-fade fixed inset-0 z-[70] flex items-end justify-center bg-[#0B1D20]/60 p-0 backdrop-blur-sm [animation-duration:250ms] sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
        tabIndex={-1}
        className="relative max-h-[calc(100svh-1rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-white shadow-2xl outline-none sm:max-h-[calc(100svh-3rem)] sm:rounded-[1.75rem]"
      >
        {/* Hauteur nulle : le bouton reste visible au défilement sans décaler le texte. */}
        <div className="sticky top-3 z-10 flex h-0 justify-end pr-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="mt-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#0b4f5c] shadow-md backdrop-blur transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0b4f5c]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-[#00aeaa] to-[#FFA900]" />

        <div className="p-6 sm:p-8">
          <div className="pr-12">
            <ArticleMeta article={article} />
          </div>
          <h2 id="article-modal-title" className="mt-4 text-2xl font-bold leading-tight text-[#0b4f5c] md:text-3xl">
            {article.title}
          </h2>
          {article.description && (
            <p className="mt-4 whitespace-pre-line break-words text-base leading-relaxed text-slate-700">
              {article.description}
            </p>
          )}
          {article.fileUrl && <DocumentSection article={article} />}
        </div>
      </div>
    </div>
  );
}
