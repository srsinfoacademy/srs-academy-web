import { NextResponse } from "next/server";

import { jsonError, requireAdminApi, storageError } from "@/lib/admin/auth";
import { putBinary } from "@/lib/data/store";
import { checkCoverUpload, coverPublicPath, coverStorePath, MAX_COVER_BYTES, newCoverFileName } from "@/lib/media/cover-images";

export const runtime = "nodejs";

/**
 * Direct cover upload (multipart field "file"). Used when the store isn't
 * Vercel Blob (local development) and for files that fit in one function
 * request. On Vercel with Blob the editor uploads straight to the store
 * instead (see ./client and ./token) because function request bodies are
 * capped at 4.5 MB.
 */
export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_COVER_BYTES + 64 * 1024) return jsonError(413, "validation", { message: "The image is larger than 5 MB." });

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return jsonError(400, "validation", { message: "Send the image as multipart form data." });
  }
  if (!(file instanceof File)) return jsonError(400, "validation", { message: "Choose an image to upload." });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkCoverUpload({ declaredType: file.type, size: bytes.byteLength, head: bytes.subarray(0, 16) });
  if (!check.ok) return jsonError(400, "validation", { message: check.error });

  const name = newCoverFileName(check.mime);
  try {
    await putBinary(coverStorePath(name), bytes, check.mime);
  } catch (error) {
    return storageError(error);
  }
  return NextResponse.json({ ok: true, path: coverPublicPath(name) }, { headers: { "Cache-Control": "no-store" } });
}
