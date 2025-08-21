import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/Color-Tech', // Commented out for local development
  reactStrictMode: true, // Recommended for identifying potential problems
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    domains: ["localhost"],
    unoptimized: false,
  },
  compiler: {
    // Remove all console.log messages in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
