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
    <FormPage title="Nouveau slide Hero" subtitle="Ce slide s'affiche dans le carousel Hero de la page d'accueil" backHref="/admin/heroslide">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label>Image *</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div>
              <Label htmlFor="title">Titre</Label>
              <Input id="title" type="text" value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du slide" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={3}
                placeholder="Description du slide" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaLabel">Label CTA</Label>
                <Input id="ctaLabel" type="text" value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="En savoir plus" />
              </div>
              <div>
                <Label htmlFor="ctaUrl">URL CTA</Label>
                <Input id="ctaUrl" type="text" value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="/experience-client ou https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" type="number" value={position}
                  onChange={(e) => setPosition(Number(e.target.value))} />
              </div>
              <div>
                <Label>Actif</Label>
                <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                  <Checkbox checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)} />
                  <span className="text-sm text-gray-600">{isActive ? "Oui" : "Non"}</span>
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer le slide"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
