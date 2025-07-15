/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'], // Add your domain here for image optimization
  },
  experimental: {
    appDir: true,
  },
}

export default nextConfig
