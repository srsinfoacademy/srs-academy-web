import type { NextConfig } from "next";

import legacyRedirects from "./src/content/courses/redirects.json";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy without nonces, so pages stay statically
 * generated (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 * 'unsafe-inline' scripts cover Next's inline bootstrap and the theme init
 * script; 'unsafe-eval' is development-only. vercel.live and pusher are the
 * Vercel preview toolbar/comments; images.unsplash.com serves the stand-in
 * photos (next/image normally proxies them through 'self'); www.google.com
 * frames the optional Google Maps embed set in the admin Contact Page;
 * connect-src vercel.com lets the admin upload cover images straight to the
 * private Blob store (vercel.com/api/blob), past the 4.5 MB function limit.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live`,
  "style-src 'self' 'unsafe-inline' https://vercel.live",
  "img-src 'self' blob: data: https://images.unsplash.com https://vercel.live https://vercel.com",
  "font-src 'self' data: https://vercel.live https://assets.vercel.com",
  "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com https://vercel.com",
  "frame-src 'self' https://vercel.live https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      ...legacyRedirects,
      { source: "/light/:path*", destination: "/", permanent: true },
      { source: "/programs/:slug", destination: "/courses", permanent: true },
    ];
  },
};

export default nextConfig;
