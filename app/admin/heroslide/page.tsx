"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageIcon, Pencil, Plus, Smartphone, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/security";
import { HERO_PAGE_LABELS, type HeroPage, type HeroSlide } from "@/app/admin/types";
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
import { DEFAULT_CTA } from "./HeroSlideForm";
import { clearSession } from "@/lib/session";

const PAGES = Object.keys(HERO_PAGE_LABELS) as HeroPage[];

export default function HeroSlideListPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HeroSlideList />
    </Suspense>
  );
}

function HeroSlideList() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  // Revenir sur l'onglet d'où l'on vient (?page=impact).
  const [page, setPage] = useState<HeroPage>(useSearchParams().get("page") === "impact" ? "impact" : "home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllHeroSlides();
      setSlides(result.slides);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      if (String(err).includes("Token") || String(err).includes("401")) {
        clearSession();
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

  const selectPage = (p: HeroPage) => {
    setPage(p);
    window.history.replaceState(null, "", `?page=${p}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce slide ?")) return;
    try {
      await api.deleteHeroSlide(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
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

  const visible = slides.filter((s) => (s.page ?? "home") === page);
  const active = visible.filter((s) => s.is_active);
  const mobileIncomplete = active.length > 0 && active.some((s) => !s.mobile_image_url);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slides Hero"
        subtitle="Images du haut de page. Le texte est intégré à l'image : seuls le bouton et les indicateurs s'affichent par-dessus."
        actions={
          <Button onClick={() => router.push(`/admin/heroslide/new?page=${page}`)}>
            <Plus className="w-4 h-4" />
            Nouveau slide
          </Button>
        }
      />

      <div role="tablist" aria-label="Page" className="inline-flex rounded-xl bg-gray-100 p-1">
        {PAGES.map((p) => {
          const count = slides.filter((s) => (s.page ?? "home") === p).length;
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={page === p}
              onClick={() => selectPage(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                page === p ? "bg-white text-brand-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {HERO_PAGE_LABELS[p]} <span className="ml-1 text-xs text-gray-400">{count}</span>
            </button>
          );
        })}
      </div>

      {error && <Alert>{error}</Alert>}
      {page === "impact" && active.length === 0 && (
        <Alert variant="info">
          Aucun slide actif : la page Impact &amp; Sustainability affiche son ancien bandeau (photo et texte).
        </Alert>
      )}
      {mobileIncomplete && (
        <Alert variant="info">
          Sur mobile, l&apos;image ordinateur s&apos;affiche en entier tant que chaque slide actif n&apos;a pas sa
          version mobile.
        </Alert>
      )}

      <Card className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Texte de l&apos;image</Th>
              <Th>Bouton</Th>
              <Th>Ordre</Th>
              <Th>Statut</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((slide) => (
              <tr key={slide.id} className="hover:bg-brand-50/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- miniature d'une image de l'API */}
                    <img
                      src={resolveAssetUrl(slide.image_url, "")}
                      alt=""
                      className="h-12 w-32 shrink-0 rounded-lg bg-gray-100 object-cover ring-1 ring-gray-200"
                    />
                    {slide.mobile_image_url && (
                      <span title="Version mobile fournie" className="text-brand-600">
                        <Smartphone className="h-4 w-4" aria-label="Version mobile fournie" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="max-w-xs px-5 py-3.5 text-gray-900">
                  <span className="line-clamp-2">{slide.title || <span className="text-gray-300">—</span>}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-700">
                  {slide.cta_label && slide.cta_url ? (
                    slide.cta_label
                  ) : (
                    <span className="text-gray-400">Par défaut : {DEFAULT_CTA[page]}</span>
                  )}
                </td>
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

        {visible.length === 0 && (
          <EmptyState title={`Aucun slide pour la page ${HERO_PAGE_LABELS[page]}`} icon={ImageIcon} />
        )}
      </Card>
    </div>
  );
}
