import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '', // default ports
        pathname: '/v0/b/**', // Firebase storage paths
      },
      {
        protocol: 'https',
        hostname: 'cdn.buymeacoffee.com',
        port: '', // default ports
        pathname: '/buttons/v2/**', // Buy Me A Coffee buttons
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
