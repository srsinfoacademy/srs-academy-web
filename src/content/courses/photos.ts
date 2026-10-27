import photoData from "@/content/courses/course-photos.json";

/**
 * Real course photos (public/images/courses, 800×450 WebP), mapped by slug
 * in course-photos.json: catalogue courses under `courses`, SRS programs
 * under `programs`. Licences: public/images/courses/CREDITS.md. Server-side
 * only (cards get a slim image object through toPublicCard).
 */

export type CoursePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  topic: string;
  source: string;
  sourceUrl: string;
  author: string;
  authorUrl: string;
  license: string;
  licenseUrl: string;
};

type PhotoData = {
  photos: Record<string, CoursePhoto>;
  courses: Record<string, string>;
  programs: Record<string, string>;
};

const data = photoData as PhotoData;

export const PHOTO_CREDITS_PATH = "/images/courses/CREDITS.md";

/** The mapped photo for a course, or undefined when the slug has none. */
export function coursePhoto(slug: string, origin: "catalogue" | "srs"): CoursePhoto | undefined {
  const id = origin === "srs" ? data.programs[slug] : data.courses[slug];
  return id ? data.photos[id] : undefined;
}

/** CC BY photos must credit the author and licence; Unsplash, CC0 and public domain need none. */
export function photoNeedsCredit(photo: CoursePhoto): boolean {
  return photo.license.startsWith("CC BY");
}

/** Short overlay credit, e.g. "Photo: Shixart1985 · CC BY 2.0". */
export function photoCredit(photo: CoursePhoto): string {
  return `Photo: ${photo.author} · ${photo.license}`;
}
