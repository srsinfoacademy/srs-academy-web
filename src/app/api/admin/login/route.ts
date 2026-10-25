import { NextResponse } from "next/server";

import { adminCredentials, credentialsMatch, isSameOrigin, jsonError, parseBody } from "@/lib/admin/auth";
import { clearFailures, lockoutRemaining, recordFailure } from "@/lib/admin/login-rate-limit";
import { authConfigured, SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/admin/session";
import { loginSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

/** Vercel sets x-real-ip (and the first x-forwarded-for entry) to the client address. */
function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function lockedOut(retryAfter: number) {
  const minutes = Math.max(1, Math.ceil(retryAfter / 60));
  return jsonError(429, "rate_limited", {
    retryAfter,
    message: `Too many failed sign-in attempts. For security, sign-in is locked for ${minutes} minute${minutes === 1 ? "" : "s"}. Try again later.`,
  });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "forbidden");

  if (!authConfigured() || !adminCredentials()) {
    console.error("Admin login: ADMIN_EMAIL, ADMIN_PASSWORD (6+ characters) or AUTH_SECRET (16+ characters) is not configured.");
    return jsonError(503, "not_configured");
  }

  const ip = clientIp(request);
  const remaining = await lockoutRemaining(ip);
  if (remaining > 0) {
    const response = lockedOut(remaining);
    response.headers.set("Retry-After", String(remaining));
    return response;
  }

  const body = await parseBody(request, loginSchema);
  if (body instanceof Response) return body;

  if (!credentialsMatch(body.email, body.password)) {
    const lockout = await recordFailure(ip);
    if (lockout > 0) {
      const response = lockedOut(lockout);
      response.headers.set("Retry-After", String(lockout));
      return response;
    }
    return jsonError(401, "invalid");
  }

  await clearFailures(ip);
  const token = await signSession(adminCredentials()!.email);
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
