/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      "@headlessui/react",
      "@heroicons/react",
      "lucide-react",
    ],
  },

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // ❌ Do NOT include `turbopack` here
  // ❌ Do NOT define a `webpack` function here unless absolutely needed
};

export default nextConfig;

