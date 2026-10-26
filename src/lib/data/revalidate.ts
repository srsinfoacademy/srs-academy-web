import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { CATEGORIES_TAG, COURSES_TAG } from "@/lib/data/courses";
import { CONTACT_TAG } from "@/lib/data/contact";

/**
 * Called after every admin save. Expires the tagged data immediately
 * (`expire: 0`, the Route Handler form documented for revalidateTag) and
 * the whole layout tree, so the header menu, footer, course pages and the
 * sitemap re-render on their next request.
 */
export function revalidatePublicData(kind: "courses" | "categories" | "contact" | "all") {
  const tags =
    kind === "all" ? [COURSES_TAG, CATEGORIES_TAG, CONTACT_TAG] : kind === "courses" ? [COURSES_TAG] : kind === "categories" ? [CATEGORIES_TAG, COURSES_TAG] : [CONTACT_TAG];
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}
