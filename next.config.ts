import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['react-hook-form'] = path.resolve(__dirname, 'node_modules/react-hook-form');
    return config;
  },
};

export default nextConfig;
