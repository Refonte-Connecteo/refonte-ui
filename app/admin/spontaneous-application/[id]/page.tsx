"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

interface SpontaneousApplicationDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  cv_url: string;
  motivation: string | null;
  submitted_at: string;
}

export default function SpontaneousApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [application, setApplication] = useState<SpontaneousApplicationDetail | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const result = await api.getSpontaneousApplication(id);
      setApplication(result.spontaneousApplication);
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
          <h1 className="text-xl font-bold text-gray-900">Détail de la candidature spontanée</h1>
          <button
            onClick={() => router.push("/admin/spontaneous-application")}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
          )}

          {application && (
            <div className="space-y-5">
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nom</span>
                <p className="text-sm text-gray-900 font-medium">{application.last_name}</p>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Prénom</span>
                <p className="text-sm text-gray-900 font-medium">{application.first_name}</p>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</span>
                <p className="text-sm text-gray-900">{application.email}</p>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Téléphone</span>
                <p className="text-sm text-gray-900">{application.phone || <span className="text-gray-300">—</span>}</p>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CV</span>
                {application.cv_url ? (
                  <a
                    href={application.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Voir le CV
                  </a>
                ) : (
                  <p className="text-sm text-gray-300">—</p>
                )}
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Motivation</span>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{application.motivation || <span className="text-gray-300">—</span>}</p>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date de soumission</span>
                <p className="text-sm text-gray-900">
                  {new Date(application.submitted_at).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
