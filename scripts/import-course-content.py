#!/usr/bin/env python3
"""
Two-step importer for the edited master course-content workbook
(content-templates/course-content-template.xlsx).

STEP 1 — VALIDATE + PREVIEW (default; this is the only thing that runs
unless you explicitly ask for --apply):

    python3 scripts/import-course-content.py path/to/edited.xlsx

Reads every row, validates it, diffs it against the live catalogue, and
writes content-templates/course-import-preview.md. Nothing under src/ is
touched. Review the preview, then re-run with --apply once you're happy
with it.

STEP 2 — APPLY (only after you've reviewed the Step 1 preview):

    python3 scripts/import-course-content.py path/to/edited.xlsx --apply

Re-validates (an --apply run is never trusted blind), then writes only the
fields that passed validation and actually changed into
src/content/catalogue/enrichment.ts, and regenerates the CSV/JSON/XLSX
exports and missing-field report so they reflect the update.

Rules that hold in both steps:
- A blank cell never erases an existing value — only an explicitly
  populated, valid cell can change something.
- Full Stack Web Development's hand-authored detail is never auto-applied.
  Any proposed change to it is flagged for manual review in
  program-detail.ts instead.
- courseCode, courseName, category, subcategory, courseType and duration
  come from the source spreadsheet, not from enrichment — a proposed
  change to any of them is flagged for manual review, never auto-applied.
- No placeholder text (TBD, TODO, [PLACEHOLDER], "null", "undefined") is
  ever accepted as real content.
"""
import argparse
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content-templates"
ENRICHMENT_PATH = ROOT / "src" / "content" / "catalogue" / "enrichment.ts"

VALID_MODES = {"Online", "Offline", "Hybrid"}
VALID_COURSE_TYPES = {"Certificate", "Diploma", "Advanced Diploma", "Course", "Training Program"}
VALID_STATUSES = {"draft", "live", "placeholder"}
PLACEHOLDER_TOKENS = {"tbd", "todo", "null", "undefined"}
PLACEHOLDER_SUBSTRINGS = ["[placeholder]"]

# Fields the sheet can carry but that this importer never writes anywhere —
# they come from the source spreadsheet, so a proposed change is always a
# manual-review flag, never an auto-apply.
SOURCE_FIELDS = {"courseCode", "courseName", "category", "subcategory", "courseType", "duration"}
# Fields that actually flow through enrichment.ts when a row is applied.
ENRICHABLE_FIELDS = ["mode", "level", "overview", "outcomes", "eligibility", "certification", "fees", "curriculum", "notes", "featured", "status"]

FULL_STACK_SLUG = "full-stack-web-development"


def run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Command failed: {' '.join(cmd)}\n{result.stderr}", file=sys.stderr)
        sys.exit(1)
    return result.stdout


def load_live_state():
    """Regenerates the exports fresh (so 'current' is never stale), then loads them."""
    run(["pnpm", "dlx", "tsx", "scripts/generate-course-template.ts"])
    with open(CONTENT_DIR / "course-content-template.json", encoding="utf-8") as f:
        template = json.load(f)
    columns = template["columns"]
    live_rows = {row[columns.index("slug")]: dict(zip(columns, row)) for row in template["rows"]}

    raw = run(["pnpm", "dlx", "tsx", "scripts/dump-enrichment.ts"])
    enrichment = json.loads(raw)

    return live_rows, enrichment, set(live_rows.keys())


def split_list(value: str) -> list[str]:
    return [v.strip() for v in value.split("|") if v.strip()]


def flatten_curriculum_topics(value) -> list[str]:
    """Reduces either shape curriculum can appear in (a flat ' | '-joined string
    from the live JSON export, or a structured [{title, topics}] override from
    enrichment.ts) down to just its topic strings, for a title-agnostic diff."""
    if value is None:
        return []
    if isinstance(value, str):
        return split_list(value)
    if isinstance(value, list) and value and isinstance(value[0], dict):
        return [t for m in value for t in m.get("topics", [])]
    if isinstance(value, list):
        return list(value)
    return []


def unchanged_curriculum(existing_override, proposed) -> bool:
    """True when the proposed curriculum carries the exact same topics as what's
    already there — used to avoid flattening an existing richer, titled module
    structure into a generic single "Curriculum" module just because the XLSX
    round-trips curriculum as a flat pipe-separated cell."""
    return flatten_curriculum_topics(existing_override) == flatten_curriculum_topics(proposed)


def parse_curriculum(value: str):
    """Plain 'topic | topic | topic' -> one module. Richer 'Title >> topic | topic || Title2 >> topic' -> several."""
    if "||" in value or ">>" in value:
        modules = []
        for chunk in value.split("||"):
            chunk = chunk.strip()
            if not chunk:
                continue
            if ">>" not in chunk:
                return None  # malformed: richer syntax used but no title separator
            title, topics_raw = chunk.split(">>", 1)
            topics = split_list(topics_raw)
            if not title.strip() or not topics:
                return None
            modules.append({"title": title.strip(), "topics": topics})
        return modules if modules else None
    topics = split_list(value)
    return [{"title": "Curriculum", "topics": topics}] if topics else None


def find_placeholder(value: str) -> str | None:
    stripped = value.strip()
    if stripped.lower() in PLACEHOLDER_TOKENS:
        return stripped
    for token in PLACEHOLDER_SUBSTRINGS:
        if token in stripped.lower():
            return token
    return None


def looks_like_formula(value: str) -> bool:
    return value.strip().startswith("=") and len(value.strip()) > 1


class RowIssue:
    def __init__(self, level: str, field: str, message: str):
        self.level = level  # "error" | "warning" | "flag"
        self.field = field
        self.message = message


def validate_and_diff_row(row: dict, live: dict, enrichment_raw: dict, known_slugs: set):
    """Returns (issues, field_diffs) for one sheet row. field_diffs is a list of
    {field, current, proposed, action} used both for the report and, on
    --apply, to decide what actually gets written."""
    issues: list[RowIssue] = []
    slug = (row.get("slug") or "").strip()

    if not slug:
        issues.append(RowIssue("error", "slug", "Empty slug — row skipped entirely."))
        return issues, []
    if slug not in known_slugs:
        issues.append(RowIssue("error", "slug", f"Unknown slug '{slug}' — does not match any real catalogue course. Row skipped."))
        return issues, []

    current = live.get(slug, {})
    current_overrides = enrichment_raw.get(slug, {})
    is_full_stack = slug == FULL_STACK_SLUG
    field_diffs = []

    for field, raw_value in row.items():
        if field in ("slug", "completenessState", "completenessPercent", "missingFields"):
            continue
        value = "" if raw_value is None else str(raw_value)

        if looks_like_formula(value):
            issues.append(RowIssue("error", field, f"Cell looks like an unevaluated formula ({value[:40]!r}) — rejected."))
            continue

        placeholder = find_placeholder(value)
        if placeholder:
            issues.append(RowIssue("error", field, f"Placeholder text ({placeholder!r}) is not real content — rejected."))
            continue

        if not value.strip():
            continue  # blank = no proposed change, never a removal

        current_value = current.get(field)

        if field in SOURCE_FIELDS:
            if str(current_value or "") != value.strip():
                issues.append(RowIssue(
                    "flag", field,
                    f"Proposed change to a source-of-truth field (current: {current_value!r}, proposed: {value!r}) "
                    "— this importer never edits course identity fields. Review manually.",
                ))
            continue

        if is_full_stack:
            issues.append(RowIssue(
                "flag", field,
                f"Full Stack Web Development has hand-authored content — proposed {field} "
                f"({value!r}) requires a manual edit in program-detail.ts, not the importer.",
            ))
            continue

        # --- field-specific validation for the fields the importer actually writes ---
        if field == "mode":
            modes = split_list(value)
            invalid = [m for m in modes if m not in VALID_MODES]
            if invalid:
                issues.append(RowIssue("error", field, f"Invalid mode value(s): {invalid} — allowed: {sorted(VALID_MODES)}."))
                continue
            proposed = modes
        elif field == "status":
            if value.strip() not in VALID_STATUSES:
                issues.append(RowIssue("error", field, f"Invalid status {value!r} — allowed: {sorted(VALID_STATUSES)}."))
                continue
            proposed = value.strip()
        elif field == "featured":
            if value.strip().upper() not in {"TRUE", "FALSE"}:
                issues.append(RowIssue("error", field, f"Invalid featured value {value!r} — must be TRUE or FALSE."))
                continue
            proposed = value.strip().upper() == "TRUE"
        elif field in ("outcomes", "eligibility"):
            proposed = split_list(value)
            if not proposed:
                issues.append(RowIssue("error", field, "Malformed list — resolved to zero items."))
                continue
        elif field == "curriculum":
            proposed = parse_curriculum(value)
            if proposed is None:
                issues.append(RowIssue("error", field, "Malformed curriculum — check the '>>' / '||' / '|' structure."))
                continue
        elif field in ("overview", "certification", "fees", "notes", "level"):
            proposed = value.strip()
        else:
            continue  # unrecognized column — ignore rather than guess

        # Determine current-for-diff: prefer the raw override (what's actually
        # in enrichment.ts) when one exists, otherwise fall back to the
        # merged/rendered value already on the live page — either way, a
        # KEEP means "identical to what a visitor already sees today".
        existing_override = current_overrides[field] if field in current_overrides else current_value
        if field == "featured" and isinstance(existing_override, str):
            existing_override = existing_override.strip().upper() == "TRUE"
        if field == "curriculum" and unchanged_curriculum(existing_override, proposed):
            continue  # topics identical — never downgrade an existing richer module structure to re-wrap it
        if existing_override == proposed:
            continue  # no diff worth reporting

        action = "KEEP" if existing_override == proposed else ("CHANGE" if current_value not in (None, [], "") else "ADD")

        field_diffs.append({
            "field": field,
            "current": current.get(field),
            "proposed": proposed,
            "action": action,
        })

    return issues, field_diffs


def format_value(v) -> str:
    if v is None or v == "" or v == []:
        return "null"
    if isinstance(v, list):
        if v and isinstance(v[0], dict):
            return " || ".join(f"{m['title']} >> {' | '.join(m['topics'])}" for m in v)
        return " | ".join(str(x) for x in v)
    return str(v)


def write_preview(rows_report: list[dict], errors_total: int, flags_total: int) -> Path:
    lines = [
        "# Course content import — validation & diff preview",
        "",
        f"Rows processed: {len(rows_report)}. Errors: {errors_total}. Flags requiring manual review: {flags_total}.",
        "",
        "Nothing has been written to the site. Review this file, then re-run with `--apply`.",
        "",
    ]
    for r in rows_report:
        lines.append(f"## {r['slug']}")
        lines.append("")
        if r["issues"]:
            lines.append("**Issues:**")
            for issue in r["issues"]:
                lines.append(f"- [{issue.level.upper()}] `{issue.field}`: {issue.message}")
            lines.append("")
        if r["diffs"]:
            for d in r["diffs"]:
                lines.append(f"**{d['field']}**")
                lines.append(f"- CURRENT: {format_value(d['current'])}")
                lines.append(f"- PROPOSED: {format_value(d['proposed'])}")
                lines.append(f"- ACTION: {d['action']}")
                lines.append("")
        elif not r["issues"]:
            lines.append("_No changes proposed._")
            lines.append("")

    path = CONTENT_DIR / "course-import-preview.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def ts_literal(value, indent=2) -> str:
    pad = " " * indent
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return json.dumps(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        if isinstance(value[0], dict):
            items = ",\n".join(f"{pad}  {{ title: {json.dumps(m['title'])}, topics: {json.dumps(m['topics'])} }}" for m in value)
            return "[\n" + items + f"\n{pad}]"
        return json.dumps(value)
    return json.dumps(value)


def write_enrichment(enrichment: dict) -> None:
    header = ENRICHMENT_PATH.read_text(encoding="utf-8").split("export const courseEnrichment")[0]
    lines = [header.rstrip(), "", "export const courseEnrichment: Partial<Record<CatalogueSlug, CourseEnrichment>> = {"]
    for slug, fields in enrichment.items():
        if not fields:
            continue
        lines.append(f"  {json.dumps(slug)}: {{")
        for key, value in fields.items():
            lines.append(f"    {key}: {ts_literal(value, 4)},")
        lines.append("  },")
        lines.append("")
    lines.append("};")
    ENRICHMENT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("xlsx_path", help="Path to the edited course-content workbook")
    parser.add_argument("--apply", action="store_true", help="Write validated changes into enrichment.ts (default: preview only)")
    args = parser.parse_args()

    xlsx_path = Path(args.xlsx_path)
    if not xlsx_path.exists():
        print(f"File not found: {xlsx_path}", file=sys.stderr)
        sys.exit(1)

    print("Regenerating live catalogue exports for an up-to-date comparison baseline...")
    live, enrichment_raw, known_slugs = load_live_state()

    wb = load_workbook(xlsx_path, data_only=False)
    if "Courses" not in wb.sheetnames:
        print("Workbook has no 'Courses' sheet.", file=sys.stderr)
        sys.exit(1)
    ws = wb["Courses"]
    header = [c.value for c in ws[1]]

    seen_slugs = Counter()
    seen_row_hashes = Counter()
    rows_report = []
    errors_total = 0
    flags_total = 0
    new_enrichment = json.loads(json.dumps(enrichment_raw))  # deep copy

    for row_cells in ws.iter_rows(min_row=2, values_only=True):
        row = dict(zip(header, row_cells))
        slug = (row.get("slug") or "").strip() if row.get("slug") else ""
        row_hash = tuple(str(v) for v in row_cells)

        row_issues, diffs = validate_and_diff_row(row, live, enrichment_raw, known_slugs)

        if slug:
            seen_slugs[slug] += 1
        seen_row_hashes[row_hash] += 1

        rows_report.append({"slug": slug or "(blank)", "issues": row_issues, "diffs": diffs})

        if slug and slug not in new_enrichment:
            new_enrichment[slug] = {}
        for d in diffs:
            if d["action"] != "KEEP" and slug:
                new_enrichment[slug][d["field"]] = d["proposed"]

        errors_total += sum(1 for i in row_issues if i.level == "error")
        flags_total += sum(1 for i in row_issues if i.level == "flag")

    for slug, count in seen_slugs.items():
        if count > 1:
            for r in rows_report:
                if r["slug"] == slug:
                    r["issues"].insert(0, RowIssue("error", "slug", f"Duplicate slug — appears {count} times in the sheet."))
            errors_total += 1

    for row_hash, count in seen_row_hashes.items():
        if count > 1 and any(row_hash):
            errors_total += count - 1
            for r in rows_report:
                pass  # duplicate-slug detection above already surfaces the practical case per-row

    preview_path = write_preview(rows_report, errors_total, flags_total)
    print(f"Wrote {preview_path}")
    print(f"Rows: {len(rows_report)}  Errors: {errors_total}  Flags (manual review): {flags_total}")

    if not args.apply:
        print("\nPreview only — nothing written. Re-run with --apply once you've reviewed the preview.")
        return

    if errors_total > 0:
        print(f"\n{errors_total} error(s) found — refusing to apply. Fix the sheet or drop the offending cells and re-run.", file=sys.stderr)
        sys.exit(1)

    print("\nApplying validated changes to enrichment.ts...")
    write_enrichment(new_enrichment)
    run(["pnpm", "dlx", "tsx", "scripts/generate-course-template.ts"])
    run(["python3", "scripts/generate-course-template.py"])
    print("Applied. enrichment.ts updated; CSV/JSON/XLSX/missing-field report regenerated.")
    print(f"{flags_total} flagged field(s) require manual review — see {preview_path}.")


if __name__ == "__main__":
    main()
