"use client";

import { useState } from "react";
import { Copy, Download, KeyRound } from "lucide-react";
import { Alert, Button } from "@/app/admin/components/ui";

interface RecoveryCodesProps {
  codes: string[];
  /** Appelé quand l'utilisateur confirme avoir mis ses codes en lieu sûr. */
  onDone: () => void;
  doneLabel?: string;
}

/**
 * Codes de secours affichés une seule fois : chacun permet une connexion sans le téléphone.
 * L'utilisateur doit confirmer les avoir conservés avant de continuer.
 */
export default function RecoveryCodes({ codes, onDone, doneLabel = "Continuer" }: RecoveryCodesProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = `Codes de secours Connecteo (un seul usage chacun)\n\n${codes.join("\n")}\n`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "codes-de-secours-connecteo.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <KeyRound aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Vos codes de secours</h2>
          <p className="text-sm text-gray-500">
            Si vous perdez votre téléphone, chacun de ces codes remplace une fois le code à 6 chiffres.
            Gardez-les en lieu sûr (gestionnaire de mots de passe, papier rangé) : ils ne seront plus affichés.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm tracking-wider text-gray-900">
        {codes.map((code) => (
          <li key={code} className="text-center">{code}</li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" type="button" onClick={copy}>
          <Copy aria-hidden="true" className="h-4 w-4" />
          {copied ? "Copiés" : "Copier"}
        </Button>
        <Button variant="secondary" type="button" onClick={download}>
          <Download aria-hidden="true" className="h-4 w-4" />
          Télécharger (.txt)
        </Button>
      </div>

      <Alert variant="warning">Ne les partagez avec personne : ils donnent accès à votre compte avec votre mot de passe.</Alert>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} className="h-4 w-4" />
        J&apos;ai mis mes codes de secours en lieu sûr
      </label>

      <Button type="button" onClick={onDone} disabled={!saved} className="w-full">
        {doneLabel}
      </Button>
    </div>
  );
}
