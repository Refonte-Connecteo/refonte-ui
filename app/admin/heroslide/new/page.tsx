"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";

export default function HeroSlideNewPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [position, setPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/admin/login");
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await api.createHeroSlide({
        image_url: imageUrl,
        title: title || undefined,
        description: description || undefined,
        cta_label: ctaLabel || undefined,
        cta_url: ctaUrl || undefined,
        position,
        is_active: isActive,
      });
      setSuccess(result.message);
      setImageUrl("");
      setTitle("");
      setDescription("");
      setCtaLabel("");
      setCtaUrl("");
      setPosition(0);
      setIsActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Nouveau slide Hero</h1>
          <button
            onClick={() => router.push("/admin/heroslide")}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <div className="space-y-1 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Créer un slide</h2>
            <p className="text-sm text-gray-500">Ce slide s&apos;affiche dans le carousel Hero de la page d&apos;accueil</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{success}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input id="title" type="text" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Titre du slide" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-y"
                placeholder="Description du slide" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ctaLabel" className="block text-sm font-medium text-gray-700 mb-1">Label CTA</label>
                <input id="ctaLabel" type="text" value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="En savoir plus" />
              </div>
              <div>
                <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700 mb-1">URL CTA</label>
                <input id="ctaUrl" type="text" value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="/experience-client ou https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input id="position" type="number" value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actif</label>
                <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">{isActive ? "Oui" : "Non"}</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? "Création..." : "Créer le slide"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
