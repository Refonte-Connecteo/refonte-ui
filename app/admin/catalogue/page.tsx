"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, FolderOpen, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
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

interface CatalogueItem {
  id: number;
  title: string;
  file_url: string;
  is_lead_magnet: boolean;
  year: number | null;
  is_impact_report: boolean;
  uploaded_at: string;
}

export default function CatalogueListPage() {
  const router = useRouter();
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllCatalogues();
      setCatalogues(result.catalogues);
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
    fetchData();
  }, [fetchData, router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce catalogue ?")) return;
    try {
      await api.deleteCatalogue(id);
      setCatalogues((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Catalogues"
        actions={
          <Button onClick={() => router.push("/admin/catalogue/new")}>
            <Plus className="w-4 h-4" />
            Nouveau
          </Button>
        }
      />

        {error && <Alert>{error}</Alert>}

        <Alert variant="warning">Le catalogue coché <strong>Rapport d&apos;impact</strong> alimente la section de téléchargement de la page <code>/impact</code>.</Alert>

        <Card className="overflow-hidden">
          <DataTable>
            <thead>
              <tr>
                <Th>Titre</Th>
                <Th>Année</Th>
                <Th>Fiche</Th>
                <Th>Lead Magnet</Th>
                <Th>Date</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {catalogues.map((cat) => (
                <tr key={cat.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{cat.title}</span>
                      {cat.is_impact_report && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          Rapport d&apos;impact
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {cat.year ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {cat.file_url ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <ImageIcon className="w-3.5 h-3.5" />
                        URL
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    {cat.is_lead_magnet ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Check className="w-3.5 h-3.5" />
                        Oui
                      </span>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(cat.uploaded_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/catalogue/${cat.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(cat.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {catalogues.length === 0 && (
            <EmptyState title="Aucun catalogue" icon={FolderOpen} />
          )}
        </Card>
      </div>
  );
}
