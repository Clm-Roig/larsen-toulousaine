import withPWADefault from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60 * 30,
  },
  // Turbopack is causing issues on Windows + Prisma (symlick not working)
  // turbopack: {},
};

const withPWA = withPWADefault({
  dest: "public",
  // eslint-disable-next-line no-undef
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);
