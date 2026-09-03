import type { MetadataRoute } from "next";

import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { routes, staticRoutes } from "@/lib/routes";

/**
 * Static routes plus every program detail page. Update detail pages join once
 * their content source exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: new URL(route, site.url).toString(),
    lastModified,
    changeFrequency: (route === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const programEntries = programs.map((program) => ({
    url: new URL(routes.program(program.slug), site.url).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...programEntries];
}
