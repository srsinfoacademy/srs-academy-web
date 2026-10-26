import { NextResponse } from "next/server";

import { importCourses } from "@/lib/admin/course-mutations";
import { parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { revalidatePublicData } from "@/lib/data/revalidate";
import { importSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

/** Rows are parsed from .xlsx in the browser (SheetJS); the server validates and upserts by course code. */
export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const body = await parseBody(request, importSchema);
  if (body instanceof Response) return body;
  try {
    const result = await importCourses(body.rows, body.mode);
    revalidatePublicData("all");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return storageError(error);
  }
}
