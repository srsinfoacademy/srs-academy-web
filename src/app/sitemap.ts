import type { MetadataRoute } from "next";

import { getAllCourses } from "@/content/courses";
import { resources } from "@/content/resources";
import { site } from "@/content/site";
import { updates } from "@/content/updates";
import { routes, staticRoutes } from "@/lib/routes";

/** Static routes plus every course, published resource and update page, on the www origin. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    ...staticRoutes.map((route) =>
      entry(route, route === routes.home ? 1 : route === routes.courses ? 0.9 : 0.7, route === routes.home ? "weekly" : "monthly"),
    ),
    ...getAllCourses().map((course) => entry(routes.course(course.slug), course.origin === "srs" ? 0.8 : 0.6, "monthly")),
    ...resources.filter((resource) => resource.body?.length).map((resource) => entry(routes.resource(resource.slug), 0.5, "monthly")),
    ...updates.map((update) => entry(routes.update(update.slug), 0.5, "monthly")),
  ];
}
