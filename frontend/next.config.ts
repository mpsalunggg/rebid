import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
}

export default nextConfig;
