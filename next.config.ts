import type { NextConfig } from "next";

// Image Docker uniquement (front/Dockerfile) : serveur autonome, sans node_modules complet.
const dockerBuild = process.env.NEXT_OUTPUT_STANDALONE === "1";
const isDev = process.env.NODE_ENV === "development";

/** Origine de l'API (images, fichiers, appels fetch), déduite de NEXT_PUBLIC_API_URL. */
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").origin;
  } catch {
    return "http://localhost:3000";
  }
})();

/**
 * Politique de sécurité du contenu (CSP) statique, selon la doc Next.js (« Without Nonces ») :
 * les pages restent pré-générées. 'unsafe-inline' reste nécessaire aux scripts inline de Next.js ;
 * le gain principal : aucun script ni connexion vers un domaine tiers, pas d'objet/plugin,
 * pas d'intégration du site dans une iframe (clickjacking), formulaires vers le site uniquement.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${apiOrigin} https://images.pexels.com`,
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}${isDev ? " ws: wss:" : ""}`,
  `media-src 'self' ${apiOrigin}`,
  // Aperçu des PDF des actualités : affichés depuis une URL blob: locale.
  "frame-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // Les adresses complètes (dont les liens d'invitation) ne fuient pas vers les autres sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Ignoré par les navigateurs en HTTP ; actif dès que le site est servi en HTTPS.
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  ...(dockerBuild && { output: "standalone" as const }),
  // Anciennes adresses encore visitées.
  async redirects() {
    return [
      { source: "/test", destination: "/solutions", permanent: true },
      { source: "/carriere", destination: "/carriere2", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // L'espace d'administration ne doit jamais apparaître dans les moteurs de recherche.
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  images: {
    // En Docker, « localhost:3000 » désigne le conteneur du front, pas l'API : l'optimiseur
    // ne pourrait pas télécharger les images de l'API. Le navigateur les charge alors directement.
    unoptimized: process.env.NEXT_IMAGES_UNOPTIMIZED === "1",
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "http", hostname: "localhost", port: "3001" },
    ],
  },
};

export default nextConfig;
