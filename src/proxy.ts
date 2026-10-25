import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/admin/session";

/**
 * Protects /admin/* and /api/admin/* (except the login page and login API).
 * Pages without a valid session go to /admin/login; API calls get 401.
 * Every admin response is marked noindex. Route handlers and pages check
 * the session again, so this is not the only guard.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isPublic = isLoginPage || pathname === "/api/admin/login";

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  let response: NextResponse;
  if (isPublic) {
    response = isLoginPage && session ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  } else if (!session) {
    if (isApi) {
      response = NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    } else {
      const login = new URL("/admin/login", request.url);
      if (pathname !== "/admin") login.searchParams.set("next", `${pathname}${search}`);
      response = NextResponse.redirect(login);
    }
  } else {
    response = NextResponse.next();
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
