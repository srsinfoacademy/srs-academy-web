/**
 * Spreadsheet clean-up rules, ported from scripts/import-courses.py so an
 * admin Excel import produces the same values as the build-time import.
 * Client-safe (used by the import dialog; the server re-applies the
 * category and code rules).
 */

export function prettyDuration(raw: string): string {
  const text = raw.trim();
  if (["", "none", "n/a", "na"].includes(text.toLowerCase())) return "";
  const match = text.match(/^(\d+)\s+(year|years|month|months|day|days|hour|hours)$/i);
  if (!match) return text;
  const count = Number(match[1]);
  let unit = match[2].toLowerCase().replace(/s$/, "");
  if (count !== 1) unit += "s";
  return `${count} ${unit}`;
}

function cleanTopic(value: string): string {
  return value
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(itdb|www\.itdb\.in)\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/^[ .\t;\-–—]+|[ .\t;\-–—]+$/g, "");
}

function splitOutsideParens(text: string): string[] {
  const parts: string[] = [];
  let buf = "";
  let depth = 0;
  for (const char of text) {
    if (char === "(") {
      depth += 1;
      buf += char;
    } else if (char === ")") {
      depth = Math.max(0, depth - 1);
      buf += char;
    } else if (",;\n".includes(char) && depth === 0) {
      parts.push(buf);
      buf = "";
    } else {
      buf += char;
    }
  }
  parts.push(buf);
  return parts;
}

/** Short topic lines from a "Syllabus / Modules" cell. */
export function modulesFrom(raw: string): string[] {
  const topics: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    for (const part of splitOutsideParens(line)) {
      const piece = cleanTopic(part);
      if (!piece) continue;
      let pieces = [piece];
      if (piece.length > 160) pieces = piece.split(/\.\s+| — | – /).map(cleanTopic).filter(Boolean);
      for (let bit of pieces) {
        if (bit.length > 140) {
          const cut = bit.slice(0, 120);
          bit = (cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut).replace(/[ .,;-]+$/, "");
        }
        if (bit) topics.push(bit);
      }
    }
  }
  const seen = new Set<string>();
  return topics.filter((topic) => {
    const key = topic.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Codes compare without case or spaces ("PGDCA TRINING262" = "pgdcatrining262"). */
export function codeKey(code: string): string {
  return code.toLowerCase().replace(/\s+/g, "");
}

/**
 * Maps a spreadsheet label to an existing category: exact match, then
 * case-insensitive, then without a trailing "Course(s)" / "Program(s)"
 * ("Computer Course" → "Computer"). Unknown labels are returned trimmed.
 */
export function matchCategory(raw: string, known: readonly string[]): string {
  const label = raw.trim().replace(/\s+/g, " ");
  if (!label) return "";
  if (known.includes(label)) return label;
  const lower = label.toLowerCase();
  const exact = known.find((name) => name.toLowerCase() === lower);
  if (exact) return exact;
  const base = lower.replace(/\s+(courses?|programs?|programmes?)$/, "");
  return known.find((name) => name.toLowerCase() === base) ?? label;
}
