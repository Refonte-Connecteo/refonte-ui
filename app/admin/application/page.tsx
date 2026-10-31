"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Users } from "lucide-react";
import { api } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/security";
import {
  Card,
  PageHeader,
  EmptyState,
  LoadingScreen,
  Alert,
  DataTable,
  Th,
  RowAction,
} from "@/app/admin/components/ui";

interface ApplicationItem {
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

export default function ApplicationListPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllApplications();
      setApplications(result.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      if (String(err).includes("Token") || String(err).includes("401")) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    void Promise.resolve().then(() => fetchData());
  }, [fetchData, router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette candidature ?")) return;
    try {
      await api.deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      {error && <Alert>{error}</Alert>}

      <PageHeader
        title="Candidatures"
        subtitle="Candidatures reçues via le site"
      />

      <Card className="overflow-hidden">
        <DataTable>
            <thead>
              <tr>
                <Th>Nom</Th>
                <Th>Prénom</Th>
                <Th>Email</Th>
                <Th>Offre</Th>
                <Th>CV</Th>
                <Th>Date</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{app.last_name}</td>
                  <td className="px-5 py-3.5 text-gray-700">{app.first_name}</td>
                  <td className="px-5 py-3.5 text-gray-700">{app.email}</td>
                  <td className="px-5 py-3.5 text-gray-700">{app.job_posting.title}</td>
                  <td className="px-5 py-3.5 text-xs">
                    {app.cv_url ? (
                      <a href={resolveAssetUrl(app.cv_url)} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
                        Voir CV
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(app.submitted_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <RowAction onClick={() => router.push(`/admin/application/${app.id}`)} icon={Eye}>Voir</RowAction>
                      <RowAction onClick={() => handleDelete(app.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

        {applications.length === 0 && (
          <EmptyState
            title="Aucune candidature"
            subtitle="Les candidatures reçues via le site apparaîtront ici."
            icon={Users}
          />
        )}
      </Card>
    </div>
  );
}
