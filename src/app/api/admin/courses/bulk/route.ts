import { NextResponse } from "next/server";

import { bulkUpdate, CourseConflict, deleteCourses } from "@/lib/admin/course-mutations";
import { jsonError, parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { revalidatePublicData } from "@/lib/data/revalidate";
import { bulkCourseSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const body = await parseBody(request, bulkCourseSchema);
  if (body instanceof Response) return body;
  try {
    let count = 0;
    if (body.action === "delete") count = await deleteCourses(body.ids);
    else if (body.action === "category") count = await bulkUpdate(body.ids, { category: body.category });
    else count = await bulkUpdate(body.ids, { published: body.action === "publish" });
    revalidatePublicData("courses");
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    if (error instanceof CourseConflict) return jsonError(409, "validation", { fields: error.fields });
    return storageError(error);
  }
}
