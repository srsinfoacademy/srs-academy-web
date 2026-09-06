import type { MetadataRoute } from "next";

import { allCoursePrograms as programs } from "@/content/programs";
import { resources } from "@/content/resources";
import { site } from "@/content/site";
import { updates } from "@/content/updates";
import { routes, staticRoutes } from "@/lib/routes";

/**
 * Static routes plus every program, resource, and update detail page.
 * Resource/update entries only exist once real content does — `resources`/
 * `updates` stay empty until SRS Academy has real content, so these arrays
 * are naturally empty (or partial) rather than needing separate gating.
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

  const resourceEntries = resources
    .filter((r) => r.body)
    .map((resource) => ({
      url: new URL(routes.resource(resource.slug), site.url).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const updateEntries = updates.map((update) => ({
    url: new URL(routes.update(update.slug), site.url).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...programEntries, ...resourceEntries, ...updateEntries];
}
