import { programs } from "@/content/programs";
import type { CurriculumModule, ProgramDetail } from "@/types/program";

/**
 * Program detail content.
 *
 * Every program's detail is placeholder text today, so the shape is produced
 * by one builder rather than copied five times. When real copy arrives, a
 * program overrides only the fields it has — nothing here asserts a fee, an
 * eligibility rule, a certificate, an accreditation or an outcome.
 */

function placeholderModules(count: number): CurriculumModule[] {
  return Array.from({ length: count }, (_, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: `[MODULE ${i + 1} TITLE]`,
    body: "[MODULE DESCRIPTION — approved curriculum copy pending.]",
    topics: ["[TOPIC]", "[TOPIC]", "[TOPIC]"],
  }));
}

function makeDetail(overrides: Partial<ProgramDetail> = {}): ProgramDetail {
  return {
    overview: "[PROGRAM OVERVIEW — 2 SENTENCES.]",
    about: "[ABOUT THIS PROGRAM — approved copy pending.]",
    audience: [
      "[AUDIENCE — who this program is designed for.]",
      "[AUDIENCE — prior experience assumed, if any.]",
      "[AUDIENCE — who this program is not intended for.]",
    ],
    learningOutcomes: [
      "[LEARNING OUTCOME]",
      "[LEARNING OUTCOME]",
      "[LEARNING OUTCOME]",
      "[LEARNING OUTCOME]",
    ],
    modules: placeholderModules(6),
    projectExperience: "[PROJECT EXPERIENCE — how applied work is structured and reviewed.]",
    eligibility: [
      "[ELIGIBILITY REQUIREMENT]",
      "[ELIGIBILITY REQUIREMENT]",
      "[ELIGIBILITY REQUIREMENT]",
    ],
    certification: {
      name: "[CERTIFICATE NAME]",
      issuedBy: "[ISSUED BY]",
      verification: "[VERIFICATION INFORMATION]",
    },
    // Null until SRS Academy publishes fees. The page shows an honest
    // fallback rather than a number nobody has approved.
    fees: null,
    admissionsSteps: [
      { num: "01", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "02", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "03", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "04", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "05", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
    ],
    importantDates: undefined,
    downloads: undefined,
    faq: [
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
    ],
    relatedPrograms: [],
    startDate: undefined,
    primaryCta: "[PRIMARY PROGRAM CTA]",
    ...overrides,
  };
}

/** Related programs: the other programs, nearest first by index. */
function relatedFor(slug: string): string[] {
  const index = programs.findIndex((p) => p.slug === slug);
  return programs
    .filter((_, i) => i !== index)
    .slice(0, 3)
    .map((p) => p.slug);
}

export const programDetails: Record<string, ProgramDetail> = Object.fromEntries(
  programs.map((program) => [
    program.slug,
    makeDetail({ relatedPrograms: relatedFor(program.slug) }),
  ]),
);

export function detailFor(slug: string): ProgramDetail | undefined {
  return programDetails[slug];
}

/** In-page navigation. Only sections that always exist appear here. */
export const detailSections = [
  { id: "overview", label: "Overview" },
  { id: "learning", label: "Learning" },
  { id: "curriculum", label: "Curriculum" },
  { id: "eligibility", label: "Eligibility" },
  { id: "certification", label: "Certification" },
  { id: "fees", label: "Fees" },
  { id: "admissions", label: "Admissions" },
  { id: "faq", label: "FAQ" },
] as const;
