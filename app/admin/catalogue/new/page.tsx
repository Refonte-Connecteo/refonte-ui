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
  Checkbox,
} from "@/app/admin/components/ui";

export default function CatalogueNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [year, setYear] = useState("");
  const [isLeadMagnet, setIsLeadMagnet] = useState(false);
  const [isImpactReport, setIsImpactReport] = useState(false);
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
      const result = await api.createCatalogue({
        title,
        file_url: fileUrl,
        is_lead_magnet: isLeadMagnet,
        year: year ? Number(year) : null,
        is_impact_report: isImpactReport,
      });
      setSuccess(result.message);
      setTitle("");
      setFileUrl("");
      setYear("");
      setIsLeadMagnet(false);
      setIsImpactReport(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage title="Nouveau catalogue" backHref="/admin/catalogue">
        <Card className="p-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du catalogue" />
            </div>

            <div>
              <Label>Fiche</Label>
              <ImageUpload value={fileUrl} onChange={setFileUrl} acceptDocuments />
            </div>

            <div>
              <Label htmlFor="year">Année</Label>
              <Input id="year" type="number" min="1900" max="3000" value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025" />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_lead_magnet"
                checked={isLeadMagnet}
                onChange={(e) => setIsLeadMagnet(e.target.checked)} />
              <label htmlFor="is_lead_magnet" className="text-sm font-medium text-gray-700">Lead Magnet</label>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <Checkbox
                id="is_impact_report"
                checked={isImpactReport}
                onChange={(e) => setIsImpactReport(e.target.checked)} />
              <label htmlFor="is_impact_report" className="text-sm font-medium text-amber-900">
                Rapport d&apos;impact
                <span className="block text-xs font-normal text-amber-700">
                  Utilisé par la page /impact pour le téléchargement du rapport.
                </span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Création..." : "Créer le catalogue"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
