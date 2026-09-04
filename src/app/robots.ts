import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /light is a parallel design preview (already noindex/nofollow via its
      // own route-group metadata) — disallowed here too so crawlers don't
      // spend budget on it or risk surfacing it as a duplicate of the
      // canonical dark-theme pages.
      disallow: "/light",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
