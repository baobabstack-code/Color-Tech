/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // Add your domain here for image optimization
  },
  experimental: {
    appDir: true,
  },
}

export default nextConfig
