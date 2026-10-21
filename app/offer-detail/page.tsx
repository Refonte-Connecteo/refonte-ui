import OfferDetailView from "@/app/components/OfferDetailView";
import { getOfferDetail } from "@/lib/solutions";

const FALLBACK = getOfferDetail(
  "experience-client-omnicanale-externalisee",
  "accueil-assistance-client-citoyenne"
);

export default function OfferDetail() {
  if (!FALLBACK) return null;
  return <OfferDetailView offer={FALLBACK} />;
}
