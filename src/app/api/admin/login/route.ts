import { NextResponse } from "next/server";

import { adminCredentials, credentialsMatch, isSameOrigin, jsonError, parseBody } from "@/lib/admin/auth";
import { clearLoginAttempts, takeLoginAttempt } from "@/lib/admin/login-rate-limit";
import { authConfigured, SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/admin/session";
import { loginSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "forbidden");

  const ip = clientIp(request);
  const retryAfter = takeLoginAttempt(ip);
  if (retryAfter > 0) return jsonError(429, "rate_limited", { retryAfter });

  if (!authConfigured() || !adminCredentials()) {
    console.error("Admin login: ADMIN_EMAIL, ADMIN_PASSWORD (6+ characters) or AUTH_SECRET (16+ characters) is not configured.");
    return jsonError(503, "not_configured");
  }

  const body = await parseBody(request, loginSchema);
  if (body instanceof Response) return body;

  if (!credentialsMatch(body.email, body.password)) return jsonError(401, "invalid");

  clearLoginAttempts(ip);
  const token = await signSession(adminCredentials()!.email);
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
