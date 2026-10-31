"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import MfaSetupForm from "@/app/admin/components/MfaSetupForm";
import AuthShell from "@/app/admin/components/AuthShell";
import { Alert, Button, Input, Label } from "@/app/admin/components/ui";
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
    <AuthShell>
          {setup ? (
            <MfaSetupForm
              setup={setup}
              onSuccess={(result) => completeAuth(result)}
            />
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activer votre compte</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Définissez votre mot de passe pour activer votre compte
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!invitationToken && (
                  <Alert variant="warning">
                    Aucun lien d&apos;activation valide. Utilisez le lien transmis par votre
                    super administrateur, ou saisissez le token d&apos;invitation manuellement.
                  </Alert>
                )}

                {error && <Alert>{error}</Alert>}

                <div>
                  <Label htmlFor="set-email">
                    Email
                  </Label>
                  <Input
                    id="set-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@connecteo.fr"
                  />
                </div>

                {!invitationToken && (
                  <div>
                    <Label htmlFor="set-token">
                      Token d&apos;activation
                    </Label>
                    <Input
                      id="set-token"
                      type="text"
                      value={invitationToken}
                      onChange={(e) => setInvitationToken(e.target.value)}
                      placeholder="Collez le token du lien reçu"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="password">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "En cours..." : "Activer mon compte"}
                </Button>
              </form>
            </>
          )}
    </AuthShell>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordContent />
    </Suspense>
  );
}
