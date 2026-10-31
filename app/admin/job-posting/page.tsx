"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Pencil, Plus, Trash2, UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import {
  Card,
  Button,
  PageHeader,
  EmptyState,
  LoadingScreen,
  Alert,
  DataTable,
  Th,
  RowAction,
} from "@/app/admin/components/ui";

interface JobPostingItem {
  id: number;
  title: string;
  contract_type: string;
  description: string | null;
  external_url: string | null;
  fiche_url: string | null;
  is_active: boolean;
  created_at: string;
  applications: { id: number }[];
}

export default function JobPostingListPage() {
  const router = useRouter();
  const [jobPostings, setJobPostings] = useState<JobPostingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllJobPostings();
      setJobPostings(result.jobPostings);
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
    if (!token) { router.push("/admin/login"); return; }
    fetchData();
  }, [fetchData, router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    try {
      await api.deleteJobPosting(id);
      setJobPostings((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleToggleActive = async (jobPosting: JobPostingItem) => {
    try {
      await api.updateJobPosting(jobPosting.id, { is_active: !jobPosting.is_active });
      setJobPostings((prev) =>
        prev.map((j) => (j.id === jobPosting.id ? { ...j, is_active: !j.is_active } : j))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Offres d'emploi"
        actions={
          <Button onClick={() => router.push("/admin/job-posting/new")}>
            <Plus className="w-4 h-4" />
            Nouveau
          </Button>
        }
      />

        {error && <Alert>{error}</Alert>}

        <Card className="overflow-hidden">
          <DataTable>
            <thead>
              <tr>
                <Th>Titre</Th>
                <Th>Type de contrat</Th>
                <Th>Statut</Th>
                <Th>Candidatures</Th>
                <Th>Date</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobPostings.map((job) => (
                <tr key={job.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{job.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                      {job.contract_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleActive(job)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${
                        job.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 ring-gray-500/15 hover:bg-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${job.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {job.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                      {job.applications.length}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(job.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/job-posting/${job.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(job.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {jobPostings.length === 0 && (
            <EmptyState title="Aucune offre d'emploi" icon={Briefcase} />
          )}
        </Card>
      </div>
  );
}
