/**
 * Shared catalogue schema — one course record shape, read by both the dark
 * (`/programs`) and light (`/light/courses`) themes. See `courses.ts` for the
 * data and `helpers.ts` for the adapters that turn a `NormalizedCourse` into
 * each theme's own display shape.
 *
 * Every field the source spreadsheet doesn't provide is `null`, never a
 * fabricated value or a bracketed placeholder — see
 * `Course_Details_Master_Sheet.xlsx` (Course List sheet) for the source of
 * truth this was built from.
 */

/** The shared academy taxonomy. Extensible — add an id here and in `categories.ts`. */
export type SharedCategorySlug =
  | "tech" // AI & Technology
  | "webdev" // Web & Software Development
  | "business" // Digital & Business Skills
  | "beauty" // Beauty & Makeup
  | "creative" // Mehendi & Creative Arts
  | "fashion" // Fashion & Lifestyle
  | "trades" // Technical & Skilled Trades
  | "career" // Communication & Career Skills
  | "corporate" // Professional & Corporate Learning
  | "food"; // Food & Baking

export type SharedCategory = {
  id: SharedCategorySlug;
  label: string;
  emoji: string;
  /** Tailwind arbitrary-value friendly tint, used on light's category chips. */
  tint: string;
};

/**
 * Literal type words found in course names, plus "Training Program" for the
 * two internship-named courses (approved decision: no company placement is
 * implied). `null` when a course's name carries no type word at all — never
 * guessed.
 */
export type CourseType =
  | "Certificate"
  | "Diploma"
  | "Advanced Diploma"
  | "Course"
  | "Training Program";

export type CourseStatus = "draft" | "live" | "placeholder";

/** Verified delivery modes only — a course can have one or several; never assumed. */
export type CourseMode = "Online" | "Offline" | "Hybrid";

/** One named group of real curriculum topics — richer than the flat `curriculum` list, still zero invented topics. */
export type CourseCurriculumModule = {
  title: string;
  topics: string[];
};

export type NormalizedCourse = {
  /** Stable identifier = slug. Never the spreadsheet's `courseCode`, which collides once. */
  id: string;
  slug: string;

  /** Normalized public display name (see APPROVED DECISIONS: casing, "Advance"→"Advanced", "Sikhsha"). */
  name: string;
  /** Verbatim spreadsheet text, preserved for audit/search. */
  sourceName: string;

  /** Spreadsheet course code — informational only, never a key. */
  courseCode: string | null;
  /** Verbatim spreadsheet code, always populated when the sheet had one (even the conflicting VTDB001). */
  sourceCourseCode: string | null;
  /** True for the two rows sharing VTDB001. Do not surface the code publicly while true. */
  codeConflict: boolean;

  category: SharedCategorySlug | null;
  subcategory: string | null;
  /** Extra searchable keywords beyond name/category/curriculum. */
  tags: string[];

  courseType: CourseType | null;
  /** Not present in the source for any spreadsheet course — null unless confirmed. One course can have several verified modes. */
  mode: CourseMode[] | null;
  /** Not present in the source for any spreadsheet course — null unless confirmed. */
  level: string | null;

  duration: {
    /** Verbatim spreadsheet text, e.g. "3 Months", "120 Hours". */
    raw: string;
    /** Populated only for unambiguous Month/Year values. Never derived from Hours. */
    months: number | null;
    /** Populated only for Hours-based durations. */
    hours: number | null;
  };

  /** Marketing/editorial description — not present in the source. Null unless authored separately (see Full Stack). */
  overview: string | null;
  /** Learning outcomes — not present in the source. Never derived automatically from curriculum. */
  outcomes: string[] | null;
  /** Cleaned, best-effort split of "Course Curriculum / Topics". Always populated from the sheet. */
  curriculum: string[];
  /** Verbatim spreadsheet curriculum text. */
  curriculumRaw: string;
  /**
   * Optional richer curriculum, grouped into named modules — real topics
   * only, manually organized (never auto-split from `curriculum`). Falls
   * back to a single flat module built from `curriculum` when absent.
   */
  curriculumModules: CourseCurriculumModule[] | null;
  /** Not present in the source. Accepts either one string or a short list. */
  eligibility: string[] | null;
  /**
   * Neutral wording only — never implies government recognition, university
   * affiliation, accreditation, guaranteed acceptance or professional
   * licensing unless that text is itself supplied here.
   */
  certification: string | null;
  /**
   * Not present in the source. Either an exact fee string or the literal
   * "Contact for current fees" — set per course, never applied globally.
   */
  fees: string | null;
  /** Overrides the default "Enquire About This Program" CTA when a course needs different wording. */
  primaryCta: string | null;
  /** Internal editorial notes — never rendered on a public page. */
  notes: string | null;

  featured: boolean;
  status: CourseStatus;

  /** Excel row number in "Course List", for audit traceability. `null` for non-spreadsheet records (e.g. Full Stack). */
  sourceRow: number | null;
};

/**
 * One course's enrichment — everything a human/Claude can safely add once
 * it's actually confirmed, keyed by slug in `enrichment.ts`. Every field is
 * optional and independent: fill in only what's verified, leave the rest
 * out entirely rather than setting it to `null` explicitly (both read the
 * same at merge time, but an absent key is a clearer signal in a file meant
 * to be edited by hand later).
 *
 * Deliberately narrower/simpler than `NormalizedCourse`'s own shape in a
 * couple of places (certification and fees are a plain string here, not an
 * object) — `mergeEnrichment()` in `helpers.ts` is the one place that maps
 * between the two, so this file never needs to know the catalogue's
 * internal representation.
 */
export type CourseEnrichment = {
  mode?: CourseMode[] | null;
  level?: string | null;
  overview?: string | null;
  outcomes?: string[] | null;
  eligibility?: string[] | string | null;
  /** Neutral wording only — see `NormalizedCourse.certification`. */
  certification?: string | null;
  /** An exact amount, the literal `"Contact for current fees"`, or omitted — never applied by default. */
  fees?: string | null;
  /** Named topic groups, using only real curriculum topics — see `NormalizedCourse.curriculumModules`. */
  curriculum?: CourseCurriculumModule[] | null;
  /** Overrides the default "Enquire About This Program" CTA. */
  primaryCta?: string | null;
  /** Internal editorial notes — never rendered on a public page. */
  notes?: string | null;
};
