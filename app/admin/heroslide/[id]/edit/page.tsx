"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { FormPage, LoadingScreen, Alert } from "@/app/admin/components/ui";
import HeroSlideForm, { type HeroSlideFormValues } from "../../HeroSlideForm";

export default function HeroSlideEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [initial, setInitial] = useState<HeroSlideFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.push("/admin/login");
      return;
    }
    api
      .getHeroSlide(id)
      .then(({ slide }) =>
        setInitial({
          page: slide.page ?? "home",
          image_url: slide.image_url,
          mobile_image_url: slide.mobile_image_url ?? null,
          title: slide.title,
          cta_label: slide.cta_label,
          cta_url: slide.cta_url,
          position: slide.position,
          is_active: slide.is_active,
        }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
  }, [id, router]);

  if (error) {
    return (
      <FormPage title={`Modifier le slide #${id}`} backHref="/admin/heroslide">
        <Alert>{error}</Alert>
      </FormPage>
    );
  }
  if (!initial) return <LoadingScreen />;

  return (
    <FormPage title={`Modifier le slide #${id}`} backHref={`/admin/heroslide?page=${initial.page}`}>
      <HeroSlideForm
        initial={initial}
        submitLabel="Mettre à jour"
        submittingLabel="Mise à jour..."
        onSubmit={async (values) => (await api.updateHeroSlide(id, values)).message}
      />
    </FormPage>
  );
}
