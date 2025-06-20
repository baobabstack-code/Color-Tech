import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/Color-Tech', // Commented out for local development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
