import { NextResponse } from "next/server";

import { jsonError, parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import {
  CategoryError,
  createCategory,
  deleteCategory,
  reorderCategories,
  setCategoryVisibility,
  updateCategory,
} from "@/lib/admin/category-mutations";
import { readCategories, readCourses, withCounts } from "@/lib/data/courses";
import { revalidatePublicData } from "@/lib/data/revalidate";
import { categoryActionSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const body = await parseBody(request, categoryActionSchema);
  if (body instanceof Response) return body;
  try {
    switch (body.action) {
      case "create":
        await createCategory(body);
        break;
      case "update":
        await updateCategory(body);
        break;
      case "visibility":
        await setCategoryVisibility(body.id, body.visible);
        break;
      case "reorder":
        await reorderCategories(body.ids);
        break;
      case "delete":
        await deleteCategory(body.id, body.reassignTo || undefined);
        break;
    }
    revalidatePublicData("categories");
    const courses = await readCourses();
    return NextResponse.json({ ok: true, categories: withCounts(await readCategories(courses), courses) });
  } catch (error) {
    if (error instanceof CategoryError) return jsonError(error.status, "validation", { fields: error.fields, message: Object.values(error.fields)[0] });
    return storageError(error);
  }
}
