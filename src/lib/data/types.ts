import type { CurriculumModule } from "@/content/courses/types";

/**
 * Shapes stored in Vercel Blob (or the local dev store). The public site and
 * the admin panel both read these through `src/lib/data/*`; nothing else
 * should import the bundled course JSON or the contact facts directly.
 */

export type CourseOrigin = "catalogue" | "srs";

export type CourseRecord = {
  /** Stable id: `c{sno}` for spreadsheet rows, `srs-{slug}` for SRS programs, `n…` for admin-created courses. */
  id: string;
  sno: number;
  slug: string;
  name: string;
  code: string;
  category: string;
  duration: string;
  level: string;
  /** Short description for cards and meta description (200 characters max). */
  summary: string;
  /** Short topic / module lines. */
  modules: string[];
  /**
   * Legacy photo field (the homepage Unsplash stand-ins). Read as the cover
   * when `coverImage` is empty; an admin save moves it into `coverImage`.
   */
  image: string;
  /** Cover photo set in the admin: https://images.unsplash.com/… or a site path. Empty or missing = generated cover. */
  coverImage?: string;
  /** Who can apply, e.g. "10th pass". Admin-only for now: not shown on the website. Missing = "". */
  eligibility?: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  origin: CourseOrigin;
  /** SRS programs only; kept from the bundled data, not edited in the admin. */
  outcomes?: string[];
  curriculum?: CurriculumModule[];
  updatedAt?: string;
};

export type CoursesDoc = { version: 1; updatedAt: string; courses: CourseRecord[] };

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
};

/** Array order is the website order (course menu, chips). */
export type CategoriesDoc = { version: 1; updatedAt: string; categories: CategoryRecord[] };

/** Category plus the number of courses that use it (all courses, any status). */
export type CategoryWithCount = CategoryRecord & { count: number; publishedCount: number };

export type HoursRow = { days: string; time: string };

export const socialIds = ["instagram", "facebook", "linkedin", "x", "youtube", "pinterest"] as const;
export type SocialId = (typeof socialIds)[number];

export const socialLabels: Record<SocialId, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  pinterest: "Pinterest",
};

export type ContactDoc = {
  version: 1;
  updatedAt: string;
  /** Display phone, e.g. "+91 8008138008". Empty hides every phone control. */
  phone: string;
  /** WhatsApp digits with country code, no plus, e.g. 918008138008. Empty hides WhatsApp. */
  whatsapp: string;
  email: string;
  address: string;
  hours: HoursRow[];
  social: Record<SocialId, string>;
  /** Google Maps embed URL (https://www.google.com/maps/embed?pb=…). Empty hides the map. */
  mapEmbedUrl: string;
  /** Inbox that receives enquiry notifications. Not displayed on the site. */
  enquiryEmail: string;
};

export const enquiryStatuses = ["new", "contacted", "follow-up", "closed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "follow-up": "Follow-up",
  closed: "Closed",
};

export type EnquiryNote = { id: string; at: string; text: string };

export type EnquiryRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  sourcePage: string;
  status: EnquiryStatus;
  notes: EnquiryNote[];
};
