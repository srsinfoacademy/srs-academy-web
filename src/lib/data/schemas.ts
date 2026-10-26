import { z } from "zod";

import { enquiryStatuses, socialIds } from "@/lib/data/types";

/**
 * Validation shared by the admin forms (client) and the admin API (server).
 * The server always re-validates; client checks are only for fast feedback.
 */

/** Same rule as scripts/import-courses.py. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SUMMARY_MAX = 200;
export const SEO_TITLE_MAX = 70;
export const SEO_DESCRIPTION_MAX = 170;
export const ELIGIBILITY_MAX = 200;
/** Minimum admin password length (ADMIN_PASSWORD). */
export const ADMIN_PASSWORD_MIN = 6;

const trimmed = (max: number) => z.string().trim().max(max);

/** Course images: Unsplash (allowed by next.config images + CSP) or a path on this site. */
export const imageUrlSchema = z
  .string()
  .trim()
  .max(600)
  .refine(
    (value) => value === "" || /^https:\/\/images\.unsplash\.com\/\S+$/.test(value) || /^\/[^/\s]\S*$/.test(value),
    "Use an https://images.unsplash.com/… link or a site path starting with /.",
  );

export const courseInputSchema = z.object({
  name: z.string().trim().min(2, "Enter the course name.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a URL slug.")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  code: z
    .string()
    .trim()
    .min(1, "Enter the course code.")
    .max(40)
    .regex(/^[A-Za-z0-9 _-]+$/, "Letters, numbers, spaces, hyphens and underscores only."),
  category: z.string().trim().min(1, "Choose a category.").max(80),
  duration: trimmed(80),
  level: trimmed(60),
  summary: z.string().trim().max(SUMMARY_MAX, `Keep the short description to ${SUMMARY_MAX} characters.`),
  modules: z.array(z.string().trim().max(300)).max(200).transform((items) => items.filter(Boolean)),
  coverImage: imageUrlSchema.default(""),
  eligibility: z.string().trim().max(ELIGIBILITY_MAX, `Keep eligibility to ${ELIGIBILITY_MAX} characters.`).default(""),
  seoTitle: trimmed(SEO_TITLE_MAX + 30),
  seoDescription: trimmed(SEO_DESCRIPTION_MAX + 60),
  published: z.boolean(),
});
export type CourseInput = z.infer<typeof courseInputSchema>;

export const bulkCourseSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("publish"), ids: z.array(z.string().max(80)).min(1).max(2000) }),
  z.object({ action: z.literal("unpublish"), ids: z.array(z.string().max(80)).min(1).max(2000) }),
  z.object({ action: z.literal("delete"), ids: z.array(z.string().max(80)).min(1).max(2000) }),
  z.object({
    action: z.literal("category"),
    ids: z.array(z.string().max(80)).min(1).max(2000),
    category: z.string().trim().min(1).max(80),
  }),
]);

export const importRowSchema = z.object({
  name: z.string().trim().min(1).max(200),
  code: z.string().trim().max(40),
  category: z.string().trim().max(80),
  duration: trimmed(80),
  level: trimmed(60),
  modules: z.array(z.string().trim().max(300)).max(200),
  eligibility: z.string().trim().max(ELIGIBILITY_MAX).default(""),
});
export const importSchema = z.object({
  mode: z.enum(["update", "skip"]),
  rows: z.array(importRowSchema).min(1).max(5000),
});
export type ImportRow = z.infer<typeof importRowSchema>;

export const categoryNameSchema = z.string().trim().min(1, "Enter a category name.").max(80);

export const categoryActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    name: categoryNameSchema,
    slug: z.string().trim().max(100).optional(),
    visible: z.boolean(),
  }),
  z.object({
    action: z.literal("update"),
    id: z.string().max(80),
    name: categoryNameSchema,
    slug: z.string().trim().max(100).optional(),
    visible: z.boolean(),
  }),
  z.object({ action: z.literal("visibility"), id: z.string().max(80), visible: z.boolean() }),
  z.object({ action: z.literal("reorder"), ids: z.array(z.string().max(80)).min(1).max(500) }),
  z.object({
    action: z.literal("delete"),
    id: z.string().max(80),
    /** Category name that the deleted category's courses move to. Required when it has courses. */
    reassignTo: z.string().trim().max(80).optional(),
  }),
]);

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), "Use a full https:// link, or leave it blank.");

export const contactInputSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((value) => value === "" || /^\+?[0-9 ()-]{7,20}$/.test(value), "Enter a phone number such as +91 8008138008."),
  whatsapp: z
    .string()
    .trim()
    .max(20)
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value === "" || /^[0-9]{10,15}$/.test(value), "Digits with country code, e.g. 918008138008."),
  email: z.string().trim().email("Enter a valid email address.").max(320),
  address: z.string().trim().min(1, "Enter the address.").max(300),
  hours: z
    .array(z.object({ days: z.string().trim().max(60), time: z.string().trim().max(60) }))
    .max(10)
    .transform((rows) => rows.filter((row) => row.days || row.time)),
  social: z.object(Object.fromEntries(socialIds.map((id) => [id, optionalUrl])) as Record<(typeof socialIds)[number], typeof optionalUrl>),
  mapEmbedUrl: z
    .string()
    .trim()
    .max(2000)
    .refine(
      (value) => value === "" || /^https:\/\/(www\.)?google\.com\/maps\/embed\?\S+$/.test(value),
      "Paste the https://www.google.com/maps/embed?… link from Google Maps → Share → Embed a map.",
    ),
  enquiryEmail: z.string().trim().email("Enter a valid email address.").max(320),
});
export type ContactInput = z.infer<typeof contactInputSchema>;

export const enquiryUpdateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status"), status: z.enum(enquiryStatuses) }),
  z.object({ action: z.literal("note"), text: z.string().trim().min(1, "Write a note first.").max(2000) }),
  z.object({ action: z.literal("deleteNote"), noteId: z.string().max(80) }),
]);

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email.").max(320),
  password: z.string().min(1, "Enter your password.").max(200),
});

/** Turns zod issues into `{ field: message }` for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
