"use client";

import { useState, type FormEvent } from "react";
import { Monitor, Smartphone } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { resolveAssetUrl } from "@/lib/security";
import { HERO_PAGE_LABELS, type HeroPage, type HeroSlide } from "@/app/admin/types";
import { Card, Button, Alert, Label, Input, Select, Checkbox } from "@/app/admin/components/ui";

export type HeroSlideFormValues = Omit<HeroSlide, "id" | "description">;

/** Bouton affiché par défaut sur chaque page quand le slide n'en définit pas. */
export const DEFAULT_CTA: Record<HeroPage, string> = {
  home: "Visitez notre local",
  impact: "Télécharger le rapport",
};

export const EMPTY_SLIDE: HeroSlideFormValues = {
  page: "home",
  image_url: "",
  mobile_image_url: null,
  title: null,
  cta_label: null,
  cta_url: null,
  position: 0,
  is_active: true,
};

const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{children}</p>
);

/** Aperçu fidèle au site : image, bouton et indicateurs, sur ordinateur et sur mobile. */
function Preview({ values }: { values: HeroSlideFormValues }) {
  const desktop = resolveAssetUrl(values.image_url, "");
  const mobile = values.mobile_image_url ? resolveAssetUrl(values.mobile_image_url, "") : "";
  const label = values.cta_label && values.cta_url ? values.cta_label : DEFAULT_CTA[values.page];
  const button = (
    <span className="inline-flex rounded-full bg-[#FFA900] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#0B1D20]">
      {label}
    </span>
  );
  const dots = (
    <span className="flex items-center gap-1">
      <span className="h-1.5 w-4 rounded-full bg-[#FFA900]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
    </span>
  );

  if (!desktop) {
    return <p className="text-sm text-gray-500">Ajoutez l&apos;image ordinateur pour voir l&apos;aperçu.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
      <figure>
        <figcaption className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
          <Monitor className="h-3.5 w-3.5" /> Ordinateur
        </figcaption>
        <div className="relative aspect-[8/3] overflow-hidden rounded-xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'une image de l'API */}
          <img src={desktop} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-[4.5%] bottom-[8%] flex items-end justify-between">
            {button}
            <span className="rounded-full bg-[#0B1D20]/35 px-1.5 py-1 text-white">{dots}</span>
          </div>
        </div>
      </figure>
      <figure>
        <figcaption className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
          <Smartphone className="h-3.5 w-3.5" /> Mobile
        </figcaption>
        <div className="rounded-2xl border border-gray-200 bg-white p-1.5">
          <div className={`overflow-hidden rounded-lg bg-gray-100 ${mobile ? "aspect-[4/5]" : "aspect-[8/3]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'une image de l'API */}
            <img src={mobile || desktop} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center justify-between gap-1 pt-1.5 text-[#096475] [&>span:first-child]:scale-90 [&>span:first-child]:origin-left">
            {button}
            {dots}
          </div>
        </div>
      </figure>
    </div>
  );
}

export default function HeroSlideForm({
  initial,
  submitLabel,
  submittingLabel,
  onSubmit,
}: {
  initial: HeroSlideFormValues;
  submitLabel: string;
  submittingLabel: string;
  /** Renvoie le message de succès. */
  onSubmit: (values: HeroSlideFormValues) => Promise<string>;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof HeroSlideFormValues>(key: K, value: HeroSlideFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));
  const text = (value: string) => (value.trim() ? value : null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!values.image_url) {
      setError("L'image ordinateur est obligatoire.");
      return;
    }
    if (!!values.cta_label !== !!values.cta_url) {
      setError("Renseignez le texte et le lien du bouton, ou laissez les deux vides.");
      return;
    }
    setLoading(true);
    try {
      setSuccess(await onSubmit(values));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert>{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="space-y-5 p-6">
        <div>
          <Label htmlFor="page">Page</Label>
          <Select id="page" value={values.page} onChange={(e) => set("page", e.target.value as HeroPage)}>
            {(Object.keys(HERO_PAGE_LABELS) as HeroPage[]).map((p) => (
              <option key={p} value={p}>
                {HERO_PAGE_LABELS[p]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Image ordinateur *</Label>
          <ImageUpload value={values.image_url} onChange={(url) => set("image_url", url)} />
          <Hint>
            Format conseillé : <strong>1920 × 720 px</strong> (ratio 8:3), avec le texte déjà intégré à
            l&apos;image. Gardez le coin <strong>en bas à gauche</strong> libre : le bouton s&apos;y place.
          </Hint>
        </div>

        <div>
          <Label>Image mobile (facultative)</Label>
          <ImageUpload value={values.mobile_image_url ?? ""} onChange={(url) => set("mobile_image_url", text(url))} />
          <Hint>
            Format conseillé : <strong>1080 × 1350 px</strong> (portrait 4:5), avec un texte plus gros. Sans
            elle, le téléphone affiche l&apos;image ordinateur en entier, donc en petit. Elle n&apos;est utilisée
            que si <strong>tous les slides actifs de la page</strong> en ont une, pour que le carrousel garde
            une hauteur fixe.
          </Hint>
        </div>

        <div>
          <Label htmlFor="alt">Texte de l&apos;image</Label>
          <Input
            id="alt"
            type="text"
            maxLength={255}
            value={values.title ?? ""}
            onChange={(e) => set("title", text(e.target.value))}
            placeholder="Un partenaire de confiance. Des conseillers dédiés…"
          />
          <Hint>Recopiez le texte écrit sur l&apos;image : il est lu par Google et par les lecteurs d&apos;écran.</Hint>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ctaLabel">Texte du bouton</Label>
            <Input
              id="ctaLabel"
              type="text"
              maxLength={100}
              value={values.cta_label ?? ""}
              onChange={(e) => set("cta_label", text(e.target.value))}
              placeholder={DEFAULT_CTA[values.page]}
            />
          </div>
          <div>
            <Label htmlFor="ctaUrl">Lien du bouton</Label>
            <Input
              id="ctaUrl"
              type="text"
              maxLength={500}
              value={values.cta_url ?? ""}
              onChange={(e) => set("cta_url", text(e.target.value))}
              placeholder="/contact, #rapport ou https://…"
            />
          </div>
        </div>
        <Hint>
          Laissez vide pour garder le bouton par défaut de la page : « {DEFAULT_CTA[values.page]} ».
        </Hint>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Ordre d&apos;affichage</Label>
            <Input
              id="position"
              type="number"
              min={0}
              value={values.position}
              onChange={(e) => set("position", Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div>
            <Label>Actif</Label>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2">
              <Checkbox checked={values.is_active} onChange={(e) => set("is_active", e.target.checked)} />
              <span className="text-sm text-gray-600">{values.is_active ? "Oui" : "Non"}</span>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Aperçu</h2>
        <Preview values={values} />
      </Card>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
