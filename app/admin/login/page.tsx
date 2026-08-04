"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import { getSafeRedirectUrl } from "@/lib/security";
import MfaSetupForm from "@/app/admin/components/MfaSetupForm";
import MfaVerifyForm from "@/app/admin/components/MfaVerifyForm";
import type { AuthSuccessResponse, MfaChallengeResponse, MfaSetupResponse } from "@/app/admin/types";

type Mode = "login" | "nouvel-admin-email" | "nouvel-admin-password" | "mfa-setup" | "mfa-verify";

const LOGOUT_REASON_MESSAGES: Record<string, string> = {
  inactivity: "Session expirée pour inactivité. Veuillez vous reconnecter.",
  expired: "Votre session a expiré. Veuillez vous reconnecter.",
  password_changed: "Mot de passe modifié. Veuillez vous reconnecter avec votre nouveau mot de passe.",
  mfa_disabled: "Authentification à deux facteurs désactivée. Veuillez vous reconnecter.",
};

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaSetup, setMfaSetup] = useState<MfaSetupResponse | null>(null);
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallengeResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reason = searchParams.get("reason");
  const infoMessage = reason ? LOGOUT_REASON_MESSAGES[reason] : "";

  const completeAuth = (result: AuthSuccessResponse) => {
    setSession(result.token, result.refreshToken, result.user);
    router.push(getSafeRedirectUrl(searchParams.get("redirect"), "/admin/dashboard"));
  };

  const resetForm = () => {
    setMode("login");
    setEmail("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMfaSetup(null);
    setMfaChallenge(null);
    setError("");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.login(email, password);

      if ("requireMfa" in result) {
        setMfaChallenge(result);
        setMode("mfa-verify");
        return;
      }

      if ("requireMfaSetup" in result) {
        setMfaSetup(result);
        setMode("mfa-setup");
        return;
      }

      completeAuth(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPending = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.checkPending(email);
      setMode("nouvel-admin-password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

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
      const result = await api.setPassword(email, newPassword);
      setMfaSetup(result);
      setMode("mfa-setup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <>
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Connexion</h2>
              <p className="text-sm text-gray-500">
                Connectez-vous à votre espace d&apos;administration
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="superadmin@connecteo.fr"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setMode("nouvel-admin-email")}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Nouvel administrateur ?
              </button>
            </div>
          </>
        );

      case "nouvel-admin-email":
        return (
          <>
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Nouvel administrateur</h2>
              <p className="text-sm text-gray-500">
                Entrez votre email pour activer votre compte
              </p>
            </div>

            <form onSubmit={handleCheckPending} className="space-y-4">
              <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="new-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="admin@connecteo.fr"
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

            <div className="mt-4 text-center">
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Retour à la connexion
              </button>
            </div>
          </>
        );

      case "nouvel-admin-password":
        return (
          <>
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Définir votre mot de passe</h2>
              <p className="text-sm text-gray-500">
                Compte reconnu. Choisissez un mot de passe sécurisé.
              </p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>

            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="Au moins 8 caractères"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "En cours..." : "Valider mon mot de passe"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Retour à la connexion
              </button>
            </div>
          </>
        );

      case "mfa-setup":
        return mfaSetup ? (
          <MfaSetupForm
            setup={mfaSetup}
            onSuccess={(result) => completeAuth(result)}
            onBack={resetForm}
          />
        ) : null;

      case "mfa-verify":
        return mfaChallenge ? (
          <MfaVerifyForm
            mfaToken={mfaChallenge.mfaToken}
            onSuccess={(result) => completeAuth(result)}
            onBack={resetForm}
          />
        ) : null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Administration Connecteo
          </h1>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          {infoMessage && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-3">
              {infoMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
