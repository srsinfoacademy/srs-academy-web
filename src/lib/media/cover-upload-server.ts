import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signs the server-chosen pathname of a direct-to-Blob client upload, so the
 * upload-token route only issues tokens for names this server generated.
 */
function key(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set.");
  return secret;
}

export function signCoverPath(pathname: string): string {
  return createHmac("sha256", key()).update(`cover-upload:${pathname}`).digest("hex");
}

export function verifyCoverPath(pathname: string, signature: string | null | undefined): boolean {
  if (!signature || !/^[0-9a-f]{64}$/.test(signature)) return false;
  const expected = Buffer.from(signCoverPath(pathname), "hex");
  const given = Buffer.from(signature, "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}
