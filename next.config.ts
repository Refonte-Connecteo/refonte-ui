import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Anciennes adresses encore visitées.
  async redirects() {
    return [
      { source: "/test", destination: "/solutions", permanent: true },
      { source: "/carriere", destination: "/carriere2", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "http", hostname: "localhost", port: "3001" },
    ],
  },
};

export default nextConfig;
