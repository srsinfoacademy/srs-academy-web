/**
 * Generates the human-editable exports of the master course-content
 * template (see `src/content/catalogue/master-template.ts`) — a CSV, and a
 * JSON intermediate the accompanying Python step turns into a formatted
 * XLSX workbook. Both land in `content-templates/`.
 *
 * Run with: pnpm dlx tsx scripts/generate-course-template.ts
 *
 * This script only reads the live catalogue and writes files under
 * `content-templates/` — it never writes back into `src/`. Editing real
 * course content still means editing `src/content/catalogue/enrichment.ts`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  completenessSummary,
  masterCourseTemplate,
  missingFieldReport,
  TRACKED_FIELDS,
  type MasterCourseRow,
} from "@/content/catalogue/master-template";

const OUT_DIR = join(process.cwd(), "content-templates");
mkdirSync(OUT_DIR, { recursive: true });

const CSV_COLUMNS: { key: keyof MasterCourseRow | "completenessState" | "completenessPercent" | "missingFields"; label: string }[] = [
  { key: "slug", label: "slug" },
  { key: "courseCode", label: "courseCode" },
  { key: "courseName", label: "courseName" },
  { key: "category", label: "category" },
  { key: "subcategory", label: "subcategory" },
  { key: "courseType", label: "courseType" },
  { key: "duration", label: "duration" },
  { key: "mode", label: "mode" },
  { key: "level", label: "level" },
  { key: "overview", label: "overview" },
  { key: "outcomes", label: "outcomes" },
  { key: "eligibility", label: "eligibility" },
  { key: "certification", label: "certification" },
  { key: "fees", label: "fees" },
  { key: "curriculum", label: "curriculum" },
  { key: "featured", label: "featured" },
  { key: "status", label: "status" },
  { key: "notes", label: "notes" },
  { key: "completenessState", label: "completenessState" },
  { key: "completenessPercent", label: "completenessPercent" },
  { key: "missingFields", label: "missingFields" },
];

/** Flattens one row's value for a flat-text CSV/XLSX cell. Arrays join with " | "; null becomes an empty cell — never a placeholder word. */
function cellValue(row: MasterCourseRow, key: (typeof CSV_COLUMNS)[number]["key"]): string {
  if (key === "completenessState") return row.completeness.state;
  if (key === "completenessPercent") return String(row.completeness.percent);
  if (key === "missingFields") return row.completeness.missingFields.join(" | ");

  const value = row[key];
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(" | ");
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return String(value);
}

function csvEscape(value: string): string {
  if (value === "") return "";
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function toCsv(rows: MasterCourseRow[]): string {
  const header = CSV_COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const lines = rows.map((row) => CSV_COLUMNS.map((c) => csvEscape(cellValue(row, c.key))).join(","));
  return [header, ...lines].join("\n") + "\n";
}

// 1. CSV — directly editable in any spreadsheet tool.
writeFileSync(join(OUT_DIR, "course-content-template.csv"), toCsv(masterCourseTemplate), "utf-8");

// 2. JSON intermediate — consumed by scripts/generate-course-template.py to build the formatted XLSX.
writeFileSync(
  join(OUT_DIR, "course-content-template.json"),
  JSON.stringify(
    {
      columns: CSV_COLUMNS.map((c) => c.label),
      rows: masterCourseTemplate.map((row) => CSV_COLUMNS.map((c) => cellValue(row, c.key))),
      trackedFields: TRACKED_FIELDS,
      completenessSummary: completenessSummary(),
      missingFieldReport: missingFieldReport(),
    },
    null,
    2,
  ),
  "utf-8",
);

// 3. Missing-field report — plain Markdown, readable without opening a spreadsheet.
const report = missingFieldReport();
const summary = completenessSummary();
const reportLines = [
  "# Course content — missing-field report",
  "",
  `Generated from the live catalogue. ${masterCourseTemplate.length} real courses total.`,
  "",
  `**Completeness:** ${summary.complete} complete · ${summary.partial} partial · ${summary.minimal} minimal`,
  "",
  "| Course | Slug | Missing fields |",
  "| --- | --- | --- |",
  ...report.map((r) => `| ${r.courseName} | \`${r.slug}\` | ${r.missingFields.join(", ")} |`),
  "",
];
writeFileSync(join(OUT_DIR, "missing-field-report.md"), reportLines.join("\n"), "utf-8");

console.log(`Wrote ${masterCourseTemplate.length} rows to ${OUT_DIR}/course-content-template.csv`);
console.log(`Wrote intermediate JSON to ${OUT_DIR}/course-content-template.json`);
console.log(`Wrote missing-field report to ${OUT_DIR}/missing-field-report.md`);
console.log("Completeness summary:", summary);
