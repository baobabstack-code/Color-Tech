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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    domains: ["localhost"],
    // Image optimization settings for better performance
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
    dangerouslyAllowSVG: false, // Security: disable SVG optimization
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    // Loader configuration for better Cloudinary integration
    loader: "default",
  },
  compiler: {
    // Remove all console.log messages in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
