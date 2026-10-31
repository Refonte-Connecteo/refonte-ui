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

interface HeroSlideItem {
  id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
  position: number;
  is_active: boolean;
}

export default function HeroSlideListPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllHeroSlides();
      setSlides(result.slides);
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
    if (!confirm("Voulez-vous vraiment supprimer ce slide ?")) return;
    try {
      await api.deleteHeroSlide(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleToggleActive = async (slide: HeroSlideItem) => {
    try {
      await api.updateHeroSlide(slide.id, { is_active: !slide.is_active });
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s))
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
      <PageHeader title="Slides Hero"
        actions={
          <Button onClick={() => router.push("/admin/heroslide/new")}>
            <Plus className="w-4 h-4" />
            Nouveau slide
          </Button>
        }
      />

        {error && <Alert>{error}</Alert>}

        <Card className="overflow-hidden">
          <DataTable>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th>Titre</Th>
                <Th>Position</Th>
                <Th>Statut</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-brand-600 text-xs">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {slide.image_url.length > 40 ? slide.image_url.slice(0, 40) + "..." : slide.image_url}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{slide.title || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-gray-700">{slide.position}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${
                        slide.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 ring-gray-500/15 hover:bg-gray-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${slide.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {slide.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/heroslide/${slide.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(slide.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {slides.length === 0 && (
            <EmptyState title="Aucun slide" icon={ImageIcon} />
          )}
        </Card>
      </div>
  );
}
