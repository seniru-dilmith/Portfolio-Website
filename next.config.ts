import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '', // Leave empty for default ports
        pathname: '/v0/b/**', // Match all Firebase storage paths
      },
    ],
    domains: ['cdn.buymeacoffee.com'],
  },
};

export default nextConfig;
