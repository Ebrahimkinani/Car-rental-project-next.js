/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react', 'lucide-react'],
  },
  images: {
    unoptimized: true,
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
    
    // Handle Firebase modules properly
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase/app': 'firebase/app',
        'firebase/auth': 'firebase/auth',
        'firebase/firestore': 'firebase/firestore',
        'firebase/analytics': 'firebase/analytics',
      };
    }
    
    // Optimize webpack cache
    if (dev) {
      config.cache = {
        type: 'filesystem',
      };
    }
    
    return config;
  },
};

export default nextConfig;

