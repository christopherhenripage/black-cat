import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow images from Squarespace CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
