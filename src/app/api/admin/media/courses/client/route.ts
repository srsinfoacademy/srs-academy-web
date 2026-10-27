import { NextResponse } from "next/server";
import { z } from "zod";

import { jsonError, parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { deleteJson, readBinaryHead } from "@/lib/data/store";
import {
  checkCoverUpload,
  coverFileFromStorePath,
  coverPublicPath,
  coverStorePath,
  isCoverMime,
  MAX_COVER_BYTES,
  mimeForCoverFile,
  newCoverFileName,
} from "@/lib/media/cover-images";
import { signCoverPath } from "@/lib/media/cover-upload-server";

export const runtime = "nodejs";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("prepare"), contentType: z.string().max(100), size: z.number().int().min(0) }),
  z.object({ action: z.literal("verify"), pathname: z.string().max(200) }),
]);

/**
 * Direct-to-Blob cover uploads, in two steps around the browser upload:
 * - prepare: checks the declared type and size and returns a random,
 *   server-signed pathname under media/courses/ (the token route only
 *   accepts signed names);
 * - verify: reads the stored file's first bytes and size, deletes it unless
 *   it really is the JPG/PNG/WEBP it claims to be, and returns its site path.
 */
export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const body = await parseBody(request, bodySchema);
  if (body instanceof Response) return body;

  if (body.action === "prepare") {
    if (!isCoverMime(body.contentType)) return jsonError(400, "validation", { message: "Use a JPG, PNG or WEBP image." });
    if (body.size <= 0 || body.size > MAX_COVER_BYTES) return jsonError(400, "validation", { message: "The image is larger than 5 MB." });
    const pathname = coverStorePath(newCoverFileName(body.contentType));
    return NextResponse.json({ ok: true, pathname, signature: signCoverPath(pathname) }, { headers: { "Cache-Control": "no-store" } });
  }

  const fileName = coverFileFromStorePath(body.pathname);
  const declared = fileName ? mimeForCoverFile(fileName) : null;
  if (!fileName || !declared) return jsonError(400, "validation", { message: "Unknown upload." });
  try {
    const stored = await readBinaryHead(body.pathname);
    if (!stored) return jsonError(404, "not_found", { message: "The upload didn't arrive. Try again." });
    const check = checkCoverUpload({ declaredType: declared, size: stored.size, head: stored.head });
    if (!check.ok) {
      await deleteJson(body.pathname).catch(() => undefined);
      return jsonError(400, "validation", { message: check.error });
    }
  } catch (error) {
    return storageError(error);
  }
  return NextResponse.json({ ok: true, path: coverPublicPath(fileName) }, { headers: { "Cache-Control": "no-store" } });
}
