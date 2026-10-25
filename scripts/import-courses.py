#!/usr/bin/env python3
"""Regenerate the SRS course catalogue from the approved spreadsheet.

Usage (from the repo root):

    python3 scripts/import-courses.py
    python3 scripts/import-courses.py path/to/itdb_courses.xlsx

Requires openpyxl (`pip install openpyxl`). The spreadsheet's Source URL and
Notes columns are read only to be dropped: they are never written into the
site data. Syllabus cells are split into short topic lines. Long sentences
are shortened to a heading so third-party prose is not copied onto the site.

Writes:
    src/content/courses/courses.json
    src/content/courses/redirects.json
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = ROOT / "content-templates" / "itdb_courses.xlsx"
COURSES_OUT = ROOT / "src" / "content" / "courses" / "courses.json"
REDIRECTS_OUT = ROOT / "src" / "content" / "courses" / "redirects.json"

CATEGORY_LABELS = {
    "Computer Course": "Computer",
    "Vocational Course": "Vocational",
    "School Course": "School",
    "Typing Course": "Typing",
    "Project Course": "Project",
    "Stenography Course": "Stenography",
    "Professional Vocational Course": "Professional Vocational",
    "Professional Course": "Professional",
    "Internship Program": "Internship",
}

# Live /programs/[slug] names. None means the slug is an SRS program that is
# not in the spreadsheet; the redirect keeps that slug under /courses/.
OLD_PROGRAMS: list[tuple[str, str | None]] = [
    ("full-stack-web-development", None),
    ("artificial-intelligence", None),
    ("technology-programs", None),
    ("business-and-entrepreneurship", None),
    ("digital-skills", None),
    ("cake-bakery-course", "Cake Bakery Course"),
    ("basic-to-advance-nail-extension-course", "Basic to Advance Nail Extension Course"),
    ("basic-to-advance-mehendi-masters-course", "Basic to Advance Mehendi Master's Course"),
    ("summer-internship-programme", "Summer Internship Programme"),
    ("basic-internship-course", "Basic Internship Course"),
    ("advance-diploma-in-computer-application", "Advance Diploma in Computer Application"),
    ("advance-diploma-in-digital-marketing", "Advance Diploma In Digital Marketing"),
    ("it-sikhsha-with-ai", "IT Sikhsha with AI"),
    ("ai-with-digital-marketing-basic-siksha", "AI with Digital Marketing Basic Siksha"),
    ("digital-marketing-siksha", "Digital Marketing Siksha"),
    ("it-siksha", "IT Siksha"),
    ("digital-literacy-siksha", "Digital Literacy Siksha"),
    ("certificate-in-assamese-typing", "Certificate in Assamese Typing"),
    ("diploma-in-english-and-hindi-typing", "Diploma In English & Hindi Typing"),
    ("certificate-in-odia-typing", "Certificate in Odia Typing"),
    ("diploma-in-english-and-bengali-typing", "Diploma In English & Bengali Typing"),
    ("certificate-in-hindi-typing", "Certificate In Hindi Typing"),
    ("certificate-in-bengali-typing", "Certificate In Bengali Typing"),
    ("certificate-in-english-typing", "Certificate In English Typing"),
    ("diploma-in-english-typing", "Diploma In English Typing"),
    ("diploma-in-hindi-typing", "Diploma In Hindi Typing"),
    ("diploma-in-bengali-typing", "Diploma In Bengali Typing"),
]

LIGHT_COURSE_QUERIES = {
    "full-stack-web-development": "/courses/full-stack-web-development",
    "artificial-intelligence-fundamentals": "/courses?q=artificial+intelligence",
    "python-programming": "/courses?q=python",
    "java-programming": "/courses?q=java",
    "hardware-and-networking": "/courses?q=hardware+networking",
    "digital-marketing": "/courses?q=digital+marketing",
    "tally-and-gst": "/courses?q=tally",
    "graphic-design": "/courses?q=graphic+design",
    "autocad": "/courses?q=autocad",
    "makeup-artistry": "/courses?q=makeup",
    "bridal-makeup-artistry": "/courses?q=bridal+makeup",
    "beauty-therapy": "/courses?q=beautician",
    "nail-extension": "/courses?q=nail",
    "mehendi-design": "/courses?q=mehendi",
    "tailoring-and-fashion-design": "/courses?q=tailoring",
    "electrician-training": "/courses?q=electrician",
    "ac-repair-and-servicing": "/courses?q=ac+repair",
    "plumbing": "/courses?q=plumbing",
    "spoken-english": "/courses?q=spoken+english",
    "corporate-team-upskilling": "/technical-training",
}

RESOURCE_SLUGS = [
    "how-to-choose-the-right-course",
    "online-vs-offline-vs-hybrid-learning",
    "preparing-for-your-first-class",
    "understanding-course-duration-and-curriculum",
    "how-to-contact-srs-academy-for-admissions",
]


def slugify(name: str) -> str:
    text = name.lower().replace("&", " and ").replace("'", "").replace("’", "")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text


def normalize_name(name: str) -> str:
    text = name.lower().replace("&", " and ").replace("'", "").replace("’", "")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def pretty_duration(raw: object) -> str:
    if raw is None:
        return "To be confirmed"
    text = str(raw).strip()
    if text.lower() in {"", "none", "n/a", "na"}:
        return "To be confirmed"
    match = re.match(r"^(\d+)\s+(year|years|month|months|day|days|hour|hours)$", text, re.I)
    if not match:
        return text
    count = int(match.group(1))
    unit = match.group(2).lower().rstrip("s")
    if count != 1:
        unit += "s"
    return f"{count} {unit}"


def clean_topic(value: str) -> str:
    text = re.sub(r"https?://\S+", "", value, flags=re.I)
    text = re.sub(r"\b(itdb|www\.itdb\.in)\b", "", text, flags=re.I)
    text = re.sub(r"\s+", " ", text).strip(" .\t;-–—")
    return text


def split_outside_parens(text: str) -> list[str]:
    parts: list[str] = []
    buf: list[str] = []
    depth = 0
    for char in text:
        if char == "(":
            depth += 1
            buf.append(char)
        elif char == ")":
            depth = max(0, depth - 1)
            buf.append(char)
        elif char in ",;\n" and depth == 0:
            parts.append("".join(buf))
            buf = []
        else:
            buf.append(char)
    parts.append("".join(buf))
    return parts


def modules_from(raw: object) -> list[str]:
    if raw is None:
        return []
    topics: list[str] = []
    for line in str(raw).splitlines() or [str(raw)]:
        for part in split_outside_parens(line):
            piece = clean_topic(part)
            if not piece:
                continue
            pieces = [piece]
            if len(piece) > 160:
                pieces = [clean_topic(bit) for bit in re.split(r"\.\s+| — | – ", piece)]
                pieces = [bit for bit in pieces if bit]
            for bit in pieces:
                if len(bit) > 140:
                    bit = bit[:120].rsplit(" ", 1)[0].strip(" .,;-")
                if bit:
                    topics.append(bit)
    seen: set[str] = set()
    unique: list[str] = []
    for topic in topics:
        key = topic.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(topic)
    return unique


def redirect(source: str, destination: str) -> dict[str, object]:
    return {"source": source, "destination": destination, "permanent": True}


def main() -> None:
    try:
        import openpyxl
    except ImportError as error:
        raise SystemExit("openpyxl is required: pip install openpyxl") from error

    xlsx = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_XLSX
    if not xlsx.exists():
        raise SystemExit(f"Spreadsheet not found: {xlsx}")

    workbook = openpyxl.load_workbook(xlsx, data_only=True)
    sheet = workbook[workbook.sheetnames[0]]
    header = [cell.value for cell in next(sheet.iter_rows(min_row=1, max_row=1))]
    expected = ["S.No", "Category", "Course Name", "Course Code", "Duration", "Syllabus / Modules", "Source URL", "Notes"]
    if [str(cell).strip() if cell else "" for cell in header[:8]] != expected:
        raise SystemExit(f"Unexpected header row: {header}")

    rows: list[dict[str, object]] = []
    used_slugs: dict[str, int] = {}
    by_name: dict[str, list[dict[str, object]]] = {}

    for row in sheet.iter_rows(min_row=2, values_only=True):
        if not row or not row[2]:
            continue
        category_raw = str(row[1] or "").strip()
        category = CATEGORY_LABELS.get(category_raw)
        if not category:
            raise SystemExit(f"Unknown category {category_raw!r} on row {row[0]}")
        name = str(row[2]).strip()
        code = str(row[3] or "").strip()
        base = slugify(name)
        slug = base
        if slug in used_slugs:
            suffix = slugify(code) or f"row-{row[0]}"
            slug = f"{base}-{suffix}"
        if slug in used_slugs:
            slug = f"{slug}-{row[0]}"
        used_slugs[slug] = 1
        course = {
            "sno": int(row[0]),
            "slug": slug,
            "name": name,
            "category": category,
            "code": code,
            "duration": pretty_duration(row[4]),
            "modules": modules_from(row[5]),
        }
        rows.append(course)
        by_name.setdefault(normalize_name(name), []).append(course)

    if len(rows) != 418:
        raise SystemExit(f"Expected 418 courses, found {len(rows)}")

    redirects = [
        redirect("/programs", "/courses"),
        redirect("/light", "/"),
        redirect("/light/about", "/about"),
        redirect("/light/accessibility", "/accessibility"),
        redirect("/light/admissions", "/admissions"),
        redirect("/light/contact", "/contact"),
        redirect("/light/corporate-learning", "/technical-training"),
        redirect("/light/courses", "/courses"),
        redirect("/light/creative-vocational", "/courses?category=Vocational"),
        redirect("/light/faq", "/faq"),
        redirect("/light/gallery", "/about"),
        redirect("/light/jobs", "/contact"),
        redirect("/light/privacy", "/privacy"),
        redirect("/light/refund-policy", "/refund-policy"),
        redirect("/light/resources", "/resources"),
        redirect("/light/terms", "/terms"),
        redirect("/light/updates", "/updates"),
    ]
    for slug in RESOURCE_SLUGS:
        redirects.append(redirect(f"/light/resources/{slug}", f"/resources/{slug}"))

    for old_slug, old_name in OLD_PROGRAMS:
        if old_name is None:
            destination = f"/courses/{old_slug}"
        else:
            matches = by_name.get(normalize_name(old_name), [])
            if len(matches) == 1:
                destination = f"/courses/{matches[0]['slug']}"
            else:
                query = re.sub(r"\s+", "+", old_name.strip())
                destination = f"/courses?q={query}"
        redirects.append(redirect(f"/programs/{old_slug}", destination))

    for slug, destination in LIGHT_COURSE_QUERIES.items():
        redirects.append(redirect(f"/light/courses/{slug}", destination))

    COURSES_OUT.parent.mkdir(parents=True, exist_ok=True)
    COURSES_OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    REDIRECTS_OUT.write_text(json.dumps(redirects, indent=2) + "\n", encoding="utf-8")

    counts = Counter(str(course["category"]) for course in rows)
    collisions = sum(1 for count in Counter(normalize_name(str(c["name"])) for c in rows).values() if count > 1)
    print(f"Wrote {len(rows)} courses ({collisions} duplicate-name rows) and {len(redirects)} redirects")
    for label, count in counts.most_common():
        print(f"  {count:3}  {label}")


if __name__ == "__main__":
    main()
