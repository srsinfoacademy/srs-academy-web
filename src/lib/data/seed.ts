import "server-only";

import { courses as bundledCourses } from "@/content/courses";
import { site, type SiteImage } from "@/content/site";
import { slugify } from "@/lib/data/schemas";
import type { CategoryRecord, ContactDoc, CourseRecord, SocialId } from "@/lib/data/types";

/**
 * Seed / fallback documents built from the bundled content. Used until the
 * admin saves a document for the first time, and whenever no store is
 * configured, so the public site never depends on Blob being reachable.
 */

const courseImages = site.imagery.courses as Record<string, SiteImage>;

export function seedCourses(): CourseRecord[] {
  return bundledCourses.map((course) => ({
    id: course.origin === "srs" ? `srs-${course.slug}` : `c${course.sno}`,
    sno: course.sno,
    slug: course.slug,
    name: course.name,
    code: course.code,
    category: course.category,
    duration: course.duration,
    level: course.level ?? "",
    summary: course.summary ?? "",
    modules: [...course.modules],
    image: courseImages[course.code]?.src ?? "",
    eligibility: "",
    seoTitle: "",
    seoDescription: "",
    published: true,
    origin: course.origin,
    ...(course.outcomes ? { outcomes: [...course.outcomes] } : {}),
    ...(course.curriculum ? { curriculum: course.curriculum.map((module) => ({ ...module, topics: [...module.topics] })) } : {}),
  }));
}

/** Catalogue categories by course count (the old menu order), then any SRS-only categories. */
export function seedCategories(courses: readonly CourseRecord[]): CategoryRecord[] {
  const counts = new Map<string, number>();
  for (const course of courses) {
    if (course.origin === "catalogue") counts.set(course.category, (counts.get(course.category) ?? 0) + 1);
  }
  const names = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
  for (const course of courses) if (!names.includes(course.category)) names.push(course.category);
  return names.map((name) => ({ id: `k-${slugify(name)}`, name, slug: slugify(name), visible: true }));
}

export function seedContact(): ContactDoc {
  const social = Object.fromEntries(
    (["instagram", "facebook", "linkedin", "x", "youtube", "pinterest"] as const).map((id) => [
      id,
      site.social.find((item) => item.icon === id)?.href ?? "",
    ]),
  ) as Record<SocialId, string>;

  return {
    version: 1,
    updatedAt: "",
    phone: site.contact.phone,
    whatsapp: site.contact.phoneDigits,
    email: site.contact.email,
    address: site.contact.address,
    hours: site.contact.hours.map((row) => ({ days: row.days, time: row.time })),
    social,
    mapEmbedUrl: "",
    enquiryEmail: site.contact.enquiryInbox,
  };
}
