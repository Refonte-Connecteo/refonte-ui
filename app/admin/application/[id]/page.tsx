"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

interface ApplicationDetail {
  id: number;
  job_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  cv_url: string;
  cover_letter: string | null;
  submitted_at: string;
  job_posting: { id: number; title: string };
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const result = await api.getApplication(id);
      setApplication(result.application);
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
          <h1 className="text-xl font-bold text-gray-900">Détail de la candidature</h1>
          <button
            onClick={() => router.push("/admin/application")}
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
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
          )}

          {application && (
            <>
              <DetailRow label="Nom" value={application.last_name} />
              <DetailRow label="Prénom" value={application.first_name} />
              <DetailRow label="Email" value={application.email} />
              <DetailRow label="Téléphone" value={application.phone ?? "—"} />
              <DetailRow label="Offre liée" value={application.job_posting.title} />

              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CV</dt>
                <dd className="text-sm text-gray-900">
                  {application.cv_url ? (
                    <a href={application.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                      Voir le CV
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lettre de motivation</dt>
                <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                  {application.cover_letter || "—"}
                </dd>
              </div>

              <DetailRow
                label="Date de soumission"
                value={new Date(application.submitted_at).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}
