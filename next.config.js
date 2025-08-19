/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable favicon.ico and about page errors during build
  onDemandEntries: {
    // Don't try to build pages that don't exist
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

export default nextConfig