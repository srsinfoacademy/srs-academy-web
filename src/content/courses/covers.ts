/**
 * Generated course covers: one colour + line icon per category (and per SRS
 * program), with a pattern that varies deterministically by slug so
 * neighbouring cards do not look identical. Pure data, safe to import from
 * client components. Rendered by `RdCourseCover`.
 */

export type CoverIcon =
  | "monitor"
  | "gear"
  | "keyboard"
  | "folder-code"
  | "briefcase"
  | "id-card"
  | "badge"
  | "book"
  | "pen"
  | "code"
  | "chip"
  | "layers"
  | "chart"
  | "globe";

export type CoverVariant = {
  /** Base colour; the CSS derives light and dark tints from it. */
  color: string;
  icon: CoverIcon;
  /** Short label shown on the cover (the full name is already on the card). */
  label: string;
  /** SRS programs use the navy brand cover in both themes. */
  brand?: boolean;
};

const categoryVariants: Record<string, CoverVariant> = {
  computer: { color: "#2080E0", icon: "monitor", label: "Computer" },
  vocational: { color: "#0F8F7E", icon: "gear", label: "Vocational" },
  typing: { color: "#5B5BD6", icon: "keyboard", label: "Typing" },
  project: { color: "#C47A12", icon: "folder-code", label: "Project" },
  "professional vocational": { color: "#B4561A", icon: "briefcase", label: "Prof. Vocational" },
  professional: { color: "#3657A8", icon: "id-card", label: "Professional" },
  internship: { color: "#2E8B57", icon: "badge", label: "Internship" },
  school: { color: "#B8860B", icon: "book", label: "School" },
  stenography: { color: "#B0417A", icon: "pen", label: "Stenography" },
};

const srsVariants: Record<string, CoverVariant> = {
  "full-stack-web-development": { color: "#2080E0", icon: "code", label: "SRS Program", brand: true },
  "artificial-intelligence": { color: "#8B6CF0", icon: "chip", label: "SRS Program", brand: true },
  "technology-programs": { color: "#19A7A7", icon: "layers", label: "SRS Program", brand: true },
  "business-and-entrepreneurship": { color: "#E0902A", icon: "chart", label: "SRS Program", brand: true },
  "digital-skills": { color: "#3FB27F", icon: "globe", label: "SRS Program", brand: true },
};

/** For categories created later in the admin: a palette colour picked from the name. */
const fallbackColors = ["#2080E0", "#0F8F7E", "#5B5BD6", "#C47A12", "#2E8B57", "#B0417A", "#3657A8"];

/** FNV-1a, 32-bit. Stable across server and client. */
export function coverHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function coverVariant(course: { slug: string; category: string; origin: "catalogue" | "srs" }): CoverVariant {
  if (course.origin === "srs") {
    return srsVariants[course.slug] ?? { color: "#2080E0", icon: "layers", label: "SRS Program", brand: true };
  }
  const known = categoryVariants[course.category.trim().toLowerCase()];
  if (known) return known;
  const label = course.category.length > 18 ? `${course.category.slice(0, 17).trimEnd()}…` : course.category;
  return { color: fallbackColors[coverHash(course.category) % fallbackColors.length], icon: "book", label: label || "Course" };
}

export type CoverPattern = "dots" | "lines" | "grid";

/** Per-course variation: gradient angle, pattern, where the pattern fades in, ring sizes. */
export function coverLayout(slug: string) {
  const h = coverHash(slug);
  const patterns: CoverPattern[] = ["dots", "lines", "grid"];
  const corners = [
    ["0%", "0%"],
    ["100%", "0%"],
    ["0%", "100%"],
    ["100%", "100%"],
  ] as const;
  const [mx, my] = corners[(h >>> 5) % 4];
  return {
    angle: 115 + (h % 50),
    pattern: patterns[(h >>> 3) % 3],
    patternAngle: [45, -45, 30, 60][(h >>> 7) % 4],
    patternOffset: `${(h >>> 9) % 16}px ${(h >>> 13) % 16}px`,
    maskX: mx,
    maskY: my,
    ringA: 42 + ((h >>> 17) % 14),
    ringB: 70 + ((h >>> 21) % 22),
    /** A large faint circle in one of the corners. */
    blobX: [20, 300, 40, 290][(h >>> 25) % 4],
    blobY: [10, 170, 165, 15][(h >>> 27) % 4],
    blobR: 54 + ((h >>> 29) % 4) * 10,
  };
}
