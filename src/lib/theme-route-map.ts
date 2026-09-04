/**
 * Maps a URL between the dark "Knowledge OS" site and the `/light` preview.
 *
 * The two trees don't share a 1:1 URL shape (`/programs` vs `/light/courses`,
 * for instance), and only a subset of their dynamic detail pages point at
 * the same underlying content — so this is an explicit table plus a couple
 * of narrow rules, not a blind prefix rewrite. Anything not covered here
 * falls back to the destination theme's homepage, per spec.
 */

/** Exact, non-dynamic path pairs. Keys and values never include query/hash. */
const DARK_TO_LIGHT_STATIC: Record<string, string> = {
  "/": "/light",
  "/about": "/light/about",
  "/accessibility": "/light/accessibility",
  "/admissions": "/light/admissions",
  "/contact": "/light/contact",
  "/faq": "/light/faq",
  "/privacy": "/light/privacy",
  "/programs": "/light/courses",
  "/refund-policy": "/light/refund-policy",
  "/resources": "/light/resources",
  "/terms": "/light/terms",
  "/updates": "/light/updates",
};

const LIGHT_TO_DARK_STATIC: Record<string, string> = Object.fromEntries(
  Object.entries(DARK_TO_LIGHT_STATIC).map(([dark, light]) => [light, dark]),
);

/**
 * `/programs/[slug]` and `/light/courses/[slug]` are independent catalogues
 * (the light site has ~20 sample courses; only the one real confirmed
 * program overlaps). A slug only maps across themes if it names a program
 * that genuinely exists on both sides.
 */
const SHARED_PROGRAM_SLUGS = new Set<string>(["full-stack-web-development"]);

const DARK_HOME = "/";
const LIGHT_HOME = "/light";

function withQueryAndHash(path: string, search: string, hash: string): string {
  return `${path}${search}${hash}`;
}

/**
 * @param pathname Current path only (no query string, no hash) — e.g. from
 *   `usePathname()`.
 * @param search Query string including its leading `?`, or `""`.
 * @param hash Hash including its leading `#`, or `""`.
 */
export function getThemeCounterpartUrl(
  pathname: string,
  search: string,
  hash: string,
): { url: string; isLight: boolean } {
  const isLight = pathname === "/light" || pathname.startsWith("/light/");

  if (isLight) {
    // /light/updates/:slug -> /updates/:slug (same content both sides).
    const updateMatch = /^\/light\/updates\/([^/]+)$/.exec(pathname);
    if (updateMatch) {
      return {
        url: withQueryAndHash(`/updates/${updateMatch[1]}`, search, hash),
        isLight: true,
      };
    }

    // /light/courses/:slug -> /programs/:slug, only for shared programs.
    const courseMatch = /^\/light\/courses\/([^/]+)$/.exec(pathname);
    if (courseMatch) {
      if (SHARED_PROGRAM_SLUGS.has(courseMatch[1])) {
        return {
          url: withQueryAndHash(`/programs/${courseMatch[1]}`, search, hash),
          isLight: true,
        };
      }
      return { url: DARK_HOME, isLight: true };
    }

    const mapped = LIGHT_TO_DARK_STATIC[pathname];
    return {
      url: mapped ? withQueryAndHash(mapped, search, hash) : DARK_HOME,
      isLight: true,
    };
  }

  // Dark -> light.
  const updateMatch = /^\/updates\/([^/]+)$/.exec(pathname);
  if (updateMatch) {
    return {
      url: withQueryAndHash(`/light/updates/${updateMatch[1]}`, search, hash),
      isLight: false,
    };
  }

  const programMatch = /^\/programs\/([^/]+)$/.exec(pathname);
  if (programMatch) {
    if (SHARED_PROGRAM_SLUGS.has(programMatch[1])) {
      return {
        url: withQueryAndHash(`/light/courses/${programMatch[1]}`, search, hash),
        isLight: false,
      };
    }
    return { url: LIGHT_HOME, isLight: false };
  }

  const mapped = DARK_TO_LIGHT_STATIC[pathname];
  return {
    url: mapped ? withQueryAndHash(mapped, search, hash) : LIGHT_HOME,
    isLight: false,
  };
}
