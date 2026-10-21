import { notFound } from "next/navigation";
import OfferDetailView from "@/app/components/OfferDetailView";
import { getAllOfferParams, getOfferDetail } from "@/lib/solutions";

export function generateStaticParams() {
  return getAllOfferParams().map((p) => ({
    expertise: p.expertise,
    offer: p.offer,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ expertise: string; offer: string }>;
}) {
  const { expertise, offer } = await params;
  const detail = getOfferDetail(expertise, offer);
  if (!detail) return { title: "Offre introuvable" };
  return { title: `${detail.title} — Connecteo`, description: detail.tagline };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ expertise: string; offer: string }>;
}) {
  const { expertise, offer } = await params;
  const detail = getOfferDetail(expertise, offer);
  if (!detail) notFound();

  return <OfferDetailView offer={detail} />;
}
