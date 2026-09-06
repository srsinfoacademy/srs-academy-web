/**
 * Prints the raw `courseEnrichment` object (the actual overrides in
 * enrichment.ts, before merging with the spreadsheet base) as JSON on
 * stdout. Used by scripts/import-course-content.py to know what's already
 * an explicit override versus what's just the spreadsheet default, so an
 * unedited XLSX cell never wipes out an existing override.
 *
 * Run with: pnpm dlx tsx scripts/dump-enrichment.ts
 */
import { courseEnrichment } from "@/content/catalogue/enrichment";

process.stdout.write(JSON.stringify(courseEnrichment, null, 2));
