"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { FormPage, LoadingScreen } from "@/app/admin/components/ui";
import HeroSlideForm, { EMPTY_SLIDE } from "../HeroSlideForm";

export default function HeroSlideNewPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <NewSlide />
    </Suspense>
  );
}

function NewSlide() {
  const router = useRouter();
  // La liste transmet la page en cours (?page=impact).
  const page = useSearchParams().get("page") === "impact" ? "impact" : "home";
  const initial = { ...EMPTY_SLIDE, page } as const;

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) router.push("/admin/login");
  }, [router]);

  return (
    <FormPage
      title="Nouveau slide Hero"
      subtitle="Une image qui contient déjà son texte : seuls le bouton et les indicateurs s'affichent par-dessus."
      backHref={`/admin/heroslide?page=${initial.page}`}
    >
      <HeroSlideForm
        initial={initial}
        submitLabel="Créer le slide"
        submittingLabel="Création..."
        onSubmit={async (values) => {
          const result = await api.createHeroSlide(values);
          router.push(`/admin/heroslide?page=${values.page}`);
          return result.message;
        }}
      />
    </FormPage>
  );
}
