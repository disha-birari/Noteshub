import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(process.cwd(), '..'),
  },
  allowedDevOrigins: ['192.168.0.101', 'localhost:3000', 'localhost:3001'],
};

export default nextConfig;
