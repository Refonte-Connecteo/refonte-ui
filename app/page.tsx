import HeroSection from "./components/HeroSection";
import SecteursActivite from "./components/SecteursActivite";
import MotDuDG from "./components/MotDuDG";
import NosReferences from "./components/NosReferences";
import CtaSection from "./components/CtaSection";
import StickyStack from "./components/StickyStack";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StickyStack top={<MotDuDG />} bottom={<NosReferences />} />
      <CtaSection />
    </>
  );
}
