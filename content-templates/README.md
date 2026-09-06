# Course content templates

Generated, editor-friendly exports of the master course-content template.
Regenerate after any change to the catalogue or `enrichment.ts`:

```bash
pnpm dlx tsx scripts/generate-course-template.ts
python3 scripts/generate-course-template.py
```

- **`course-content-template.xlsx`** — the file to hand to SRS Academy for review/editing. Two sheets: `Instructions` and `Courses`. Cells shaded yellow are the 7 tracked fields (`mode`, `level`, `overview`, `outcomes`, `eligibility`, `certification`, `fees`) that are still blank for that course.
- **`course-content-template.csv`** — the same 23 rows as plain CSV, for tools that prefer it.
- **`course-content-template.json`** — intermediate data the Python step reads; also useful if you want to script something else against the same rows.
- **`missing-field-report.md`** — which of the 7 tracked fields each course is still missing, in one glance.

None of these files are read by the website at runtime — they're generated *from* the live catalogue (`src/content/catalogue/master-template.ts`), not the other way around. To change what visitors actually see, edit `src/content/catalogue/enrichment.ts` directly (see that file's own header for the format), then regenerate these exports so they reflect the update.

## Draft content (`course-content-draft.xlsx`)

A separate, review-only workbook with editorial *draft* suggestions for `overviewDraft`, `outcomesDraft` and `curriculumDraft` — generated only from course name, category, subcategory, duration and the existing verified curriculum topics, never from guessed facts. Regenerate with:

```bash
pnpm dlx tsx scripts/generate-course-draft.ts
python3 scripts/generate-course-draft.py
```

- Verified/source columns (`slug` … `notes`) are carried through unchanged from the live catalogue; `mode`, `level`, `eligibility`, `certification`, `fees` stay blank unless already verified — this pass never drafts them.
- Every row starts `draftStatus = "NEEDS REVIEW"`. Nothing with that status may be imported into the live enrichment source.
- `draftFlags` calls out anything uncertain: too few curriculum topics to safely draft outcomes, no obvious grouping for `curriculumDraft`, or a sensitive course type (`Certificate` / `Diploma` / `Advanced Diploma` / `Training Program`) whose title must never be read as proof of accreditation, government recognition, university affiliation, internship placement, or professional licensing.
- Approving a row here doesn't publish it — copy the approved text into `course-content-template.xlsx` and run the existing two-step `scripts/import-course-content.py` workflow as usual.
