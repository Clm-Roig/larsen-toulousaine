// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60 * 30, // 30min in seconds
  },

  turbopack: {},
};

module.exports = withPWA(nextConfig);
