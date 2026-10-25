import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { SESSION_COOKIE, verifySession, type AdminSession } from "@/lib/admin/session";
import { ADMIN_PASSWORD_MIN, fieldErrors } from "@/lib/data/schemas";
import { StorageNotConfiguredError } from "@/lib/data/store";

/** Admin credentials from env. Null when missing or the password is shorter than the minimum. */
export function adminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < ADMIN_PASSWORD_MIN) return null;
  return { email, password };
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Constant-time comparison of both fields (fixed-length digests, no early exit). */
export function credentialsMatch(email: string, password: string): boolean {
  const expected = adminCredentials();
  if (!expected) return false;
  const emailOk = timingSafeEqual(digest(email.trim().toLowerCase()), digest(expected.email.toLowerCase()));
  const passwordOk = timingSafeEqual(digest(password), digest(expected.password));
  return emailOk && passwordOk;
}

/** Session for Server Components; redirects to the login page when missing. */
export async function requireAdminPage(): Promise<AdminSession> {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * CSRF guard for state-changing requests: the browser's Origin (or
 * Sec-Fetch-Site) must say the request came from this site. Combined with
 * the SameSite=Lax cookie and JSON-only bodies.
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

export function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Guard for every /api/admin route (the proxy checks too; this is the
 * second line). Returns the session, or a Response to return as-is.
 */
export async function requireAdminApi(request: Request, { mutation = true } = {}): Promise<AdminSession | Response> {
  if (mutation && !isSameOrigin(request)) return jsonError(403, "forbidden");
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return jsonError(401, "unauthorized");
  return session;
}

/** Parses a JSON body with a zod schema; returns data or a 400 Response. */
export async function parseBody<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T> | Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) return jsonError(415, "json_required");
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "validation", { fields: { form: "The request body is not valid JSON." } });
  }
  const result = schema.safeParse(raw);
  if (!result.success) return jsonError(400, "validation", { fields: fieldErrors(result.error) });
  return result.data;
}

/** Maps storage failures to a readable API error. */
export function storageError(error: unknown) {
  if (error instanceof StorageNotConfiguredError) return jsonError(503, "storage_not_configured", { message: error.message });
  console.error("Admin storage error", error);
  return jsonError(500, "server_error", { message: "Saving failed. Try again in a moment." });
}
