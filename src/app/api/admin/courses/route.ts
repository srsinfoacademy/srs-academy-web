import { NextResponse } from "next/server";

import { CourseConflict, createCourse } from "@/lib/admin/course-mutations";
import { jsonError, parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { readCourses } from "@/lib/data/courses";
import { revalidatePublicData } from "@/lib/data/revalidate";
import { courseInputSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await requireAdminApi(request, { mutation: false });
  if (session instanceof Response) return session;
  return NextResponse.json({ ok: true, courses: await readCourses() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const input = await parseBody(request, courseInputSchema);
  if (input instanceof Response) return input;
  try {
    const course = await createCourse(input);
    revalidatePublicData("courses");
    return NextResponse.json({ ok: true, course });
  } catch (error) {
    if (error instanceof CourseConflict) return jsonError(409, "validation", { fields: error.fields });
    return storageError(error);
  }
}
