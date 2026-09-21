import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Serve AVIF where the browser takes it, WebP everywhere else. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
