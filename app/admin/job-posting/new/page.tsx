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

export default function JobPostingNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [contractType, setContractType] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [ficheUrl, setFicheUrl] = useState("");
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
      const result = await api.createJobPosting({
        title,
        contract_type: contractType,
        description: description || undefined,
        external_url: externalUrl || undefined,
        fiche_url: ficheUrl || undefined,
        is_active: isActive,
      });
      setSuccess(result.message);
      setTitle("");
      setContractType("");
      setDescription("");
      setExternalUrl("");
      setFicheUrl("");
      setIsActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage title="Nouvelle offre d'emploi" subtitle="Remplissez les informations de l'offre d'emploi" backHref="/admin/job-posting">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'offre" />
            </div>

            <div>
              <Label htmlFor="contract_type">Type de contrat *</Label>
              <Input id="contract_type" type="text" required value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                placeholder="CDI, CDD, Stage..." />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Description de l'offre" />
            </div>

            <div>
              <Label htmlFor="external_url">URL externe</Label>
              <Input id="external_url" type="url" value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://..." />
            </div>

            <div>
              <Label>Fiche de poste</Label>
              <ImageUpload value={ficheUrl} onChange={setFicheUrl} acceptDocuments />
            </div>

            <div>
              <Label>Actif</Label>
              <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                <Checkbox checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)} />
                <span className="text-sm text-gray-600">{isActive ? "Oui" : "Non"}</span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer l'offre"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
