import type { SharedCategorySlug } from "@/content/catalogue/types";

export type ProgramLevel = "[LEVEL]" | "Foundation" | "Intermediate" | "Advanced";

/** The homepage explorer's original 5 category tracks — unchanged, still used only there. */
export type CategorySlug =
  | "web-software-development"
  | "artificial-intelligence"
  | "technology-programs"
  | "business-entrepreneurship"
  | "digital-skills";

/** Structural motif family. Each category owns one. */
export type VisualType = "grid" | "nodes" | "signals" | "direction" | "modular";

export type ProgramCategory = {
  slug: CategorySlug;
  num: string;
  name: string;
  /** Short label used by the index rail and the preview. */
  label: string;
  visualType: VisualType;
  artLabel: string;
};

export type Program = {
  num: string;
  slug: string;
  name: string;
  /** Either the homepage's 5 legacy tracks or the shared academy taxonomy — see `catalogueCategoryOf`. */
  category: CategorySlug | SharedCategorySlug;
  /** Not present for a spreadsheet-sourced course — omitted from display, never invented. */
  shortDescription?: string;
  /** Not present for a spreadsheet-sourced course. */
  level?: string;
  /** Not present for a spreadsheet-sourced course. */
  mode?: string;
  duration: string;
  /** Not present for a spreadsheet-sourced course. */
  eligibility?: string;
  /** Admissions status. Rendered with text, never colour alone. */
  status: "open" | "upcoming" | "pending";
  visualType: VisualType;
  artLabel: string;
  /** Stages this program moves through — a hand-authored narrative, so optional; not invented per course. */
  pathway?: string[];
  /** Spreadsheet course code, when one exists and isn't in conflict (see `codeConflict`). */
  courseCode?: string;
  codeConflict?: boolean;
  subcategory?: string;
  tags?: string[];
  courseType?: string;
  /** Verbatim spreadsheet name, before normalization — searchable, not displayed. */
  sourceName?: string;
};

export type CurriculumModule = {
  num: string;
  title: string;
  body: string;
  topics?: string[];
};

export type FaqItem = { q: string; a: string };

export type AdmissionStep = { num: string; title: string; body: string };

export type Fees = {
  program: string;
  registration: string;
  paymentTerms: string;
  tax: string;
} | null;

export type ProgramDetail = {
  /** Two sentences under the hero title. Not present for a spreadsheet-only course. */
  overview?: string;
  /** Longer "About this program" body. Not present for a spreadsheet-only course. */
  about?: string;
  /** Not present for a spreadsheet-only course — section omitted rather than invented. */
  audience?: string[];
  /** Not present for a spreadsheet-only course. */
  learningOutcomes?: string[];
  /** Always populated — from hand-authored copy, or from the spreadsheet's curriculum for a basic record. */
  modules: CurriculumModule[];
  /** Applied/project work. Omitted where a program has none. */
  projectExperience?: string;
  /** Not present for a spreadsheet-only course. */
  eligibility?: string[];
  /** Not present for a spreadsheet-only course. */
  certification?: {
    name: string;
    issuedBy: string;
    verification: string;
  };
  /**
   * Null where fees are not published. The page then shows an honest
   * fallback and points at admissions rather than inventing a price.
   */
  fees: Fees;
  /** Not present for a spreadsheet-only course — section omitted rather than invented. */
  admissionsSteps?: AdmissionStep[];
  /** Optional — the section is omitted entirely when empty. */
  importantDates?: { label: string; value: string }[];
  /** Optional — omitted when empty. */
  downloads?: { name: string; note: string }[];
  /** Not present for a spreadsheet-only course. */
  faq?: FaqItem[];
  /** Slugs of related programs. Invalid slugs are dropped at render. */
  relatedPrograms: string[];
  startDate?: string;
  primaryCta: string;
};
