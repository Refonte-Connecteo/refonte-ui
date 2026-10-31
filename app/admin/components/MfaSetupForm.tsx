"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { Alert, Button, Input, Label } from "@/app/admin/components/ui";
import type { AuthSuccessResponse, MfaSetupResponse } from "@/app/admin/types";

interface MfaSetupFormProps {
  setup: MfaSetupResponse;
  onSuccess: (result: AuthSuccessResponse) => void;
  onBack?: () => void;
}

function extractSecretFromOtpauthUrl(otpauthUrl: string): string {
  try {
    return new URL(otpauthUrl).searchParams.get("secret") ?? "";
  } catch {
    return "";
  }
}

export default function MfaSetupForm({ setup, onSuccess, onBack }: MfaSetupFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const secret = extractSecretFromOtpauthUrl(setup.otpauthUrl);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Veuillez saisir le code à 6 chiffres");
      return;
    }

    setLoading(true);

    try {
      const result = await api.confirmMfaSetup(setup.mfaToken, code);
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'activation du MFA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-1 mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Activer l&apos;authentification à deux facteurs
        </h1>
        <p className="text-sm text-gray-500">
          Scannez le QR Code avec Microsoft Authenticator, puis saisissez le code à 6 chiffres
          généré par l&apos;application pour activer votre compte.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}

        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={setup.qrCodeDataUrl}
            alt="QR Code Microsoft Authenticator"
            className="w-48 h-48 border border-gray-200 rounded-2xl bg-white p-2"
          />
          <p className="text-xs text-gray-500">{setup.email}</p>
        </div>

        {secret && (
          <div>
            <Label>
              Clé secrète (à conserver en secours)
            </Label>
            <p className="font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 break-all">
              {secret}
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="mfa-code">
            Code à 6 chiffres
          </Label>
          <Input
            id="mfa-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            pattern="\d{6}"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="text-center text-lg tracking-[0.4em] font-semibold tabular-nums"
            placeholder="000000"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Vérification..." : "Activer mon compte"}
        </Button>
      </form>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-sm font-medium text-gray-500 hover:text-brand-700"
          >
            ← Retour
          </button>
        </div>
      )}
    </div>
  );
}
