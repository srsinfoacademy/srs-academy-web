import { NextResponse } from "next/server";

import { parseBody, requireAdminApi, storageError } from "@/lib/admin/auth";
import { writeContact } from "@/lib/data/contact";
import { revalidatePublicData } from "@/lib/data/revalidate";
import { contactInputSchema } from "@/lib/data/schemas";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const session = await requireAdminApi(request);
  if (session instanceof Response) return session;
  const input = await parseBody(request, contactInputSchema);
  if (input instanceof Response) return input;
  try {
    const contact = await writeContact(input);
    revalidatePublicData("contact");
    return NextResponse.json({ ok: true, contact });
  } catch (error) {
    return storageError(error);
  }
}
