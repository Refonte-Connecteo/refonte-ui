"use client";

import { useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/security";

interface PrivateFileLinkProps {
  /** Référence enregistrée : `/private/<nom>` (CV, pièce jointe) ou ancienne adresse publique. */
  fileRef: string;
  children: ReactNode;
  className?: string;
}

/**
 * Ouvre un CV ou une pièce jointe envoyés par un visiteur.
 * Les fichiers privés sont téléchargés avec le jeton de l'admin puis ouverts depuis une adresse
 * blob: locale (PDF dans un nouvel onglet, Word en téléchargement). Une ancienne référence
 * publique reste un simple lien.
 */
export default function PrivateFileLink({ fileRef, children, className = "" }: PrivateFileLinkProps) {
  const [loading, setLoading] = useState(false);

  if (!fileRef.startsWith("/private/")) {
    return (
      <a
        href={resolveAssetUrl(fileRef)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </a>
    );
  }

  const name = fileRef.slice("/private/".length);
  const isPdf = name.toLowerCase().endsWith(".pdf");

  const open = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // L'onglet est ouvert tout de suite (sinon le navigateur bloque la fenêtre après l'attente).
    const tab = isPdf ? window.open("", "_blank") : null;
    setLoading(true);
    try {
      const blob = await api.getPrivateFile(fileRef);
      const url = URL.createObjectURL(blob);
      if (tab) {
        tab.location.href = url;
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      tab?.close();
      alert(err instanceof Error ? err.message : "Impossible d'ouvrir le fichier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={open} disabled={loading} className={`${className} disabled:opacity-60`}>
      {loading ? "Ouverture…" : children}
    </button>
  );
}
