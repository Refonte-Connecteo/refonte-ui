import Image from "next/image";

/* Seul endroit à modifier pour changer le logo de l'administration. */
const LOGO_SRC = "/images/logo-admin.png";
const LOGO_WIDTH = 640;
const LOGO_HEIGHT = 145;

export default function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Connecteo"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className}
      loading="eager"
    />
  );
}
