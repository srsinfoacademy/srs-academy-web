import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { jsonError, parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { getEnquiry, saveEnquiry } from "@/lib/data/enquiries";
import { enquiryUpdateSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

/** Status changes and internal notes. Enquiries are never public, so nothing is revalidated. */
export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/enquiries/[id]">) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const { id } = await params;
  const body = await parseBody(request, enquiryUpdateSchema);
  if (body instanceof Response) return body;
  try {
    const enquiry = await getEnquiry(id);
    if (!enquiry) return jsonError(404, "not_found");
    let next = enquiry;
    if (body.action === "status") next = { ...enquiry, status: body.status };
    if (body.action === "note") {
      next = { ...enquiry, notes: [...enquiry.notes, { id: randomUUID().slice(0, 8), at: new Date().toISOString(), text: body.text }] };
    }
    if (body.action === "deleteNote") next = { ...enquiry, notes: enquiry.notes.filter((note) => note.id !== body.noteId) };
    return NextResponse.json({ ok: true, enquiry: await saveEnquiry(next) });
  } catch (error) {
    return storageError(error);
  }
}
