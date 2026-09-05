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
  /** Not present in the source for any spreadsheet course — null unless confirmed. */
  mode: string | null;
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
  /** Learning outcomes — not present in the source. */
  outcomes: string[] | null;
  /** Cleaned, best-effort split of "Course Curriculum / Topics". */
  curriculum: string[];
  /** Verbatim spreadsheet curriculum text. */
  curriculumRaw: string;
  /** Not present in the source. */
  eligibility: string[] | null;
  /** Not present in the source. */
  certification: { name: string; issuedBy: string; verification: string } | null;
  /** Not present in the source. */
  fees: { program: string; registration: string; paymentTerms: string; tax: string } | null;

  featured: boolean;
  status: CourseStatus;

  /** Excel row number in "Course List", for audit traceability. `null` for non-spreadsheet records (e.g. Full Stack). */
  sourceRow: number | null;
};
