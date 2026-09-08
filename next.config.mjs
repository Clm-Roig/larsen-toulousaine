import withPWADefault from "@ducanh2912/next-pwa";
import { URL } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60 * 30,
    remotePatterns: [new URL("https://picsum.photos/**")],
  },
  // Turbopack is causing issues on Windows + Prisma (symlick not working)
  // turbopack: {},
};

// eslint-disable-next-line no-undef
const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWADefault({
  dest: "public",
  disable: isDev,
});

// Wrapper only in production mode, otherwise it will break the dev server
export default isDev ? nextConfig : withPWA(nextConfig);
