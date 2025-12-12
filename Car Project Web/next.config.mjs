/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react', 'lucide-react'],
  },
  images: {
    unoptimized: false, // ✅ Enable optimization
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Fix webpack module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      util: false,
      url: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      path: false,
    };
    
    // Optimize webpack cache
    if (dev) {
      config.cache = {
        type: 'filesystem',
      };
    }
    
    return config;
  },
  // Add empty turbopack config to silence the error
  // Turbopack is enabled by default in Next.js 16
  turbopack: {},
};

export default nextConfig;

