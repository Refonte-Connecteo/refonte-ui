"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import {
  Card,
  Button,
  FormPage,
  Alert,
  Label,
  Input,
  Textarea,
} from "@/app/admin/components/ui";

export default function CeoMessageNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      const result = await api.createCeoMessage({
        title,
        description,
        image_url: imageUrl || undefined,
      });
      setSuccess(result.message);
      setTitle("");
      setDescription("");
      setImageUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage title="Nouveau message CEO" subtitle="Ce message s'affiche dans la section CEO de la page d'accueil" backHref="/admin/ceomessage">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du message" />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" required value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Description du message" />
            </div>

            <div>
              <Label>Image</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer le message"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
