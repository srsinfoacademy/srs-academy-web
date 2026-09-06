/**
 * Generates DRAFT editorial suggestions (overview / outcomes / curriculum
 * presentation) for every real catalogue course, from nothing but course
 * name, category, subcategory, duration and the existing verified
 * curriculum/topics — never from guessed facts.
 *
 * This is a proposal file only:
 *   - It does NOT write to `src/content/catalogue/enrichment.ts`.
 *   - It does NOT change anything the website renders.
 *   - Every row is default-tagged `draftStatus: "NEEDS REVIEW"` — nothing
 *     here is meant to be imported until a human (or a later, explicit
 *     approval step) marks it `APPROVED`.
 *
 * Fields the task explicitly says never to draft (mode, level, eligibility,
 * certification, fees, accreditation, recognition, admission requirements,
 * placement/income claims) are left exactly as they already are in the live
 * data — populated only where already verified, blank otherwise. This
 * script never writes to those columns.
 *
 * Run with: pnpm dlx tsx scripts/generate-course-draft.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { catalogueCourses } from "@/content/catalogue/courses";
import { masterCourseTemplate, type MasterCourseRow } from "@/content/catalogue/master-template";
import type { CourseCurriculumModule } from "@/content/catalogue/types";

const OUT_DIR = join(process.cwd(), "content-templates");
mkdirSync(OUT_DIR, { recursive: true });

/** Course-type words that must never be treated as proof of accreditation, recognition, or licensing. */
const SENSITIVE_COURSE_TYPES = new Set(["Certificate", "Diploma", "Advanced Diploma", "Training Program"]);

const OUTCOME_VERBS = ["Understand", "Learn to", "Practice", "Explore", "Use basic", "Develop familiarity with"];

type DraftRow = MasterCourseRow & {
  overviewDraft: string | null;
  outcomesDraft: string[] | null;
  curriculumDraft: CourseCurriculumModule[] | null;
  draftStatus: "NEEDS REVIEW" | "APPROVED" | "REJECTED";
  draftFlags: string[];
};

/**
 * `splitCurriculum` (helpers.ts) splits the spreadsheet's raw prose on every
 * comma, which breaks apart anything like "MS Office (Word, Excel,
 * PowerPoint)" into three fragments with an unclosed paren. Re-joins those
 * fragments back into one topic before this script uses them for drafting —
 * purely a formatting repair, no topic content added or removed.
 */
function repairSplitParens(topics: string[]): string[] {
  const out: string[] = [];
  let buffer: string | null = null;
  for (const t of topics) {
    if (buffer !== null) {
      buffer = `${buffer}, ${t}`;
      if (t.includes(")")) {
        out.push(buffer);
        buffer = null;
      }
      continue;
    }
    if (t.includes("(") && !t.includes(")")) {
      buffer = t;
    } else {
      out.push(t);
    }
  }
  if (buffer !== null) out.push(buffer); // unclosed paren at end of list — keep as-is rather than dropping content
  return out;
}

/** Trims a topic string down to a short noun phrase suitable for inline listing, without altering its meaning. */
function shortenTopic(topic: string): string {
  return topic
    .replace(/\s*\([^)]*\)\s*/g, " ") // drop parenthetical examples — still fine to mention the parent topic
    .replace(/\s+/g, " ")
    .trim();
}

function naturalJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Picks a small, representative sample of topics for prose — first few, deduped, shortened. */
function sampleTopics(topics: string[], max: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of topics) {
    const t = shortenTopic(raw);
    const key = t.toLowerCase();
    if (!t || seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function areaLabel(row: MasterCourseRow): string {
  return row.subcategory ?? row.category ?? "this subject area";
}

/**
 * Builds a factual, neutral overview strictly from curriculum topics — no
 * job-readiness, guarantee, certification, or recognition language, and no
 * course-type word treated as proof of anything.
 */
function draftOverview(row: MasterCourseRow): { text: string | null; flag: string | null } {
  if (row.overview) return { text: null, flag: null }; // already verified — do not touch or duplicate
  if (row.curriculum.length === 0) return { text: null, flag: "No curriculum topics available — insufficient source data to draft an overview." };

  const sample = sampleTopics(repairSplitParens(row.curriculum), 6);
  if (sample.length === 0) return { text: null, flag: "Curriculum topics too sparse to draft an overview." };

  const topicPhrase = naturalJoin(sample);
  const text = `This course introduces learners to ${areaLabel(row).toLowerCase()}, covering ${topicPhrase}, over a duration of ${row.duration}.`;

  return { text, flag: null };
}

/**
 * Generates 3–6 outcomes, one per distinct topic sampled from the
 * curriculum, cycling through approved neutral verbs. Never uses "Master",
 * "expert", "guaranteed", or "job-ready" wording.
 */
function draftOutcomes(row: MasterCourseRow): { list: string[] | null; flag: string | null } {
  if (row.outcomes && row.outcomes.length > 0) return { list: null, flag: null }; // already verified
  if (row.curriculum.length === 0) return { list: null, flag: "No curriculum topics available — insufficient source data to draft outcomes." };

  const repaired = repairSplitParens(row.curriculum);
  const sample = sampleTopics(repaired, 6).slice(0, Math.max(3, Math.min(6, repaired.length)));
  if (sample.length < 3) {
    return {
      list: null,
      flag: `Only ${sample.length} distinct topic(s) in the curriculum — not enough to safely draft 3–6 outcomes.`,
    };
  }

  const list = sample.map((topic, i) => `${OUTCOME_VERBS[i % OUTCOME_VERBS.length]} ${topic.toLowerCase()}.`);
  return { list, flag: null };
}

/**
 * Only regroups the flat topic list into modules when a boundary is
 * literally present in the source text (a topic ending in "Introduction"
 * marking the start of a new named subject) — never an invented split.
 */
function draftCurriculum(
  slug: string,
  row: MasterCourseRow,
): { modules: CourseCurriculumModule[] | null; flag: string | null } {
  const course = catalogueCourses.find((c) => c.slug === slug);
  const alreadyStructured = course ? course.curriculumModules !== null : slug === "full-stack-web-development";
  if (alreadyStructured) {
    return { modules: null, flag: null }; // already has a richer structure — nothing to draft
  }

  const topics = repairSplitParens(row.curriculum);
  if (topics.length === 0) return { modules: null, flag: "No curriculum topics available." };

  const boundaries = topics
    .map((t, i) => ({ i, isBoundary: i > 0 && /\bIntroduction$/i.test(t.trim()) }))
    .filter((x) => x.isBoundary)
    .map((x) => x.i);

  if (boundaries.length === 0) {
    return { modules: null, flag: "No obvious grouping present in the source topic list — kept as a flat list." };
  }

  const starts = [0, ...boundaries];
  const modules: CourseCurriculumModule[] = starts.map((start, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1] : topics.length;
    const chunk = topics.slice(start, end);
    const marker = chunk[0];
    const title = /\bIntroduction$/i.test(chunk[0].trim())
      ? `${chunk[0].trim().replace(/\s*Introduction$/i, "")} Concepts`
      : idx === 0
        ? "Foundations"
        : `${marker} Concepts`;
    return { title, topics: chunk };
  });

  return { modules, flag: null };
}

function isSensitiveType(courseType: string | null): boolean {
  return courseType !== null && SENSITIVE_COURSE_TYPES.has(courseType);
}

const draftRows: DraftRow[] = masterCourseTemplate.map((row) => {
  const flags: string[] = [];

  const overview = draftOverview(row);
  if (overview.flag) flags.push(overview.flag);

  const outcomes = draftOutcomes(row);
  if (outcomes.flag) flags.push(outcomes.flag);

  const curriculum = draftCurriculum(row.slug, row);
  if (curriculum.flag) flags.push(curriculum.flag);

  if (isSensitiveType(row.courseType)) {
    flags.push(
      `Course type "${row.courseType}" — title alone is not treated as proof of accreditation, government recognition, university affiliation, internship placement, or professional licensing; overview/outcomes kept neutral.`,
    );
  }

  return {
    ...row,
    overviewDraft: overview.text,
    outcomesDraft: outcomes.list,
    curriculumDraft: curriculum.modules,
    draftStatus: "NEEDS REVIEW",
    draftFlags: flags,
  };
});

// --- Write JSON intermediate for the Python XLSX step ---
writeFileSync(join(OUT_DIR, "course-content-draft.json"), JSON.stringify(draftRows, null, 2), "utf-8");

// --- Console summary for the calling task ---
const totalCourses = draftRows.length;
const overviewsGenerated = draftRows.filter((r) => r.overviewDraft !== null).length;
const outcomesGenerated = draftRows.filter((r) => r.outcomesDraft !== null).length;
const curriculumDrafted = draftRows.filter((r) => r.curriculumDraft !== null).length;
const insufficientData = draftRows.filter(
  (r) => r.overviewDraft === null && r.outcomesDraft === null && r.curriculumDraft === null && r.overview === null,
).length;
const flaggedCourses = draftRows.filter((r) => r.draftFlags.length > 0).length;

console.log(
  JSON.stringify(
    {
      totalCourses,
      overviewsGenerated,
      outcomesGenerated,
      curriculumDrafted,
      insufficientData,
      flaggedCourses,
    },
    null,
    2,
  ),
);
