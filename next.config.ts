import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Production performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Optimize for production builds
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  // Set the correct workspace root for Turbopack
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

export default nextConfig;
