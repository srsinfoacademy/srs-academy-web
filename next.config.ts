import type { NextConfig } from "next";

import legacyRedirects from "./src/content/courses/redirects.json";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  /**
   * Old URLs keep working: the retired /light tree and the old /programs
   * pages redirect permanently (308). Specific mappings from
   * src/content/courses/redirects.json come first; the catch-alls last.
   */
  async redirects() {
    return [
      ...legacyRedirects,
      { source: "/light/:path*", destination: "/", permanent: true },
      { source: "/programs/:slug", destination: "/courses", permanent: true },
    ];
  },
};

export default nextConfig;
