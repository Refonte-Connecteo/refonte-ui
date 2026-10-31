"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Pencil, Plus, Trash2 } from "lucide-react";
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

interface KpiStatItem {
  id: number;
  label: string;
  value: string;
  unit: string | null;
  position: number;
  is_active: boolean;
}

export default function KpiStatListPage() {
  const router = useRouter();
  const [stats, setStats] = useState<KpiStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllKpiStats();
      setStats(result.stats);
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
    if (!confirm("Voulez-vous vraiment supprimer ce KPI ?")) return;
    try {
      await api.deleteKpiStat(id);
      setStats((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleToggleActive = async (stat: KpiStatItem) => {
    try {
      await api.updateKpiStat(stat.id, { is_active: !stat.is_active });
      setStats((prev) =>
        prev.map((s) => (s.id === stat.id ? { ...s, is_active: !s.is_active } : s))
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
      <PageHeader title="Statistiques KPI"
        actions={
          <Button onClick={() => router.push("/admin/kpistat/new")}>
            <Plus className="w-4 h-4" />
            Nouveau KPI
          </Button>
        }
      />

        {error && <Alert>{error}</Alert>}

        <Card className="overflow-hidden">
          <DataTable>
            <thead>
              <tr>
                <Th>Label</Th>
                <Th>Valeur</Th>
                <Th>Unité</Th>
                <Th>Position</Th>
                <Th>Statut</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.map((stat) => (
                <tr key={stat.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{stat.label}</td>
                  <td className="px-5 py-3.5 text-gray-700">{stat.value}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{stat.unit || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-gray-700">{stat.position}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleActive(stat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${
                        stat.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 ring-gray-500/15 hover:bg-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${stat.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {stat.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/kpistat/${stat.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(stat.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {stats.length === 0 && (
            <EmptyState title="Aucun KPI" icon={BarChart3} />
          )}
        </Card>
      </div>
  );
}
