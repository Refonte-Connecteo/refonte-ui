import type { NextConfig } from "next";

// Image Docker uniquement (front/Dockerfile) : serveur autonome, sans node_modules complet.
const dockerBuild = process.env.NEXT_OUTPUT_STANDALONE === "1";

const nextConfig: NextConfig = {
  ...(dockerBuild && { output: "standalone" as const }),
  // Anciennes adresses encore visitées.
  async redirects() {
    return [
      { source: "/test", destination: "/solutions", permanent: true },
      { source: "/carriere", destination: "/carriere2", permanent: true },
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
