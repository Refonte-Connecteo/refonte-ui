"use client";

import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, ShieldCheck, ShieldOff, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import type { User } from "@/app/admin/types";
import {
  Card,
  CardHeader,
  Badge,
  Button,
  PageHeader,
} from "@/app/admin/components/ui";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

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
    <div className="space-y-6">
      {profileError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {profileError}
        </div>
      )}

      <PageHeader
        title="Sécurité & profil"
        subtitle="Vos informations et les paramètres de sécurité du compte"
      />

      <Card>
        <CardHeader title="Profil" icon={UserIcon} subtitle="Informations du compte connecté" />
        <div className="p-6">
          {profile ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
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
                <dd className="text-gray-900 font-medium">
                  {profile.user_type?.type === "superAdmin" ? "Super Admin" : "Administrateur"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider mb-1">Authentification à deux facteurs</dt>
                <dd>
                  {profile.mfa_enabled ? (
                    <Badge color="green" dot>Activée</Badge>
                  ) : (
                    <Badge color="gray" dot>Désactivée</Badge>
                  )}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Chargement...</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Changer le mot de passe"
          icon={KeyRound}
          subtitle="Votre mot de passe actuel est requis. Vous devrez vous reconnecter après le changement."
        />
        <div className="p-6">
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {passwordSuccess}
              </div>
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
                className={inputClass}
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
                  className={inputClass}
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
                  className={inputClass}
                />
              </div>
            </div>
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Modification..." : "Changer le mot de passe"}
            </Button>
          </form>
        </div>
      </Card>

      {profile?.mfa_enabled && (
        <Card className="border-rose-200">
          <CardHeader
            title="Désactiver la double authentification"
            icon={ShieldOff}
            subtitle="Votre mot de passe actuel est requis. Vous devrez vous reconnecter après la désactivation."
          />
          <div className="p-6">
            <form onSubmit={handleDisableMfa} className="space-y-4">
              {mfaError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {mfaError}
                </div>
              )}
              {mfaSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {mfaSuccess}
                </div>
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
                  className={inputClass}
                />
              </div>
              <Button variant="danger" type="submit" disabled={mfaLoading}>
                <ShieldCheck className="w-4 h-4" />
                {mfaLoading ? "Désactivation..." : "Désactiver la double authentification"}
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
