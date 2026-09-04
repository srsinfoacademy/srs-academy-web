import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { THEME_PREFERENCE_COOKIE } from "@/lib/theme-preference";

/**
 * Honors a returning visitor's saved theme choice at the two site entry
 * points, with a zero-flash server redirect rather than a client-side one.
 *
 * Scope is deliberately narrow — exactly `/` and `/light`, never a deep
 * link. Someone sent a specific `/programs/x` or `/light/courses/x` link
 * lands exactly there regardless of any saved preference; only the
 * ambiguous "which experience should this visitor see" case at the two
 * homepages is resolved here. A brand-new visitor with no cookie yet is
 * handled separately, client-side, by the inline script in the root
 * layout — this proxy has no way to read prefers-color-scheme, only the
 * cookie set once someone has actually chosen.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const preference = request.cookies.get(THEME_PREFERENCE_COOKIE)?.value;

  if (pathname === "/" && preference === "light") {
    const url = request.nextUrl.clone();
    url.pathname = "/light";
    return NextResponse.redirect(url);
  }

  if (pathname === "/light" && preference === "dark") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/light"],
};
