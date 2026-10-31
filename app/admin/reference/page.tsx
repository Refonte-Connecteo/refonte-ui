"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { sanitizeUrl } from "@/lib/security";
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

interface ReferenceItem {
  id: number;
  label: string;
  image_url: string;
  website_url: string | null;
  position: number;
  is_active: boolean;
}

export default function ReferenceListPage() {
  const router = useRouter();
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllReferences();
      setReferences(result.references);
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
    if (!confirm("Voulez-vous vraiment supprimer cette référence ?")) return;
    try {
      await api.deleteReference(id);
      setReferences((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleToggleActive = async (reference: ReferenceItem) => {
    try {
      await api.updateReference(reference.id, { is_active: !reference.is_active });
      setReferences((prev) =>
        prev.map((r) => (r.id === reference.id ? { ...r, is_active: !r.is_active } : r))
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
      <PageHeader title="Références"
        actions={
          <Button onClick={() => router.push("/admin/reference/new")}>
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
                <Th>Label</Th>
                <Th>Image</Th>
                <Th>Website</Th>
                <Th>Position</Th>
                <Th>Statut</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {references.map((reference) => (
                <tr key={reference.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{reference.label}</td>
                  <td className="px-5 py-3.5">
                    {reference.image_url ? (
                      <img src={reference.image_url} alt={reference.label} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {reference.website_url ? (
                      <a href={sanitizeUrl(reference.website_url)} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        {reference.website_url}
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{reference.position}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleActive(reference)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${
                        reference.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 ring-gray-500/15 hover:bg-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${reference.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {reference.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/reference/${reference.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(reference.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {references.length === 0 && (
            <EmptyState title="Aucune référence" icon={BarChart3} />
          )}
        </Card>
      </div>
  );
}
