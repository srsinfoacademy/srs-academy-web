import type { Course } from "@/content/courses/types";

/**
 * SRS programs that are not rows in the spreadsheet. Full Stack curriculum
 * is the academy's own outline from the approved redesign. The other four
 * programs do not have a confirmed module list yet — do not invent one.
 */
export const featuredPrograms: Course[] = [
  {
    sno: 0,
    slug: "full-stack-web-development",
    name: "Full Stack Web Development",
    category: "Technical Training",
    code: "SRS-FSWD",
    duration: "Approx. 4–6 months",
    level: "Beginner to Intermediate",
    origin: "srs",
    summary:
      "A practical, project-based path from web fundamentals to full-stack development — frontend, backend, databases and deployment — building toward a complete real-world web application.",
    modules: [
      "Web foundations",
      "JavaScript and programming fundamentals",
      "Modern frontend development",
      "Backend and APIs",
      "Databases and application data",
      "Development workflow and deployment",
      "Practical project",
    ],
    outcomes: [
      "Understand how modern web applications are structured",
      "Create responsive interfaces with HTML, CSS and JavaScript",
      "Work with modern frontend concepts",
      "Understand server-side development and APIs",
      "Work with databases and application data",
      "Use Git and a common development workflow",
      "Deploy a web project",
      "Plan and build a complete practical web application",
    ],
    curriculum: [
      {
        title: "Web Foundations",
        summary:
          "How the web works, HTML, semantic markup, CSS fundamentals and responsive layout.",
        topics: ["How the web works", "HTML", "Semantic markup", "CSS", "Responsive design"],
      },
      {
        title: "JavaScript & Programming Fundamentals",
        summary: "The programming basics used to make a page respond to people.",
        topics: ["Variables", "Functions", "Conditions and loops", "Arrays and objects", "DOM and events"],
      },
      {
        title: "Modern Frontend Development",
        summary: "Component-based interfaces, state, forms and routing.",
        topics: ["Components", "React", "State", "Forms", "Routing"],
      },
      {
        title: "Backend & APIs",
        summary: "Server-side concepts, Node.js fundamentals and how a client talks to an API.",
        topics: ["Node.js", "API architecture", "Requests and responses", "Validation"],
      },
      {
        title: "Databases & Application Data",
        summary: "How an application stores and reads structured data.",
        topics: ["Database fundamentals", "CRUD", "Relationships"],
      },
      {
        title: "Development Workflow & Deployment",
        summary: "Version control, builds and putting a project online.",
        topics: ["Git and GitHub", "Debugging", "Builds", "Deployment"],
      },
      {
        title: "Practical Project",
        summary: "Plan, build, test and deploy one complete web application.",
        topics: ["Planning", "Design", "Development", "Testing", "Deployment"],
      },
    ],
  },
  {
    sno: 0,
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "Technical Training",
    code: "SRS-AI",
    duration: "To be confirmed",
    level: "To be confirmed",
    origin: "srs",
    summary: "Explore practical learning in AI tools, digital workflows and emerging technology.",
    modules: [],
  },
  {
    sno: 0,
    slug: "technology-programs",
    name: "Technology Programs",
    category: "Technical Training",
    code: "SRS-TECH",
    duration: "To be confirmed",
    level: "To be confirmed",
    origin: "srs",
    summary: "Build practical knowledge across modern technology and digital systems.",
    modules: [],
  },
  {
    sno: 0,
    slug: "business-and-entrepreneurship",
    name: "Business & Entrepreneurship",
    category: "Technical Training",
    code: "SRS-BIZ",
    duration: "To be confirmed",
    level: "To be confirmed",
    origin: "srs",
    summary: "Learn practical business, digital and entrepreneurship-focused skills.",
    modules: [],
  },
  {
    sno: 0,
    slug: "digital-skills",
    name: "Digital Skills",
    category: "Technical Training",
    code: "SRS-DIGITAL",
    duration: "To be confirmed",
    level: "To be confirmed",
    origin: "srs",
    summary: "Develop useful digital skills for study, work, business and everyday technology use.",
    modules: [],
  },
];

/** Course codes for the six photo cards on the homepage. */
export const homeFeaturedCodes = ["DLS001", "AIDMS004", "CDEAE053", "CCSE505", "BMC478", "CMM478"] as const;

/** Technical Training page: web, AI and technology. Business and digital skills stay on the catalogue. */
export const technicalProgramSlugs = [
  "full-stack-web-development",
  "artificial-intelligence",
  "technology-programs",
] as const;
