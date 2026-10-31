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
  Textarea,
} from "@/app/admin/components/ui";

export default function CeoMessageEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    try {
      const result = await api.getCeoMessage(id);
      setTitle(result.message.title);
      setDescription(result.message.description);
      setImageUrl(result.message.image_url ?? "");
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
      const result = await api.updateCeoMessage(id, {
        title,
        description,
        image_url: imageUrl || null,
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
    <FormPage title="Modifier le message CEO" backHref="/admin/ceomessage">
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
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" required value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>

            <div>
              <Label>Image</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
