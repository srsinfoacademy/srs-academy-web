export type ProgramLevel = "[LEVEL]" | "Foundation" | "Intermediate" | "Advanced";

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
  category: CategorySlug;
  shortDescription: string;
  level: string;
  mode: string;
  duration: string;
  eligibility: string;
  /** Admissions status. Rendered with text, never colour alone. */
  status: "open" | "upcoming" | "pending";
  visualType: VisualType;
  artLabel: string;
  /** Stages this program moves through, drawn from the node system. */
  pathway: string[];
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
  /** Two sentences under the hero title. */
  overview: string;
  /** Longer "About this program" body. */
  about: string;
  audience: string[];
  learningOutcomes: string[];
  modules: CurriculumModule[];
  /** Applied/project work. Omitted where a program has none. */
  projectExperience?: string;
  eligibility: string[];
  certification: {
    name: string;
    issuedBy: string;
    verification: string;
  };
  /**
   * Null where fees are not published. The page then shows an honest
   * fallback and points at admissions rather than inventing a price.
   */
  fees: Fees;
  admissionsSteps: AdmissionStep[];
  /** Optional — the section is omitted entirely when empty. */
  importantDates?: { label: string; value: string }[];
  /** Optional — omitted when empty. */
  downloads?: { name: string; note: string }[];
  faq: FaqItem[];
  /** Slugs of related programs. Invalid slugs are dropped at render. */
  relatedPrograms: string[];
  startDate?: string;
  primaryCta: string;
};
