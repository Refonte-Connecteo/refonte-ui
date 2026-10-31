"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Paperclip } from "lucide-react";
import { api } from "@/lib/api";
import { sanitizeUrl } from "@/lib/security";
import { Card, FormPage, LoadingScreen, Alert } from "@/app/admin/components/ui";

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
    return <LoadingScreen />;
  }

  return (
    <FormPage title="Détail de la candidature spontanée" backHref="/admin/spontaneous-application">
        <Card className="p-6">
          {error && <Alert>{error}</Alert>}

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
                    href={sanitizeUrl(application.cv_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <Paperclip className="w-4 h-4" />
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
        </Card>
      </FormPage>
  );
}
