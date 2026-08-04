"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import type { User } from "@/app/admin/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [mfaPassword, setMfaPassword] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaSuccess, setMfaSuccess] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getProfile()
      .then(({ user }) => {
        if (!cancelled) setProfile(user);
      })
      .catch((err) => {
        if (!cancelled) {
          setProfileError(err instanceof Error ? err.message : "Erreur");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordSuccess("Mot de passe modifié. Vous allez être reconnecté...");
      window.setTimeout(() => {
        clearSession();
        redirectToLogin("password_changed");
      }, 1500);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDisableMfa = async (e: FormEvent) => {
    e.preventDefault();
    setMfaError("");
    setMfaSuccess("");

    setMfaLoading(true);
    try {
      await api.disableMfa(mfaPassword);
      setMfaSuccess("Authentification à deux facteurs désactivée. Vous allez être reconnecté...");
      window.setTimeout(() => {
        clearSession();
        redirectToLogin("mfa_disabled");
      }, 1500);
    } catch (err) {
      setMfaError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Sécurité du compte</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {profileError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
            {profileError}
          </div>
        )}

        <section className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profil</h2>
          {profile ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</dt>
                <dd className="text-gray-900 font-medium">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nom d&apos;utilisateur</dt>
                <dd className="text-gray-900 font-medium">{profile.username}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider mb-1">Rôle</dt>
                <dd className="text-gray-900 font-medium">{profile.user_type?.type ?? "Administrateur"}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider mb-1">Authentification à deux facteurs</dt>
                <dd>
                  <span
                    className={
                      profile.mfa_enabled
                        ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                    }
                  >
                    {profile.mfa_enabled ? "Activée" : "Désactivée"}
                  </span>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Chargement...</p>
          )}
        </section>

        <section className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Changer le mot de passe</h2>
          <p className="text-sm text-gray-500 mb-4">
            Votre mot de passe actuel est requis. Vous devrez vous reconnecter après le changement.
          </p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{passwordSuccess}</div>
            )}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading ? "Modification..." : "Changer le mot de passe"}
            </button>
          </form>
        </section>

        {profile?.mfa_enabled && (
          <section className="bg-white shadow-sm border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Désactiver l&apos;authentification à deux facteurs</h2>
            <p className="text-sm text-gray-500 mb-4">
              Votre mot de passe actuel est requis. Vous devrez vous reconnecter après la désactivation.
            </p>
            <form onSubmit={handleDisableMfa} className="space-y-4">
              {mfaError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{mfaError}</div>
              )}
              {mfaSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{mfaSuccess}</div>
              )}
              <div>
                <label htmlFor="mfaPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  id="mfaPassword"
                  type="password"
                  value={mfaPassword}
                  onChange={(e) => setMfaPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={mfaLoading}
                className="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mfaLoading ? "Désactivation..." : "Désactiver la double authentification"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
