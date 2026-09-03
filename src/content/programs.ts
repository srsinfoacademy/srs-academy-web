import type { Program, ProgramCategory } from "@/types/program";

/**
 * The single program data source.
 *
 * One source feeds the homepage explorer, this catalogue and the footer, as
 * the design requires — so a program can never appear with different details
 * in two places.
 *
 * Every name is a placeholder and every unresolved value is bracketed. No
 * fee, duration, eligibility rule, accreditation or outcome is asserted.
 */
export const categories: ProgramCategory[] = [
  {
    slug: "web-software-development",
    num: "01",
    name: "Web & Software Development",
    label: "Engineering",
    visualType: "grid",
    artLabel: "MODULAR GRID ARCHITECTURE",
  },
  {
    slug: "artificial-intelligence",
    num: "02",
    name: "Artificial Intelligence",
    label: "Applied AI",
    visualType: "nodes",
    artLabel: "NODES & RELATIONSHIPS",
  },
  {
    slug: "technology-programs",
    num: "03",
    name: "Technology Programs",
    label: "Systems",
    visualType: "signals",
    artLabel: "SYSTEMS & SIGNALS",
  },
  {
    slug: "business-entrepreneurship",
    num: "04",
    name: "Business & Entrepreneurship",
    label: "Venture",
    visualType: "direction",
    artLabel: "DIRECTIONAL STRUCTURE",
  },
  {
    slug: "digital-skills",
    num: "05",
    name: "Digital Skills",
    label: "Foundation",
    visualType: "modular",
    artLabel: "MODULAR SIGNALS",
  },
];

const pending = {
  level: "[LEVEL]",
  mode: "[MODE]",
  duration: "[DURATION]",
  eligibility: "[ELIGIBILITY]",
} as const;

export const programs: Program[] = [
  {
    num: "01",
    slug: "full-stack-web-development",
    name: "Full Stack Web Development",
    category: "web-software-development",
    shortDescription:
      "A practical, project-based path from web fundamentals to full-stack development — frontend, backend, databases and deployment.",
    level: "Beginner to Intermediate",
    mode: "Online",
    // Approximate — the schedule has not been finalised, so this is not
    // presented as a guaranteed timeline.
    duration: "Approximately 4–6 months",
    eligibility: "[ELIGIBILITY]",
    status: "pending",
    visualType: "grid",
    artLabel: "MODULAR GRID ARCHITECTURE",
    pathway: ["LEARN", "BUILD", "PROVE"],
  },
  {
    num: "02",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "artificial-intelligence",
    shortDescription:
      "[PROGRAM DESCRIPTION — applied machine learning and AI tooling in real products.]",
    ...pending,
    status: "pending",
    visualType: "nodes",
    artLabel: "NODES & RELATIONSHIPS",
    pathway: ["LEARN", "BUILD", "CREATE"],
  },
  {
    num: "03",
    slug: "technology-programs",
    name: "Technology Programs",
    category: "technology-programs",
    shortDescription: "[PROGRAM DESCRIPTION — systems, data and cloud fundamentals.]",
    ...pending,
    status: "pending",
    visualType: "signals",
    artLabel: "SYSTEMS & SIGNALS",
    pathway: ["LEARN", "PROVE"],
  },
  {
    num: "04",
    slug: "business-and-entrepreneurship",
    name: "Business & Entrepreneurship",
    category: "business-entrepreneurship",
    shortDescription:
      "[PROGRAM DESCRIPTION — turning technical capability into an operating business.]",
    ...pending,
    status: "pending",
    visualType: "direction",
    artLabel: "DIRECTIONAL STRUCTURE",
    pathway: ["LEARN", "CREATE", "ADVANCE"],
  },
  {
    num: "05",
    slug: "digital-skills",
    name: "Digital Skills",
    category: "digital-skills",
    shortDescription:
      "[PROGRAM DESCRIPTION — short foundational tracks with a route into longer programs.]",
    ...pending,
    status: "pending",
    visualType: "modular",
    artLabel: "MODULAR SIGNALS",
    pathway: ["DISCOVER", "LEARN"],
  },
];

/**
 * Filter facets. Values stay bracketed until real data lands, so the controls
 * are exercisable without implying a taxonomy nobody has approved.
 */
export const levelOptions = ["[LEVEL]"];
export const modeOptions = ["[MODE]"];

export function categoryOf(program: Program): ProgramCategory {
  return categories.find((c) => c.slug === program.category) ?? categories[0];
}

/** Status label — text, never colour alone. */
export const statusLabel: Record<Program["status"], string> = {
  open: "Applications open",
  upcoming: "Upcoming intake",
  pending: "[ADMISSION STATUS]",
};

/** Metadata rows, in the order the preview and accordion present them. */
export function programMetaRows(program: Program) {
  return [
    { label: "Duration", value: program.duration },
    { label: "Mode", value: program.mode },
    { label: "Level", value: program.level },
  ];
}
