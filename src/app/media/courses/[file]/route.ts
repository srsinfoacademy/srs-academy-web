import { readBinary } from "@/lib/data/store";
import { coverStorePath, mimeForCoverFile } from "@/lib/media/cover-images";

export const runtime = "nodejs";

/**
 * Serves uploaded course covers from the private Blob store. Only
 * media/courses/<uuid>.<jpg|png|webp> names are served; anything else is
 * 404. Names are random and never reused, so responses are immutable.
 */
export async function GET(_request: Request, { params }: RouteContext<"/media/courses/[file]">) {
  const { file } = await params;
  const mime = mimeForCoverFile(file);
  if (!mime) return new Response("Not found", { status: 404 });

  let stored: Awaited<ReturnType<typeof readBinary>>;
  try {
    stored = await readBinary(coverStorePath(file));
  } catch (error) {
    console.error("Cover image read failed", error);
    return new Response("Unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  if (!stored) return new Response("Not found", { status: 404 });

  return new Response(stored.stream, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(stored.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
