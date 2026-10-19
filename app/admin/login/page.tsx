"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import { getSafeRedirectUrl } from "@/lib/security";
import MfaSetupForm from "@/app/admin/components/MfaSetupForm";
import MfaVerifyForm from "@/app/admin/components/MfaVerifyForm";
import type { AuthSuccessResponse, MfaChallengeResponse, MfaSetupResponse } from "@/app/admin/types";

type Mode = "login" | "mfa-setup" | "mfa-verify";

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
              <a
                href="/admin/set-password"
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Nouvel administrateur ? Activez votre compte
              </a>
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
