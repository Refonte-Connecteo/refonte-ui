"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

export default function ForceChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    try {
      await api.forceChangePassword(newPassword);
      setSuccess("Mot de passe modifié. Redirection...");
      window.setTimeout(() => {
        clearSession();
        redirectToLogin("password_changed");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white text-center">
          <KeyRound className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h1 className="text-xl font-bold">Changement de mot de passe obligatoire</h1>
          <p className="text-blue-100 text-sm mt-1">
            Veuillez définir un nouveau mot de passe pour accéder à l&apos;administration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoFocus
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Enregistrement..." : "Enregistrer le nouveau mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
