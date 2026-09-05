import { catalogueCourses } from "@/content/catalogue/courses";
import { sharedCategories, categoryVisual } from "@/content/catalogue/categories";
import type { NormalizedCourse, SharedCategory } from "@/content/catalogue/types";
import type { CategorySlug, Program, ProgramCategory } from "@/types/program";

/**
 * The single program data source.
 *
 * One source feeds the homepage explorer, this catalogue and the footer, as
 * the design requires — so a program can never appear with different details
 * in two places.
 *
 * Every name is a placeholder and every unresolved value is bracketed. No
 * fee, duration, eligibility rule, accreditation or outcome is asserted.
 */
export const categories: ProgramCategory[] = [
  {
    slug: "web-software-development",
    num: "01",
    name: "Web & Software Development",
    label: "Engineering",
    visualType: "grid",
    artLabel: "MODULAR GRID ARCHITECTURE",
  },
  {
    slug: "artificial-intelligence",
    num: "02",
    name: "Artificial Intelligence",
    label: "Applied AI",
    visualType: "nodes",
    artLabel: "NODES & RELATIONSHIPS",
  },
  {
    slug: "technology-programs",
    num: "03",
    name: "Technology Programs",
    label: "Systems",
    visualType: "signals",
    artLabel: "SYSTEMS & SIGNALS",
  },
  {
    slug: "business-entrepreneurship",
    num: "04",
    name: "Business & Entrepreneurship",
    label: "Venture",
    visualType: "direction",
    artLabel: "DIRECTIONAL STRUCTURE",
  },
  {
    slug: "digital-skills",
    num: "05",
    name: "Digital Skills",
    label: "Foundation",
    visualType: "modular",
    artLabel: "MODULAR SIGNALS",
  },
];

const pending = {
  level: "[LEVEL]",
  mode: "[MODE]",
  duration: "[DURATION]",
  eligibility: "[ELIGIBILITY]",
} as const;

export const programs: Program[] = [
  {
    num: "01",
    slug: "full-stack-web-development",
    name: "Full Stack Web Development",
    category: "web-software-development",
    shortDescription:
      "A practical, project-based path from web fundamentals to full-stack development — frontend, backend, databases and deployment.",
    level: "Beginner to Intermediate",
    mode: "Online",
    // Approximate — the schedule has not been finalised, so this is not
    // presented as a guaranteed timeline.
    duration: "Approximately 4–6 months",
    eligibility: "[ELIGIBILITY]",
    status: "pending",
    visualType: "grid",
    artLabel: "MODULAR GRID ARCHITECTURE",
    pathway: ["LEARN", "BUILD", "PROVE"],
  },
  {
    num: "02",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "artificial-intelligence",
    shortDescription:
      "[PROGRAM DESCRIPTION — applied machine learning and AI tooling in real products.]",
    ...pending,
    status: "pending",
    visualType: "nodes",
    artLabel: "NODES & RELATIONSHIPS",
    pathway: ["LEARN", "BUILD", "CREATE"],
  },
  {
    num: "03",
    slug: "technology-programs",
    name: "Technology Programs",
    category: "technology-programs",
    shortDescription: "[PROGRAM DESCRIPTION — systems, data and cloud fundamentals.]",
    ...pending,
    status: "pending",
    visualType: "signals",
    artLabel: "SYSTEMS & SIGNALS",
    pathway: ["LEARN", "PROVE"],
  },
  {
    num: "04",
    slug: "business-and-entrepreneurship",
    name: "Business & Entrepreneurship",
    category: "business-entrepreneurship",
    shortDescription:
      "[PROGRAM DESCRIPTION — turning technical capability into an operating business.]",
    ...pending,
    status: "pending",
    visualType: "direction",
    artLabel: "DIRECTIONAL STRUCTURE",
    pathway: ["LEARN", "CREATE", "ADVANCE"],
  },
  {
    num: "05",
    slug: "digital-skills",
    name: "Digital Skills",
    category: "digital-skills",
    shortDescription:
      "[PROGRAM DESCRIPTION — short foundational tracks with a route into longer programs.]",
    ...pending,
    status: "pending",
    visualType: "modular",
    artLabel: "MODULAR SIGNALS",
    pathway: ["DISCOVER", "LEARN"],
  },
];

/**
 * Filter facets. Values stay bracketed until real data lands, so the controls
 * are exercisable without implying a taxonomy nobody has approved.
 */
export const levelOptions = ["[LEVEL]"];
export const modeOptions = ["[MODE]"];

export function categoryOf(program: Program): ProgramCategory {
  return categories.find((c) => c.slug === program.category) ?? categories[0];
}

/**
 * The shared academy taxonomy (see `@/content/catalogue/categories`) — used
 * by the catalogue page (`/programs`) and detail pages, never by the
 * homepage explorer, which keeps the 5-track `categories` above untouched.
 */
export const catalogueCategories: SharedCategory[] = sharedCategories;

/** Maps the homepage's 5 legacy category slugs onto the nearest shared-taxonomy id, for catalogue display only. */
const LEGACY_TO_SHARED: Record<CategorySlug, SharedCategory["id"]> = {
  "web-software-development": "webdev",
  "artificial-intelligence": "tech",
  "technology-programs": "tech",
  "business-entrepreneurship": "business",
  "digital-skills": "business",
};

/**
 * Category lookup for the catalogue page, which understands the full shared
 * taxonomy. A legacy homepage program (still carrying one of the 5 original
 * slugs) resolves through `LEGACY_TO_SHARED`; a spreadsheet-sourced program
 * (already a shared-taxonomy slug) resolves directly. Never used by the
 * homepage itself — see `categoryOf` above for that.
 */
export function catalogueCategoryOf(program: Program): SharedCategory {
  const direct = catalogueCategories.find((c) => c.id === program.category);
  if (direct) return direct;
  const mapped = LEGACY_TO_SHARED[program.category as CategorySlug];
  return catalogueCategories.find((c) => c.id === mapped) ?? catalogueCategories[0];
}

function toProgram(course: NormalizedCourse, num: string): Program {
  const visual = course.category ? categoryVisual[course.category] : categoryVisual.business;
  return {
    num,
    slug: course.slug,
    name: course.name,
    category: course.category ?? "business",
    duration: course.duration.raw,
    status: "pending",
    visualType: visual.visualType,
    artLabel: visual.artLabel,
    courseCode: course.codeConflict ? undefined : (course.courseCode ?? undefined),
    codeConflict: course.codeConflict,
    subcategory: course.subcategory ?? undefined,
    // Curriculum keywords folded in so the catalogue's synchronous search
    // (over plain Program objects, no ProgramDetail lookup) also matches on
    // curriculum content, per the SEARCH requirement.
    tags: [...course.tags, ...course.curriculum],
    courseType: course.courseType ?? undefined,
    sourceName: course.sourceName,
  };
}

/**
 * The full dark catalogue: the 5 original homepage tracks (unchanged) plus
 * the 22 real courses imported from `Course_Details_Master_Sheet.xlsx`. Used
 * by `/programs`, `/programs/[slug]`, and `sitemap.ts` — never by the
 * homepage explorer, which keeps reading the bare `programs` export above so
 * its layout and copy ("Five routes into the system") stay exactly as they
 * are today.
 */
export const allCoursePrograms: Program[] = [
  ...programs,
  ...catalogueCourses.map((course, i) => toProgram(course, String(6 + i).padStart(2, "0"))),
];

/** Real, non-placeholder values only — a bracketed `[LEVEL]`/`[MODE]` never reaches this list. */
export const catalogueLevelOptions = [
  ...new Set(allCoursePrograms.map((p) => p.level).filter((v): v is string => typeof v === "string" && !v.startsWith("["))),
];
export const catalogueModeOptions = [
  ...new Set(allCoursePrograms.map((p) => p.mode).filter((v): v is string => typeof v === "string" && !v.startsWith("["))),
];
export const catalogueCourseTypeOptions = [
  ...new Set(allCoursePrograms.map((p) => p.courseType).filter((v): v is string => Boolean(v))),
];
export const catalogueDurationOptions = [
  ...new Set(allCoursePrograms.map((p) => p.duration).filter((v): v is string => typeof v === "string" && !v.startsWith("["))),
];

/** Status label — text, never colour alone. */
export const statusLabel: Record<Program["status"], string> = {
  open: "Applications open",
  upcoming: "Upcoming intake",
  pending: "Admissions open based on current course availability.",
};

/** Metadata rows, in the order the preview and accordion present them. */
export function programMetaRows(program: Program) {
  return [
    { label: "Duration", value: program.duration },
    { label: "Mode", value: program.mode },
    { label: "Level", value: program.level },
  ];
}
