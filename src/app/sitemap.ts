import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { staticRoutes } from "@/lib/routes";

/**
 * Static routes only. Program and update detail pages register their own
 * entries once their content sources exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((route) => ({
    url: new URL(route, site.url).toString(),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
