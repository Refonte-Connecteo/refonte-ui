"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import type { User } from "@/app/admin/types";

interface MfaVerifyFormProps {
  mfaToken: string;
  onSuccess: (user: User, token: string) => void;
  onBack?: () => void;
}

export default function MfaVerifyForm({ mfaToken, onSuccess, onBack }: MfaVerifyFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Veuillez saisir le code à 6 chiffres");
      return;
    }

    setLoading(true);

    try {
      const result = await api.verifyMfa(mfaToken, code);
      onSuccess(result.user, result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code de vérification invalide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Vérification en deux étapes</h2>
        <p className="text-sm text-gray-500">
          Saisissez le code à 6 chiffres généré par Microsoft Authenticator pour finaliser la
          connexion.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="mfa-verify-code" className="block text-sm font-medium text-gray-700 mb-1">
            Code à 6 chiffres
          </label>
          <input
            id="mfa-verify-code"
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
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </form>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Retour à la connexion
          </button>
        </div>
      )}
    </div>
  );
}
