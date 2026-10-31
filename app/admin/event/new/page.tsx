"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Card,
  Button,
  FormPage,
  Alert,
  Label,
  Input,
  Textarea,
  Checkbox,
} from "@/app/admin/components/ui";

export default function EventNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
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
      const result = await api.createEvent({
        title,
        description: description || undefined,
        event_date: new Date(eventDate).toISOString(),
        youtube_url: youtubeUrl || undefined,
        is_published: isPublished,
      });
      setSuccess(result.message);
      setTitle("");
      setDescription("");
      setEventDate("");
      setYoutubeUrl("");
      setIsPublished(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage title="Nouvel événement" subtitle="Remplissez les informations de l'événement" backHref="/admin/event">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'événement" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Description de l'événement" />
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

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer l'événement"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
