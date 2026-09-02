export type ResourceType = "Article" | "Guide" | "Download" | "Career";

export type Resource = {
  slug: string;
  title: string;
  type: ResourceType;
  category: string;
  summary: string;
  /** Present for downloads; absent for articles and guides. */
  fileNote?: string;
};

/**
 * Category set is illustrative in the design and marked "confirm final
 * taxonomy before build", so it is treated as provisional.
 */
export const resourceCategories = [
  "All",
  "Articles",
  "Guides",
  "Downloads",
  "Career Resources",
  "Technology Resources",
  "Academic Resources",
] as const;

/**
 * Resources.
 *
 * Deliberately empty. The design set is explicit: "No articles are
 * fabricated; empty state ships until real content exists."
 */
export const resources: Resource[] = [];
