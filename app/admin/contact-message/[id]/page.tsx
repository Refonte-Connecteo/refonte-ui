"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, FormPage, LoadingScreen, Alert } from "@/app/admin/components/ui";

interface ContactMessageData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  message: string;
  is_read: boolean;
  submitted_at: string;
}

export default function ContactMessageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [messageData, setMessageData] = useState<ContactMessageData | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    try {
      const result = await api.getContactMessage(id);
      setMessageData(result.contactMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setFetching(false);
    }
  };

  if (fetching) {
    return <LoadingScreen />;
  }

  return (
    <FormPage title="Détail du message" backHref="/admin/contact-message">
        {error && <Alert>{error}</Alert>}

        {messageData && (
          <Card className="p-6 space-y-5">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</dt>
              <dd className="mt-1 text-sm text-gray-900">{messageData.last_name} {messageData.first_name}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{messageData.email}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</dt>
              <dd className="mt-1 text-sm text-gray-900">{messageData.phone || "—"}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</dt>
              <dd className="mt-1 text-sm text-gray-900">{messageData.company || "—"}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</dt>
              <dd className="mt-1 text-sm text-gray-900">{messageData.country || "—"}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{messageData.message}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(messageData.submitted_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    messageData.is_read
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {messageData.is_read ? "Lu" : "Non lu"}
                </span>
              </dd>
            </div>
          </Card>
        )}
      </FormPage>
  );
}
