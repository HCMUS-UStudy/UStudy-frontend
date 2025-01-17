import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["ustudy.s3.ap-southeast-1.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/login",
        permanent: true, // Use permanent: true for 308 status code, false for 307
      },
      {
        source: "/staff",
        destination: "/staff/dashboard",
        permanent: true, // Use permanent: true for 308 status code, false for 307
      },
    ];
  },
};

export default nextConfig;
