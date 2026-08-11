"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import MfaSetupForm from "@/app/admin/components/MfaSetupForm";
import type { AuthSuccessResponse, MfaSetupResponse } from "@/app/admin/types";

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") ?? "";
  const urlEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(urlEmail);
  const [invitationToken, setInvitationToken] = useState(urlToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setup, setSetup] = useState<MfaSetupResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const completeAuth = (result: AuthSuccessResponse) => {
    setSession(result.token, result.refreshToken, result.user);
    router.push("/admin/dashboard");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (!invitationToken) {
      setError("Le lien d'activation est invalide ou absent.");
      return;
    }

    setLoading(true);

    try {
      const result = await api.setPassword(email, password, invitationToken);
      setSetup(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
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

        <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
          {setup ? (
            <MfaSetupForm
              setup={setup}
              onSuccess={(result) => completeAuth(result)}
            />
          ) : (
            <>
              <div className="space-y-1 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activer votre compte</h2>
                <p className="text-sm text-gray-500">
                  Définissez votre mot de passe pour activer votre compte
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!invitationToken && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3">
                    Aucun lien d&apos;activation valide. Utilisez le lien transmis par votre
                    super administrateur, ou saisissez le token d&apos;invitation manuellement.
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="set-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="set-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="admin@connecteo.fr"
                  />
                </div>

                {!invitationToken && (
                  <div>
                    <label htmlFor="set-token" className="block text-sm font-medium text-gray-700 mb-1">
                      Token d&apos;activation
                    </label>
                    <input
                      id="set-token"
                      type="text"
                      value={invitationToken}
                      onChange={(e) => setInvitationToken(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      placeholder="Collez le token du lien reçu"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="Au moins 8 caractères"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
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
                  {loading ? "En cours..." : "Activer mon compte"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordContent />
    </Suspense>
  );
}
