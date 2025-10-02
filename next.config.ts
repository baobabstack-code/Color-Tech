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
    dangerouslyAllowSVG: true, // Allow SVG optimization for fallback images
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.colortech.co.zw https://*.clerk.accounts.dev https://*.clerk.com; connect-src 'self' https://clerk.colortech.co.zw https://*.clerk.accounts.dev https://*.clerk.com; sandbox;",
    unoptimized: false,
    // Loader configuration for better Cloudinary integration
    loader: "default",
    // Configure allowed quality values
    qualities: [75, 80, 85, 90, 95, 100],
  },
  compiler: {
    // Remove all console.log messages in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
