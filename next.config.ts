import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable Turbopack for stability
  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig;
