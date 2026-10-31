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
  Checkbox,
} from "@/app/admin/components/ui";

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
    <FormPage title="Nouvel article" backHref="/admin/article">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Description de l'article" />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Input id="type" type="text" value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Ex: blog, whitepaper, guide..." />
            </div>

            <div>
              <Label>Image de couverture</Label>
              <ImageUpload value={coverUrl} onChange={setCoverUrl} />
            </div>

            <div>
              <Label>Fichier</Label>
              <ImageUpload value={fileUrl} onChange={setFileUrl} acceptDocuments />
            </div>

            <div>
              <Label htmlFor="published_at">Date de publication</Label>
              <Input id="published_at" type="datetime-local" value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)} />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)} />
                Publié
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox checked={isLeadMagnet}
                  onChange={(e) => setIsLeadMagnet(e.target.checked)} />
                Lead Magnet
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer l'article"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
