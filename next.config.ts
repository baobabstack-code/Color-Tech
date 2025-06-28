import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/Color-Tech', // Commented out for local development
  reactStrictMode: true, // Recommended for identifying potential problems
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  compiler: {
    // Remove all console.log messages in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
