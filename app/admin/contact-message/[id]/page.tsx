"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Détail du message</h1>
          <button
            onClick={() => router.push("/admin/contact-message")}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-6">{error}</div>
        )}

        {messageData && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 space-y-5">
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
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {messageData.is_read ? "Lu" : "Non lu"}
                </span>
              </dd>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
