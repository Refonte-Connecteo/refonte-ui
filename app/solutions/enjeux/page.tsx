import type { Metadata } from "next";
import FriseEnjeux from "../../components/enjeux/FriseEnjeux";

export const metadata: Metadata = {
  title: "Vos enjeux, nos solutions CX | Connecteo",
  description:
    "Parcours client final et parcours de transformation : à chaque étape, les solutions CX mobilisées par Connecteo.",
};

export default function EnjeuxPage() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <FriseEnjeux />
    </div>
  );
}
