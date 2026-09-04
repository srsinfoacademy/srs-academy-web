/**
 * Route table for the light-theme preview. Kept separate from
 * `@/lib/routes` (the production dark-theme table) so the two site trees
 * never share — or accidentally collide on — a path.
 */
export const lightRoutes = {
  home: "/light",
  courses: "/light/courses",
  course: (slug: string) => `/light/courses/${slug}`,
  about: "/light/about",
  admissions: "/light/admissions",
  corporateLearning: "/light/corporate-learning",
  creativeVocational: "/light/creative-vocational",
  gallery: "/light/gallery",
  resources: "/light/resources",
  updates: "/light/updates",
  update: (slug: string) => `/light/updates/${slug}`,
  contact: "/light/contact",
  faq: "/light/faq",
  jobs: "/light/jobs",
  privacy: "/light/privacy",
  terms: "/light/terms",
  refundPolicy: "/light/refund-policy",
  accessibility: "/light/accessibility",
} as const;
