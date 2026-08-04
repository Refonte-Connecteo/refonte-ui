"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
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
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Activer l&apos;authentification à deux facteurs
        </h2>
        <p className="text-sm text-gray-500">
          Scannez le QR Code avec Microsoft Authenticator, puis saisissez le code à 6 chiffres
          généré par l&apos;application pour activer votre compte.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={setup.qrCodeDataUrl}
            alt="QR Code Microsoft Authenticator"
            className="w-48 h-48 border border-gray-200 rounded-lg bg-white p-2"
          />
          <p className="text-xs text-gray-500">{setup.email}</p>
        </div>

        {secret && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clé secrète (à conserver en secours)
            </label>
            <p className="font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 break-all">
              {secret}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-1">
            Code à 6 chiffres
          </label>
          <input
            id="mfa-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            pattern="\d{6}"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Vérification..." : "Activer mon compte"}
        </button>
      </form>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Retour
          </button>
        </div>
      )}
    </div>
  );
}
