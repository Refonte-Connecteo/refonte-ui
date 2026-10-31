"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { sanitizeUrl } from "@/lib/security";
import { Card, FormPage, LoadingScreen, Alert } from "@/app/admin/components/ui";

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
    return <LoadingScreen />;
  }

  return (
    <FormPage title="Détail de la candidature" backHref="/admin/application">
        <Card className="p-6 space-y-5">
          {error && <Alert>{error}</Alert>}

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
                    <a href={sanitizeUrl(application.cv_url)} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
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
        </Card>
      </FormPage>
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
