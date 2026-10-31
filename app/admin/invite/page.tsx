"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { InviteResponse } from "@/app/admin/types";
import {
  Card,
  Button,
  FormPage,
  Alert,
  Label,
  Input,
  Select,
} from "@/app/admin/components/ui";

export default function AdminInvitePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userTypeId, setUserTypeId] = useState(2);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState<InviteResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const activationUrl = invitation
    ? `${window.location.origin}/admin/set-password?email=${encodeURIComponent(invitation.user.email)}&token=${encodeURIComponent(invitation.invitation_token)}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Impossible de copier le lien. Copiez-le manuellement.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInvitation(null);
    setLoading(true);

    try {
      const result = await api.inviteAdmin(email, username, userTypeId);
      setInvitation(result);
      setEmail("");
      setUsername("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage title="Ajouter un administrateur" subtitle="Renseignez l'email et le nom d'utilisateur du nouvel admin" backHref="/admin/dashboard">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}

            <div>
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@connecteo.fr" />
            </div>

            <div>
              <Label htmlFor="username">
                Nom d&apos;utilisateur
              </Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin1" />
            </div>

            <div>
              <Label htmlFor="role">
                Rôle
              </Label>
              <Select
                id="role"
                value={userTypeId}
                onChange={(e) => setUserTypeId(Number(e.target.value))}>
                <option value={2}>Administrateur</option>
                <option value={1}>Super Administrateur</option>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Ajout..." : "Ajouter l'administrateur"}
            </Button>
          </form>

          {invitation && (
            <div className="mt-6 space-y-3">
              <Alert variant="success">
                {invitation.user.email} a été ajouté comme {invitation.user.user_type_id === 1 ? "super administrateur" : "administrateur"}. Transmettez-lui ce
                lien d&apos;activation <strong>(valable 72 h)</strong> :
              </Alert>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={activationUrl}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 text-xs"
                />
                <Button type="button" variant="secondary" onClick={handleCopy} className="shrink-0">
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </FormPage>
  );
}
