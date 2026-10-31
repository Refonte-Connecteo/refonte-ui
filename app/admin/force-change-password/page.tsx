"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import AuthShell from "@/app/admin/components/AuthShell";
import { Alert, Button, Input, Label } from "@/app/admin/components/ui";

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
    <AuthShell>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Changement de mot de passe obligatoire
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Veuillez définir un nouveau mot de passe pour accéder à l&apos;administration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div>
          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enregistrement..." : "Enregistrer le nouveau mot de passe"}
        </Button>
      </form>
    </AuthShell>
  );
}
