/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    serverActions: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
