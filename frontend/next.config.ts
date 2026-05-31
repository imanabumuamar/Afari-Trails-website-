import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(process.cwd()),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Allow any local image path, including cache-busting query strings
    // (e.g. /images/...?v=123) used when re-uploading CMS media.
    localPatterns: [
      {
        pathname: "/**",
        // search omitted on purpose so ?v=timestamp is allowed.
      },
    ],
  },
};

export default nextConfig;
