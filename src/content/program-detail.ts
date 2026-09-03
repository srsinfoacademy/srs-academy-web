import { programs } from "@/content/programs";
import type { CurriculumModule, ProgramDetail } from "@/types/program";

/**
 * Program detail content.
 *
 * Every program's detail is placeholder text today, so the shape is produced
 * by one builder rather than copied five times. When real copy arrives, a
 * program overrides only the fields it has — nothing here asserts a fee, an
 * eligibility rule, a certificate, an accreditation or an outcome.
 */

function placeholderModules(count: number): CurriculumModule[] {
  return Array.from({ length: count }, (_, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: `[MODULE ${i + 1} TITLE]`,
    body: "[MODULE DESCRIPTION — approved curriculum copy pending.]",
    topics: ["[TOPIC]", "[TOPIC]", "[TOPIC]"],
  }));
}

function makeDetail(overrides: Partial<ProgramDetail> = {}): ProgramDetail {
  return {
    overview: "[PROGRAM OVERVIEW — 2 SENTENCES.]",
    about: "[ABOUT THIS PROGRAM — approved copy pending.]",
    audience: [
      "[AUDIENCE — who this program is designed for.]",
      "[AUDIENCE — prior experience assumed, if any.]",
      "[AUDIENCE — who this program is not intended for.]",
    ],
    learningOutcomes: [
      "[LEARNING OUTCOME]",
      "[LEARNING OUTCOME]",
      "[LEARNING OUTCOME]",
      "[LEARNING OUTCOME]",
    ],
    modules: placeholderModules(6),
    projectExperience: "[PROJECT EXPERIENCE — how applied work is structured and reviewed.]",
    eligibility: [
      "[ELIGIBILITY REQUIREMENT]",
      "[ELIGIBILITY REQUIREMENT]",
      "[ELIGIBILITY REQUIREMENT]",
    ],
    certification: {
      name: "[CERTIFICATE NAME]",
      issuedBy: "[ISSUED BY]",
      verification: "[VERIFICATION INFORMATION]",
    },
    // Null until SRS Academy publishes fees. The page shows an honest
    // fallback rather than a number nobody has approved.
    fees: null,
    admissionsSteps: [
      { num: "01", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "02", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "03", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "04", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
      { num: "05", title: "[STEP]", body: "[ADMISSION STEP DESCRIPTION]" },
    ],
    importantDates: undefined,
    downloads: undefined,
    faq: [
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
      { q: "[PROGRAM QUESTION]", a: "[ANSWER — approved copy pending.]" },
    ],
    relatedPrograms: [],
    startDate: undefined,
    primaryCta: "[PRIMARY PROGRAM CTA]",
    ...overrides,
  };
}

/** Related programs: the other programs, nearest first by index. */
function relatedFor(slug: string): string[] {
  const index = programs.findIndex((p) => p.slug === slug);
  return programs
    .filter((_, i) => i !== index)
    .slice(0, 3)
    .map((p) => p.slug);
}

const genericDetails: Record<string, ProgramDetail> = Object.fromEntries(
  programs.map((program) => [
    program.slug,
    makeDetail({ relatedPrograms: relatedFor(program.slug) }),
  ]),
);

const projectExperienceText =
  "Planning, designing, developing, testing, and deploying a complete web application based on the skills covered throughout the program.";

/**
 * Full Stack Web Development.
 *
 * Confirmed launch content, supplied by SRS Academy. Fields not covered by
 * that pass — admission steps, important dates, downloads, the certificate
 * verification method, and the CTA/fee destinations — keep the shared
 * placeholder defaults from makeDetail() rather than inventing them.
 */
const fullStackWebDevelopment: ProgramDetail = makeDetail({
  relatedPrograms: relatedFor("full-stack-web-development"),
  overview:
    "A practical, project-based program covering web fundamentals, JavaScript, modern frontend and backend development, databases, and deployment — building toward a complete real-world web application.",
  about:
    "Full Stack Web Development is a practical learning program designed to introduce students to the technologies and concepts used to build modern websites and web applications. Learners progress from web fundamentals and interface development to application logic, APIs, databases, deployment, and project-oriented development. The program emphasizes understanding how different parts of a web application work together rather than learning isolated tools. Students will progressively build practical skills that can be applied to personal projects, further study, internships, freelance work, or entry-level development pathways.",
  audience: [
    "Students, beginners, career starters, and learners interested in web and software development.",
    "No previous professional development experience is required — basic computer literacy and a willingness to practice regularly are recommended.",
    "Best suited to learners starting from foundational to intermediate web development knowledge.",
  ],
  learningOutcomes: [
    "Understand the structure and working principles of modern web applications.",
    "Create responsive interfaces using HTML, CSS, and JavaScript.",
    "Work with modern frontend development concepts and frameworks.",
    "Understand server-side application development and APIs.",
    "Work with databases and application data.",
    "Use Git and common development workflows.",
    "Deploy web projects to modern hosting platforms.",
    "Plan and develop a complete practical web application project.",
  ],
  modules: [
    {
      num: "01",
      title: "Web Foundations",
      body: "How the web works, browsers and servers, domains, HTML, semantic markup, CSS fundamentals, and responsive design.",
      topics: [
        "How the web works",
        "Browsers and servers",
        "Domains",
        "HTML",
        "Semantic markup",
        "CSS fundamentals",
        "Responsive design",
      ],
    },
    {
      num: "02",
      title: "JavaScript & Programming Fundamentals",
      body: "Variables, functions, conditions, loops, arrays, objects, DOM interaction, events, asynchronous concepts, and problem solving.",
      topics: [
        "Variables",
        "Functions",
        "Conditions",
        "Loops",
        "Arrays",
        "Objects",
        "DOM interaction",
        "Events",
        "Asynchronous concepts",
        "Problem solving",
      ],
    },
    {
      num: "03",
      title: "Modern Frontend Development",
      body: "Component-based interfaces, React fundamentals, application structure, state, forms, routing, and responsive UI development.",
      topics: [
        "Component-based interfaces",
        "React fundamentals",
        "Application structure",
        "State",
        "Forms",
        "Routing",
        "Responsive UI development",
      ],
    },
    {
      num: "04",
      title: "Backend & APIs",
      body: "Server-side concepts, Node.js fundamentals, API architecture, requests and responses, validation, and basic authentication concepts.",
      topics: [
        "Server-side concepts",
        "Node.js fundamentals",
        "API architecture",
        "Requests and responses",
        "Validation",
        "Basic authentication concepts",
      ],
    },
    {
      num: "05",
      title: "Databases & Application Data",
      body: "Database fundamentals, structured data, CRUD operations, data relationships, and application integration.",
      topics: [
        "Database fundamentals",
        "Structured data",
        "CRUD operations",
        "Data relationships",
        "Application integration",
      ],
    },
    {
      num: "06",
      title: "Development Workflow & Deployment",
      body: "Git, GitHub, environment configuration, debugging, production builds, deployment, performance fundamentals, and basic web security practices.",
      topics: [
        "Git",
        "GitHub",
        "Environment configuration",
        "Debugging",
        "Production builds",
        "Deployment",
        "Performance fundamentals",
        "Basic web security practices",
      ],
    },
    {
      num: "07",
      title: "Practical Project",
      body: projectExperienceText,
    },
  ],
  projectExperience: projectExperienceText,
  eligibility: [
    "The program is suitable for students, beginners, career starters, and learners interested in web and software development. Previous professional development experience is not required.",
    "Learners should have basic computer literacy, access to a computer suitable for development work, a stable internet connection, and a willingness to practice regularly.",
    "Any formal academic eligibility requirements may be introduced separately where applicable.",
  ],
  certification: {
    name: "SRS Academy Certificate of Completion",
    issuedBy: "SRS Academy, the training initiative of SPRS INFOTECH PVT LTD",
    verification: "[VERIFICATION INFORMATION]",
  },
  faq: [
    {
      q: "Do I need previous programming experience to join Full Stack Web Development?",
      a: "No professional development experience is required for the beginner-to-intermediate Full Stack Web Development program. Basic computer literacy and a willingness to practice regularly are recommended.",
    },
    {
      q: "Will I receive a certificate?",
      a: "Learners who successfully complete the required activities and completion criteria may receive an SRS Academy Certificate of Completion.",
    },
    {
      q: "How can I know the course fee?",
      a: "The fee for this program has not been announced yet. Contact SRS Academy for current fee and enrollment information.",
    },
  ],
});

export const programDetails: Record<string, ProgramDetail> = {
  ...genericDetails,
  "full-stack-web-development": fullStackWebDevelopment,
};

export function detailFor(slug: string): ProgramDetail | undefined {
  return programDetails[slug];
}

/** In-page navigation. Only sections that always exist appear here. */
export const detailSections = [
  { id: "overview", label: "Overview" },
  { id: "learning", label: "Learning" },
  { id: "curriculum", label: "Curriculum" },
  { id: "eligibility", label: "Eligibility" },
  { id: "certification", label: "Certification" },
  { id: "fees", label: "Fees" },
  { id: "admissions", label: "Admissions" },
  { id: "faq", label: "FAQ" },
] as const;
