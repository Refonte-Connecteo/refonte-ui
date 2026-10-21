import OfferDetailView from "@/app/components/OfferDetailView";
import { getOfferDetail } from "@/lib/solutions";

const FALLBACK = getOfferDetail(
  "strategie-transformation-relation-client",
  "accompagnement-creation-centre-de-contact"
);

export default function ConsDetail() {
  if (!FALLBACK) return null;
  return <OfferDetailView offer={FALLBACK} />;
}
