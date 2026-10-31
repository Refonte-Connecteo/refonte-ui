"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  Card,
  Button,
  FormPage,
  LoadingScreen,
  Alert,
  Label,
  Input,
  Textarea,
  Checkbox,
} from "@/app/admin/components/ui";

interface EventImage {
  id: number;
  image_url: string;
  caption: string | null;
  position: number;
}

export default function EventEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const result = await api.getEvent(id);
      setTitle(result.event.title);
      setDescription(result.event.description ?? "");
      setEventDate(result.event.event_date);
      setYoutubeUrl(result.event.youtube_url ?? "");
      setIsPublished(result.event.is_published);
      setEventImages(result.event.event_images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await api.updateEvent(id, {
        title,
        description: description || null,
        event_date: new Date(eventDate).toISOString(),
        youtube_url: youtubeUrl || null,
        is_published: isPublished,
      });
      setSuccess(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingScreen />;
  }

  return (
    <FormPage title="Modifier l'événement" backHref="/admin/event">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>

            <div>
              <Label htmlFor="event_date">Date *</Label>
              <Input id="event_date" type="date" required value={eventDate}
                onChange={(e) => setEventDate(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="youtube_url">URL YouTube</Label>
              <Input id="youtube_url" type="url" value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/..." />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="is_published" checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)} />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Publié</label>
            </div>

            {eventImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images existantes</label>
                <div className="grid grid-cols-2 gap-3">
                  {eventImages.map((img) => (
                    <div key={img.id} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img src={img.image_url} alt={img.caption ?? ""} className="w-full h-28 object-cover rounded" />
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {img.caption ?? `Position ${img.position}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
