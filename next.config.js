/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 300, // in seconds
  },
};

module.exports = nextConfig;
