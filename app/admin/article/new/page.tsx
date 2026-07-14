"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";

export default function ArticleNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isLeadMagnet, setIsLeadMagnet] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
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
      const result = await api.createArticle({
        title,
        description: description || undefined,
        type: type || undefined,
        cover_url: coverUrl || undefined,
        file_url: fileUrl || undefined,
        is_lead_magnet: isLeadMagnet,
        is_published: isPublished,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      });
      setSuccess(result.message);
      setTitle("");
      setDescription("");
      setType("");
      setCoverUrl("");
      setFileUrl("");
      setIsLeadMagnet(false);
      setIsPublished(false);
      setPublishedAt("");
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
          <h1 className="text-xl font-bold text-gray-900">Nouvel article</h1>
          <button
            onClick={() => router.push("/admin/article")}
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
            <h2 className="text-lg font-semibold text-gray-900">Créer un article</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{success}</div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Titre de l'article" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-y"
                placeholder="Description de l'article" />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input id="type" type="text" value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Ex: blog, whitepaper, guide..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
              <ImageUpload value={coverUrl} onChange={setCoverUrl} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
              <ImageUpload value={fileUrl} onChange={setFileUrl} />
            </div>

            <div>
              <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">Date de publication</label>
              <input id="published_at" type="datetime-local" value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Publié
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isLeadMagnet}
                  onChange={(e) => setIsLeadMagnet(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Lead Magnet
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? "Création..." : "Créer l'article"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
