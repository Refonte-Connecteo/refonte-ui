"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import {
  Card,
  Button,
  FormPage,
  LoadingScreen,
  Alert,
  Label,
  Input,
} from "@/app/admin/components/ui";

export default function EventImageEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [eventId, setEventId] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [position, setPosition] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      const result = await api.getEventImage(id);
      setEventId(result.eventImage.event_id);
      setImageUrl(result.eventImage.image_url);
      setCaption(result.eventImage.caption ?? "");
      setPosition(result.eventImage.position);
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
      const result = await api.updateEventImage(id, {
        event_id: eventId,
        image_url: imageUrl,
        caption: caption || null,
        position,
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
    <FormPage title="Modifier l'image" backHref="/admin/event-image">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="eventId">ID Événement *</Label>
              <Input id="eventId" type="number" required value={eventId || ""}
                onChange={(e) => setEventId(Number(e.target.value))} />
            </div>

            <div>
              <Label>Image *</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div>
              <Label htmlFor="caption">Légende</Label>
              <Input id="caption" type="text" value={caption}
                onChange={(e) => setCaption(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" type="number" value={position}
                onChange={(e) => setPosition(Number(e.target.value))} />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
