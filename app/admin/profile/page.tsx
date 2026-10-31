"use client";

import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, ShieldCheck, ShieldOff, UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import type { User } from "@/app/admin/types";
import {
  Card,
  CardHeader,
  Badge,
  Button,
  PageHeader,
  Alert,
  Label,
  Input,
} from "@/app/admin/components/ui";

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
      {profileError && <Alert>{profileError}</Alert>}

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
            {passwordError && <Alert>{passwordError}</Alert>}
            {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
            <div>
              <Label htmlFor="currentPassword">
                Mot de passe actuel
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">
                  Nouveau mot de passe
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">
                  Confirmer le nouveau mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
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
              {mfaError && <Alert>{mfaError}</Alert>}
              {mfaSuccess && <Alert variant="success">{mfaSuccess}</Alert>}
              <div>
                <Label htmlFor="mfaPassword">
                  Mot de passe actuel
                </Label>
                <Input
                  id="mfaPassword"
                  type="password"
                  value={mfaPassword}
                  onChange={(e) => setMfaPassword(e.target.value)}
                  required />
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
