import type {
  KnowledgeNode,
  Program,
  StageId,
  Statistic,
  SystemStage,
} from "@/types/home";

/**
 * Homepage content.
 *
 * Node terminology is final and shared between the hero and the learning
 * journey, so the page opens and closes on one system. Anything in SQUARE
 * BRACKETS is an unresolved business fact awaiting approved copy.
 */

export const heroCopy = {
  index: "01",
  eyebrow: "Introduction",
  organisation: "SRS Academy",
  headline: "Education engineered for what comes next.",
  lead: "A technology-first academy where every program, project and outcome is one connected system.",
  positioning: "[POSITIONING COPY — 2 LINES MAX]",
  primaryCta: "Explore Programs",
  secondaryCta: "Discover SRS",
  scrollNote: "05 sections · one H1 on the page",
} as const;

/** Hero network: five nodes, eight edges. Positions are percentages. */
export const knowledgeNodes: KnowledgeNode[] = [
  {
    id: "discover",
    short: "DISCOVER",
    blurb: "Entry node — find the path that fits before committing to a program.",
    links: ["→ LEARN", "→ 5 programs"],
    x: 18,
    y: 22,
  },
  {
    id: "learn",
    short: "LEARN",
    blurb: "Foundations delivered in cohort by practitioners, revised each intake.",
    links: ["→ BUILD", "→ modules"],
    x: 56,
    y: 15,
  },
  {
    id: "build",
    short: "BUILD",
    blurb: "Application node. Nothing completes here without a working artefact.",
    links: ["→ PROVE", "→ projects"],
    x: 78,
    y: 48,
  },
  {
    id: "prove",
    short: "PROVE",
    blurb: "Assessment and certification — capability made verifiable.",
    links: ["→ ADVANCE", "→ credential"],
    x: 46,
    y: 66,
  },
  {
    id: "advance",
    short: "ADVANCE",
    blurb: "Outcome node. Career step, venture, or the next program in the system.",
    links: ["→ pathway", "→ alumni"],
    x: 14,
    y: 84,
  },
];

export type KnowledgeEdge = [from: StageId, to: StageId];

/**
 * Eight edges. The sequence runs the spine of the journey and closes back on
 * itself, which is what makes the graphic read as a system rather than a path.
 */
export const knowledgeEdges: KnowledgeEdge[] = [
  ["discover", "learn"],
  ["learn", "build"],
  ["build", "prove"],
  ["prove", "advance"],
  ["discover", "prove"],
  ["learn", "prove"],
  ["build", "advance"],
  ["discover", "advance"],
];

export const manifesto = {
  index: "02",
  eyebrow: "Philosophy",
  /** Revealed in two steps; the closing clause inks to lime. */
  leadSentence: "Education shouldn't prepare students for yesterday.",
  resolve: "We develop skills for",
  emphasis: "what comes next.",
} as const;

/** The three centre nodes of the five-stage journey, lifted out and enlarged. */
export const systemStages: SystemStage[] = [
  {
    id: "learn",
    num: "02",
    name: "LEARN",
    title: "Foundations, taught by practitioners",
    body: "[STAGE DESCRIPTION — how foundational teaching is delivered and revised each intake.]",
    short: "[LEARN SUMMARY]",
    tags: ["COHORT", "MODULES"],
    relation: "Feeds BUILD",
  },
  {
    id: "build",
    num: "03",
    name: "BUILD",
    title: "Nothing completes without a working artefact",
    body: "[STAGE DESCRIPTION — how applied project work is structured and reviewed.]",
    short: "[BUILD SUMMARY]",
    tags: ["PROJECTS", "REVIEW"],
    relation: "Feeds PROVE",
  },
  {
    id: "advance",
    num: "05",
    name: "ADVANCE",
    title: "The outcome node",
    body: "[STAGE DESCRIPTION — where a completed program leads.]",
    short: "[ADVANCE SUMMARY]",
    tags: ["PATHWAY", "ALUMNI"],
    relation: "Closes the system",
  },
];

/**
 * Program placeholders. One data source feeds this list, the catalogue page
 * and the footer. No fees, duration, accreditation or outcome is asserted.
 */
const programMeta = [
  { label: "Duration", value: "[DURATION]" },
  { label: "Mode", value: "[MODE]" },
  { label: "Intake", value: "[INTAKE]" },
];

export const programs: Program[] = [
  {
    num: "01",
    slug: "web-and-software-development",
    name: "Web & Software Development",
    category: "ENGINEERING",
    level: "[LEVEL]",
    visualType: "grid",
    artLabel: "MODULAR GRID ARCHITECTURE",
    shortDescription:
      "[PROGRAM DESCRIPTION — front-end through deployment as one continuous build.]",
    pathway: ["LEARN", "BUILD", "PROVE"],
    meta: programMeta,
  },
  {
    num: "02",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "APPLIED AI",
    level: "[LEVEL]",
    visualType: "nodes",
    artLabel: "NODES & RELATIONSHIPS",
    shortDescription:
      "[PROGRAM DESCRIPTION — applied machine learning and AI tooling in real products.]",
    pathway: ["LEARN", "BUILD", "CREATE"],
    meta: programMeta,
  },
  {
    num: "03",
    slug: "technology-programs",
    name: "Technology Programs",
    category: "SYSTEMS",
    level: "[LEVEL]",
    visualType: "signals",
    artLabel: "SYSTEMS & SIGNALS",
    shortDescription: "[PROGRAM DESCRIPTION — systems, data and cloud fundamentals.]",
    pathway: ["LEARN", "PROVE"],
    meta: programMeta,
  },
  {
    num: "04",
    slug: "business-and-entrepreneurship",
    name: "Business & Entrepreneurship",
    category: "VENTURE",
    level: "[LEVEL]",
    visualType: "direction",
    artLabel: "DIRECTIONAL STRUCTURE",
    shortDescription:
      "[PROGRAM DESCRIPTION — turning technical capability into an operating business.]",
    pathway: ["LEARN", "CREATE", "ADVANCE"],
    meta: programMeta,
  },
  {
    num: "05",
    slug: "digital-skills",
    name: "Digital Skills",
    category: "FOUNDATION",
    level: "[LEVEL]",
    visualType: "modular",
    artLabel: "MODULAR SIGNALS",
    shortDescription:
      "[PROGRAM DESCRIPTION — short foundational tracks with a route into longer programs.]",
    pathway: ["DISCOVER", "LEARN"],
    meta: programMeta,
  },
];

export const journeyStages = [
  {
    id: "discover" as const,
    num: "01",
    title: "Discover",
    body: "[JOURNEY STAGE — how a prospective student finds the right path.]",
    meta: "[ENTRY]",
  },
  {
    id: "learn" as const,
    num: "02",
    title: "Learn",
    body: "[JOURNEY STAGE — how foundations are taught.]",
    meta: "[COHORT]",
  },
  {
    id: "build" as const,
    num: "03",
    title: "Build",
    body: "[JOURNEY STAGE — how applied work is produced.]",
    meta: "[PROJECT]",
  },
  {
    id: "prove" as const,
    num: "04",
    title: "Prove",
    body: "[JOURNEY STAGE — how capability is assessed.]",
    meta: "[ASSESSMENT]",
  },
  {
    id: "advance" as const,
    num: "05",
    title: "Advance",
    body: "[JOURNEY STAGE — where the program leads.]",
    meta: "[OUTCOME]",
  },
];

/**
 * Placeholder glyphs only. Count-up is disabled until real figures exist —
 * animating a placeholder would present invented data as measured.
 */
export const statistics: Statistic[] = [
  { value: "XX+", label: "Programs" },
  { value: "XXXX", label: "Learners" },
  { value: "XX", label: "Projects" },
  { value: "XX", label: "Certificates" },
];

export const portalTeaser = {
  index: "06",
  eyebrow: "Portal",
  headline: ["Your learning.", "One space."],
  lead: "Courses, progress, certificates, resources and announcements in a single environment.",
  copyPending: "[PORTAL COPY TBC]",
  chips: ["COURSES", "PROGRESS", "CERTIFICATES", "RESOURCES", "ANNOUNCEMENTS"],
  cta: "Enter Student Portal",
} as const;

export const finalCta = {
  index: "07",
  eyebrow: "Next",
  headline: ["What will", "you build", "next?"],
  cta: "Explore SRS Academy",
} as const;
