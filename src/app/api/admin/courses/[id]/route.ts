import { NextResponse } from "next/server";

import { CourseConflict, CourseNotFound, deleteCourses, updateCourse } from "@/lib/admin/course-mutations";
import { jsonError, parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { revalidatePublicData } from "@/lib/data/revalidate";
import { courseInputSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: RouteContext<"/api/admin/courses/[id]">) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const { id } = await params;
  const input = await parseBody(request, courseInputSchema);
  if (input instanceof Response) return input;
  try {
    const course = await updateCourse(id, input);
    revalidatePublicData("courses");
    return NextResponse.json({ ok: true, course });
  } catch (error) {
    if (error instanceof CourseNotFound) return jsonError(404, "not_found");
    if (error instanceof CourseConflict) return jsonError(409, "validation", { fields: error.fields });
    return storageError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/admin/courses/[id]">) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const { id } = await params;
  try {
    const removed = await deleteCourses([id]);
    if (!removed) return jsonError(404, "not_found");
    revalidatePublicData("courses");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return storageError(error);
  }
}
