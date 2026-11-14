import Image from "next/image";

/** Portraits fournis dans public/images/fond (format portrait, style Connecteo turquoise et orange). */
export const PORTRAITS = {
  fond1: "/images/fond/fond1.jpg",
  fond2: "/images/fond/fond2.jpg",
  fond3: "/images/fond/fond3.jpg",
  fond4: "/images/fond/fond4.jpg",
  fond5: "/images/fond/fond5.jpg",
  fond6: "/images/fond/fond6.jpg",
  fond7: "/images/fond/fond7.jpg",
  fond8: "/images/fond/fond8.jpg",
} as const;

// Carte de gauche, centrale (devant), de droite.
const LAYOUT = [
  "left-0 top-[14%] z-0 w-[42%] -rotate-[8deg] group-hover:-translate-x-3 group-hover:-rotate-[11deg]",
  "left-1/2 top-0 z-10 w-[50%] -translate-x-1/2 group-hover:-translate-y-2",
  "right-0 top-[18%] z-0 w-[42%] rotate-[7deg] group-hover:translate-x-3 group-hover:rotate-[10deg]",
];
const DELAYS = ["-2s", "0s", "-4.5s"];

/**
 * Trois portraits en éventail, purement décoratifs (alt vide, aria-hidden).
 * Les images sources font ~550 × 750 px : on ne les affiche jamais plus larges que ~300 px pour rester net.
 */
export default function PortraitStack({
  images,
  className = "",
}: {
  images: [string, string, string];
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`group relative aspect-[5/4] ${className}`}>
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute transition-transform duration-500 ease-out ${LAYOUT[i]}`}
        >
          <div className="portrait-float" style={{ animationDelay: DELAYS[i] }}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-[0_24px_50px_-20px_rgba(11,29,32,0.55)] ring-4 ring-white/80">
              <Image src={src} alt="" fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
