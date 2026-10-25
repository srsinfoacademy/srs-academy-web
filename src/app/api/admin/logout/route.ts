import { NextResponse } from "next/server";

import { isSameOrigin, jsonError } from "@/lib/admin/auth";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "forbidden");
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
