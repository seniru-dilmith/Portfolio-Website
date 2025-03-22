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
      {
        protocol: 'https',
        hostname: 'cdn.buymeacoffee.com',
        port: '', // Leave empty for default ports
        pathname: '/buttons/v2/**', // Match all Buy Me A Coffee buttons
      }
    ],
  },
};

export default nextConfig;
