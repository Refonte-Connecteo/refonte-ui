"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import { getSafeRedirectUrl } from "@/lib/security";
import MfaSetupForm from "@/app/admin/components/MfaSetupForm";
import MfaVerifyForm from "@/app/admin/components/MfaVerifyForm";
import AuthShell from "@/app/admin/components/AuthShell";
import { Alert, Button, Input, Label } from "@/app/admin/components/ui";
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
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Connexion</h1>
              <p className="text-sm text-gray-500 mt-1">
                Connectez-vous à votre espace d&apos;administration
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@connecteo.fr"
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <a
                href="/admin/set-password"
                className="text-sm text-brand-700 hover:text-brand-800 font-medium"
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
    <AuthShell>
      <div className="space-y-4">
        {infoMessage && <Alert variant="info">{infoMessage}</Alert>}
        {error && <Alert>{error}</Alert>}
        {renderForm()}
      </div>
    </AuthShell>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
