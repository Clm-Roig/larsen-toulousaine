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

  netlify: {
    edgeMiddleware: false, // prevent Netlify from deploying prisma in Edge Middleware
  },
};

module.exports = withPWA(nextConfig);
