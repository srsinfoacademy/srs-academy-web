import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { jsonError, requireAdminApi } from "@/lib/admin/auth";
import { coverFileFromStorePath, MAX_COVER_BYTES, mimeForCoverFile } from "@/lib/media/cover-images";
import { verifyCoverPath } from "@/lib/media/cover-upload-server";

export const runtime = "nodejs";

/**
 * Issues Vercel Blob client-upload tokens for cover images. Same admin
 * session and same-origin check as every other admin write. A token is only
 * issued for a pathname signed by ./client (prepare), limited to that file's
 * image type, 5 MB and no overwrite. Upload-completed callbacks are not
 * used: the editor calls ./client (verify) after the upload instead.
 */
export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return jsonError(400, "validation");
  }
  if (body?.type !== "blob.generate-client-token") return jsonError(400, "validation");

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const fileName = coverFileFromStorePath(pathname);
        const mime = fileName ? mimeForCoverFile(fileName) : null;
        if (!fileName || !mime || !verifyCoverPath(pathname, clientPayload)) throw new Error("Upload not allowed.");
        return {
          allowedContentTypes: [mime],
          maximumSizeInBytes: MAX_COVER_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          cacheControlMaxAge: 31536000,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Cover upload token refused", error);
    return jsonError(400, "validation", { message: "Upload not allowed." });
  }
}
