"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";

export default function EventImageNewPage() {
  const router = useRouter();
  const [eventId, setEventId] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [position, setPosition] = useState(0);
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
      const result = await api.createEventImage({
        event_id: eventId,
        image_url: imageUrl,
        caption: caption || undefined,
        position: position || undefined,
      });
      setSuccess(result.message);
      setEventId(0);
      setImageUrl("");
      setCaption("");
      setPosition(0);
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
          <h1 className="text-xl font-bold text-gray-900">Nouvelle image d&apos;événement</h1>
          <button
            onClick={() => router.push("/admin/event-image")}
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
            <h2 className="text-lg font-semibold text-gray-900">Créer une image</h2>
            <p className="text-sm text-gray-500">Ajoutez une image à un événement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{success}</div>
            )}

            <div>
              <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">ID Événement *</label>
              <input id="eventId" type="number" required value={eventId || ""}
                onChange={(e) => setEventId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="ID de l'événement" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Légende</label>
              <input id="caption" type="text" value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Légende de l'image" />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input id="position" type="number" value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? "Création..." : "Créer l'image"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
