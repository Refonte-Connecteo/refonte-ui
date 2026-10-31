"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import { Card, Button, FormPage, Alert, Label, Input } from "@/app/admin/components/ui";

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
    <FormPage title="Nouvelle image d'événement" subtitle="Ajoutez une image à un événement" backHref="/admin/event-image">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="eventId">ID Événement *</Label>
              <Input id="eventId" type="number" required value={eventId || ""}
                onChange={(e) => setEventId(Number(e.target.value))}
                placeholder="ID de l'événement" />
            </div>

            <div>
              <Label>Image *</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div>
              <Label htmlFor="caption">Légende</Label>
              <Input id="caption" type="text" value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Légende de l'image" />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" type="number" value={position}
                onChange={(e) => setPosition(Number(e.target.value))} />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer l'image"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
