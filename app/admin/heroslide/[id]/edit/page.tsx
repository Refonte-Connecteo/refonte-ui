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
  Checkbox,
} from "@/app/admin/components/ui";

export default function HeroSlideEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchSlide();
  }, []);

  const fetchSlide = async () => {
    try {
      const result = await api.getHeroSlide(id);
      setImageUrl(result.slide.image_url);
      setTitle(result.slide.title ?? "");
      setDescription(result.slide.description ?? "");
      setCtaLabel(result.slide.cta_label ?? "");
      setCtaUrl(result.slide.cta_url ?? "");
      setPosition(result.slide.position);
      setIsActive(result.slide.is_active);
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
      const result = await api.updateHeroSlide(id, {
        image_url: imageUrl,
        title: title || null,
        description: description || null,
        cta_label: ctaLabel || null,
        cta_url: ctaUrl || null,
        position,
        is_active: isActive,
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
    <FormPage title={`Modifier le slide #${id}`} backHref="/admin/heroslide">
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
                onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaLabel">Label CTA</Label>
                <Input id="ctaLabel" type="text" value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ctaUrl">URL CTA</Label>
                <Input id="ctaUrl" type="text" value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)} />
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
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
