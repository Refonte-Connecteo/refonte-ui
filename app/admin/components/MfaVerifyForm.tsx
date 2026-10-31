"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { Alert, Button, Input, Label } from "@/app/admin/components/ui";
import type { AuthSuccessResponse } from "@/app/admin/types";

interface MfaVerifyFormProps {
  mfaToken: string;
  onSuccess: (result: AuthSuccessResponse) => void;
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
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code de vérification invalide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-1 mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Vérification en deux étapes</h1>
        <p className="text-sm text-gray-500">
          Saisissez le code à 6 chiffres généré par Microsoft Authenticator pour finaliser la
          connexion.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}

        <div>
          <Label htmlFor="mfa-verify-code">
            Code à 6 chiffres
          </Label>
          <Input
            id="mfa-verify-code"
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
          {loading ? "Vérification..." : "Se connecter"}
        </Button>
      </form>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-sm font-medium text-gray-500 hover:text-brand-700"
          >
            ← Retour à la connexion
          </button>
        </div>
      )}
    </div>
  );
}
