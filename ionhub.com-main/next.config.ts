import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/portals',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
