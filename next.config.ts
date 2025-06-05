import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/Color-Tech',
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
