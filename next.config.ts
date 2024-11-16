import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true, // Use permanent: true for 308 status code, false for 307
      },
    ];
  },
};

export default nextConfig;
