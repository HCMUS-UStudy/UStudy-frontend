import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["ustudy.s3.ap-southeast-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ustudy.s3.ap-southeast-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
