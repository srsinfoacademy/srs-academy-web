/**
 * Course catalogue content for the light-theme preview.
 *
 * Taxonomy and course set are taken from `SRS Light Theme Phase 2 Course
 * System.dc.html`, which is authoritative for category IDs (per the Master
 * Consolidation's conflict-resolution note). SRS Academy currently has one
 * confirmed program — Full Stack Web Development, from
 * `@/content/programs` / `@/content/program-detail` — which is the only
 * `status: "live"` entry and the only one with real curriculum, audience,
 * fee and admissions detail on its course-detail page.
 *
 * Every other entry is a structural placeholder that demonstrates the
 * catalogue's intended multi-domain scale (9 categories spanning tech,
 * business, beauty, creative arts, fashion, trades and career skills). Each
 * carries `status: "placeholder"`, is rendered with a "Coming soon" badge,
 * and asserts no fee, accreditation, duration-in-weeks, or outcome — only a
 * category, mode, level and duration *bucket*, which are structural filter
 * facets rather than business facts.
 *
 * 22 real courses, imported from `Course_Details_Master_Sheet.xlsx` via the
 * shared catalogue (`@/content/catalogue`), were added below in the same
 * pass that added Food & Baking as a 10th category. Three of the original
 * placeholders above (nails, mehendi, digitalmkt) are upgraded in place to
 * their real record rather than duplicated — see `upgradedSlugMap` below.
 */

import { sharedCategories } from "@/content/catalogue/categories";
import { catalogueCourses } from "@/content/catalogue/courses";
import type {
  CourseMode as CatalogueCourseMode,
  NormalizedCourse,
  SharedCategory,
  SharedCategorySlug,
} from "@/content/catalogue/types";

/**
 * Re-exported from the shared catalogue taxonomy (`@/content/catalogue`) —
 * one taxonomy, read by both themes, per the shared-taxonomy requirement.
 * Includes Food & Baking, the 10th category added for Cake Bakery Course.
 */
export type CourseCategoryId = SharedCategorySlug;
export type CourseCategory = SharedCategory;
export const courseCategories: CourseCategory[] = sharedCategories;

export type CourseMode = "online" | "offline" | "hybrid";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseDurationBucket = "short" | "medium" | "long";

export type Course = {
  id: string;
  /** Matches the dark theme's `Program.slug` for any course both themes share. */
  slug: string;
  title: string;
  category: CourseCategoryId;
  /** Not present for a spreadsheet-sourced course — the mode/level chips are omitted, never guessed. */
  mode?: CourseMode;
  level?: CourseLevel;
  duration: CourseDurationBucket;
  photo: string;
  blurb: string;
  status: "live" | "placeholder";
  /** Extra searchable fields for a real catalogue course — undefined for the original placeholder set. */
  sourceName?: string;
  courseCode?: string;
  subcategory?: string;
  tags?: string[];
  curriculum?: string[];
  courseType?: string;
};

export const modeLabels: Record<CourseMode, string> = {
  online: "Online",
  offline: "Offline",
  hybrid: "Hybrid",
};
export const levelLabels: Record<CourseLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
export const durationLabels: Record<CourseDurationBucket, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

/** The original hand-authored placeholder set. See `courses` below for the final, published list. */
const placeholderCourses: Course[] = [
  {
    id: "fullstack",
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    category: "webdev",
    mode: "online",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    blurb:
      "A practical, project-based path from web fundamentals to full-stack development — frontend, backend, databases and deployment.",
    status: "live",
  },
  {
    id: "ai",
    slug: "artificial-intelligence-fundamentals",
    title: "Artificial Intelligence Fundamentals",
    category: "tech",
    mode: "hybrid",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    blurb: "From first computer class to building simple AI tools.",
    status: "placeholder",
  },
  {
    id: "python",
    slug: "python-programming",
    title: "Python Programming",
    category: "tech",
    mode: "online",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
    blurb: "Programming fundamentals with hands-on projects.",
    status: "placeholder",
  },
  {
    id: "java",
    slug: "java-programming",
    title: "Java Programming",
    category: "tech",
    mode: "online",
    level: "intermediate",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80",
    blurb: "Core Java concepts for aspiring developers.",
    status: "placeholder",
  },
  {
    id: "networking",
    slug: "hardware-and-networking",
    title: "Hardware & Networking",
    category: "webdev",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
    blurb: "Practical computer hardware and network setup skills.",
    status: "placeholder",
  },
  {
    id: "digitalmkt",
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "business",
    mode: "online",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
    blurb: "Social media, SEO basics and campaign fundamentals.",
    status: "placeholder",
  },
  {
    id: "tally",
    slug: "tally-and-gst",
    title: "Tally & GST",
    category: "business",
    mode: "hybrid",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?auto=format&fit=crop&w=700&q=80",
    blurb: "Practical accounting and GST filing skills for jobs.",
    status: "placeholder",
  },
  {
    id: "graphic",
    slug: "graphic-design",
    title: "Graphic Design",
    category: "business",
    mode: "online",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=700&q=80",
    blurb: "Visual design fundamentals using industry-standard tools.",
    status: "placeholder",
  },
  {
    id: "autocad",
    slug: "autocad",
    title: "AutoCAD",
    category: "business",
    mode: "hybrid",
    level: "intermediate",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
    blurb: "Technical drafting and design software skills.",
    status: "placeholder",
  },
  {
    id: "makeup",
    slug: "makeup-artistry",
    title: "Makeup Artistry",
    category: "beauty",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Everyday and party makeup techniques, hands-on.",
    status: "placeholder",
  },
  {
    id: "bridal",
    slug: "bridal-makeup-artistry",
    title: "Bridal Makeup Artistry",
    category: "beauty",
    mode: "offline",
    level: "intermediate",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Professional bridal looks and client handling.",
    status: "placeholder",
  },
  {
    id: "beautytherapy",
    slug: "beauty-therapy",
    title: "Beauty Therapy",
    category: "beauty",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Skin, hair and body treatment fundamentals.",
    status: "placeholder",
  },
  {
    id: "nails",
    slug: "nail-extension",
    title: "Nail Extension",
    category: "beauty",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Nail art and extension techniques for real clients.",
    status: "placeholder",
  },
  {
    id: "mehendi",
    slug: "mehendi-design",
    title: "Mehendi Design",
    category: "creative",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
    blurb: "From basic patterns to bridal mehendi artistry.",
    status: "placeholder",
  },
  {
    id: "tailoring",
    slug: "tailoring-and-fashion-design",
    title: "Tailoring & Fashion Design",
    category: "fashion",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80",
    blurb: "Stitching, pattern-making and garment design.",
    status: "placeholder",
  },
  {
    id: "electrician",
    slug: "electrician-training",
    title: "Electrician Training",
    category: "trades",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
    blurb: "Practical household and commercial wiring skills.",
    status: "placeholder",
  },
  {
    id: "acrepair",
    slug: "ac-repair-and-servicing",
    title: "AC Repair & Servicing",
    category: "trades",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=700&q=80",
    blurb: "Installation, servicing and troubleshooting basics.",
    status: "placeholder",
  },
  {
    id: "plumbing",
    slug: "plumbing",
    title: "Plumbing",
    category: "trades",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=700&q=80",
    blurb: "Residential plumbing fundamentals, hands-on.",
    status: "placeholder",
  },
  {
    id: "english",
    slug: "spoken-english",
    title: "Spoken English",
    category: "career",
    mode: "online",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
    blurb: "Confidence, fluency and interview-ready communication.",
    status: "placeholder",
  },
  {
    id: "corporate-upskilling",
    slug: "corporate-team-upskilling",
    title: "Corporate Team Upskilling",
    category: "corporate",
    mode: "hybrid",
    level: "intermediate",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80",
    blurb: "Workshops and cohort tracks built around a team's real workload.",
    status: "placeholder",
  },
];

/**
 * Category-representative stock photo, reused across every course in that
 * category — the same convention this file already used for its original
 * placeholder set (e.g. every beauty course shares one photo). No
 * course-specific photography exists yet, so nothing here asserts a course
 * has been photographed.
 */
const categoryPhoto: Record<CourseCategoryId, string> = {
  tech: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
  webdev: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
  business: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
  beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
  creative: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
  fashion: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80",
  trades: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
  career: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
  corporate: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80",
  // No dedicated food/baking photo exists in the current asset set — reuses
  // the business category's, same as any other category short one course.
  food: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
};

/** Short/medium/long is a structural filter facet, not a factual claim — never derived from Hours. */
function bucketFor(months: number | null): CourseDurationBucket {
  if (months === null) return "short";
  if (months <= 3) return "short";
  if (months <= 6) return "medium";
  return "long";
}

/**
 * Adapts a shared `NormalizedCourse` (see `@/content/catalogue`) into this
 * theme's `Course` shape. The real course record itself lives once, in the
 * catalogue — this only reshapes it for the light visual system.
 */
function toLightCourse(course: NormalizedCourse): Course {
  return {
    id: course.id,
    slug: course.slug,
    title: course.name,
    category: (course.category ?? "business") as CourseCategoryId,
    duration: bucketFor(course.duration.months),
    photo: categoryPhoto[(course.category ?? "business") as CourseCategoryId],
    blurb: [course.courseType, course.duration.raw].filter(Boolean).join(" · "),
    status: "live",
    sourceName: course.sourceName,
    courseCode: course.codeConflict ? undefined : (course.courseCode ?? undefined),
    subcategory: course.subcategory ?? undefined,
    tags: course.tags,
    curriculum: course.curriculum,
    courseType: course.courseType ?? undefined,
    // Light's filter chips are single-select — the first verified mode
    // stands in for the whole set; the dark catalogue (which shows every
    // mode) is the complete picture for a course enriched with more than
    // one. `level` only carries over when it matches light's fixed
    // beginner/intermediate/advanced vocabulary exactly — anything else
    // (a level string enrichment hasn't constrained to that set) is simply
    // not shown on this theme rather than forced into the wrong bucket.
    mode: toLightMode(course.mode),
    level: toLightLevel(course.level),
  };
}

function toLightMode(modes: CatalogueCourseMode[] | null): CourseMode | undefined {
  if (!modes?.length) return undefined;
  const lower = modes[0].toLowerCase();
  return (["online", "offline", "hybrid"] as const).includes(lower as CourseMode)
    ? (lower as CourseMode)
    : undefined;
}

function toLightLevel(level: string | null): CourseLevel | undefined {
  if (!level) return undefined;
  const lower = level.toLowerCase();
  return (["beginner", "intermediate", "advanced"] as const).includes(lower as CourseLevel)
    ? (lower as CourseLevel)
    : undefined;
}

/**
 * Replaces the placeholder entries this real data now confirms — same `id`
 * where the placeholder's id already matched cleanly (nails, mehendi), new
 * stable ids for the rest, so no duplicate card is ever created for the
 * same course.
 */
const upgradedIds = new Set(["nails", "mehendi", "digitalmkt"]);
const upgradedSlugMap: Record<string, string> = {
  nails: "basic-to-advance-nail-extension-course",
  mehendi: "basic-to-advance-mehendi-masters-course",
  digitalmkt: "advanced-diploma-in-digital-marketing",
};

const remainingPlaceholders = placeholderCourses.filter((c) => !upgradedIds.has(c.id));
// Keeps each placeholder's original short `id` (e.g. "mehendi") even though
// the real course's own id is its slug — `FeaturedPrograms.tsx` and other
// short-id references (see `featuredIds`) keep working unchanged.
const upgradedCourses = Object.entries(upgradedSlugMap).map(([oldId, slug]) => {
  const source = catalogueCourses.find((c) => c.slug === slug);
  if (!source) throw new Error(`Catalogue course not found for slug: ${slug}`);
  return { ...toLightCourse(source), id: oldId };
});
const newCourses = catalogueCourses
  .filter((c) => !Object.values(upgradedSlugMap).includes(c.slug))
  .map(toLightCourse);

/** Final published catalogue: untouched placeholders + upgraded real records + newly imported real records. */
export const courses: Course[] = [...remainingPlaceholders, ...upgradedCourses, ...newCourses];

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function categoryOf(course: Course): CourseCategory {
  return courseCategories.find((c) => c.id === course.category) ?? courseCategories[0];
}
