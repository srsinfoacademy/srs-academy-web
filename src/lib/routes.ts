/**
 * Every internal route the public website will serve. Keeping them in one
 * place means navigation, footer, breadcrumbs and the sitemap cannot drift
 * apart from each other.
 *
 * Phase 1 implements the foundation only; routes marked as planned have no
 * page yet but are already part of the information architecture.
 */
export const routes = {
  home: "/",
  about: "/about",
  programs: "/programs",
  program: (slug: string) => `/programs/${slug}`,
  admissions: "/admissions",
  resources: "/resources",
  updates: "/updates",
  update: (slug: string) => `/updates/${slug}`,
  contact: "/contact",
  faq: "/faq",
  privacy: "/privacy",
  terms: "/terms",
  refundPolicy: "/refund-policy",
  accessibility: "/accessibility",
} as const;

/** Static routes only — dynamic segments are added by their own generators. */
export const staticRoutes: readonly string[] = [
  routes.home,
  routes.about,
  routes.programs,
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

/** True when `pathname` is the given route or one of its descendants. */
export function isRouteActive(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}
