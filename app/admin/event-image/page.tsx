"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
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

interface EventImageItem {
  id: number;
  event_id: number;
  image_url: string;
  caption: string | null;
  position: number;
  event: { id: number; title: string };
}

export default function EventImageListPage() {
  const router = useRouter();
  const [images, setImages] = useState<EventImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllEventImages();
      setImages(result.eventImages);
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
    if (!confirm("Voulez-vous vraiment supprimer cette image ?")) return;
    try {
      await api.deleteEventImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Images d'événements"
        actions={
          <Button onClick={() => router.push("/admin/event-image/new")}>
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
                <Th>Image</Th>
                <Th>Événement</Th>
                <Th>Légende</Th>
                <Th>Position</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {images.map((img) => (
                <tr key={img.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {img.image_url ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <ImageIcon className="w-3.5 h-3.5" />
                        URL
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{img.event?.title}</td>
                  <td className="px-5 py-3.5 text-gray-700 max-w-xs truncate">{img.caption ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-500">{img.position}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/event-image/${img.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(img.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {images.length === 0 && (
            <EmptyState title="Aucune image d'événement" icon={ImageIcon} />
          )}
        </Card>
      </div>
  );
}
