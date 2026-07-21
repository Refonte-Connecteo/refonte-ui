"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import OfferDetailPage from "../../components/offer-detail";
import { OFFERS } from "../../components/offer-detail";

export default function OfferSlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  if (!slug || !OFFERS[slug]) {
    notFound();
  }

  return <OfferDetailPage offerId={slug} />;
}
