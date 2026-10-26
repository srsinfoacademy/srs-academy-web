import { jwtVerify, SignJWT } from "jose";

/**
 * Signed admin session (HS256 JWT in an httpOnly cookie). Shared by
 * src/proxy.ts and the server code, so it must not import server-only
 * modules.
 */

export const SESSION_COOKIE = "srs_admin_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;
const ISSUER = "srs-academy-admin";

function secretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

export function authConfigured(): boolean {
  return Boolean(secretKey());
}

export async function signSession(email: string): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("AUTH_SECRET is not set (16+ characters).");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export type AdminSession = { email: string; expiresAt: number };

export async function verifySession(token: string | undefined): Promise<AdminSession | null> {
  const key = secretKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { issuer: ISSUER, algorithms: ["HS256"] });
    if (payload.role !== "admin" || typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    return { email: payload.sub, expiresAt: payload.exp * 1000 };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
