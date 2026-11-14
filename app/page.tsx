import HeroSection from "./components/HeroSection";
import MotDuDG from "./components/MotDuDG";
import NosReferences from "./components/NosReferences";
import CtaSection from "./components/CtaSection";
import StickyStack from "./components/StickyStack";

export default function Home() {
  return (
    <>
      <HeroSection
        page="home"
        heading="Connecteo, votre partenaire de l'expérience client"
        defaultCta={{ label: "Visitez notre local", href: "https://my.matterport.com/show/?m=42v2xCu5D9F" }}
        fallbackSlides={[
          {
            image: "/images/hero/connecteo_hero_2.png",
            alt: "Un partenaire de confiance. Des conseillers dédiés, formés et engagés pour fidéliser vos clients au quotidien.",
          },
        ]}
      />
      <StickyStack top={<MotDuDG />} bottom={<NosReferences />} />
      <CtaSection />
    </>
  );
}
