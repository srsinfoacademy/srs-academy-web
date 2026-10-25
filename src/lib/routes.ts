/**
 * Internal routes of the public website. Legal documents, the sitemap and
 * the footer read these so they cannot drift apart.
 */
export const routes = {
  home: "/",
  about: "/about",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  technicalTraining: "/technical-training",
  admissions: "/admissions",
  resources: "/resources",
  resource: (slug: string) => `/resources/${slug}`,
  updates: "/updates",
  update: (slug: string) => `/updates/${slug}`,
  contact: "/contact",
  faq: "/faq",
  privacy: "/privacy",
  terms: "/terms",
  refundPolicy: "/refund-policy",
  accessibility: "/accessibility",
} as const;

/** Static routes only — dynamic segments are added by the sitemap from data. */
export const staticRoutes: readonly string[] = [
  routes.home,
  routes.about,
  routes.courses,
  routes.technicalTraining,
  routes.admissions,
  routes.resources,
  routes.updates,
  routes.contact,
  routes.faq,
  routes.privacy,
  routes.terms,
  routes.refundPolicy,
  routes.accessibility,
];
