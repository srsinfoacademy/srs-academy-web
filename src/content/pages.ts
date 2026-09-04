/**
 * Editorial content for the remaining public pages, taken from the approved
 * Final Design Set. Every bracketed value is an unresolved business fact.
 *
 * The design notes are binding where they concern content: notices and
 * resources ship empty until real ones exist, and nothing here asserts a
 * history, a relationship, a policy or a contact detail.
 */

export type PageSection = {
  num: string;
  heading: string;
  body: string;
  list?: string[];
};

export type EditorialPage = {
  kicker: string;
  title: string;
  intro: string;
  ctaLabel?: string;
  sections: PageSection[];
};

export const aboutPage: EditorialPage = {
  kicker: "About SRS Academy",
  title: "About SRS Academy",
  intro:
    "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD, bringing practical technology experience into structured, skill-focused learning programs.",
  ctaLabel: "Explore Programs",
  sections: [
    {
      num: "01",
      heading: "Our Story",
      body: "SRS Academy is the academic and professional training initiative of SPRS INFOTECH PVT LTD. It was created to bring the practical technology experience of SPRS Infotech into a structured learning environment for students and aspiring professionals. SPRS INFOTECH PVT LTD works across web development, application development, software solutions, UI/UX and digital design, prototypes, mock-ups, and related technology services. Through SRS Academy, this practical industry experience is transformed into accessible, skill-focused learning programs designed to help learners understand modern tools, build practical capabilities, and prepare for technology-driven opportunities. SRS Academy operates primarily as an online learning academy, with presence and support associated with Kolkata and Mumbai.",
    },
    {
      num: "02",
      heading: "Relationship with SPRS INFOTECH PVT LTD",
      body: "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD, created to extend its practical experience in technology, software development, digital products, and design into structured learning programs.",
    },
    {
      num: "03",
      heading: "Mission",
      body: "To make practical, technology-focused education accessible to learners who want to build relevant skills, understand modern digital tools, and turn knowledge into real-world capability.",
    },
    {
      num: "04",
      heading: "Vision",
      body: "To build a modern learning ecosystem where education, technology, practical experience, and continuous skill development work together to prepare learners for an evolving digital world.",
    },
    {
      num: "05",
      heading: "Values",
      body: "SRS Academy is guided by six core values.",
      list: [
        "Practical Learning — Education should connect knowledge with meaningful application.",
        "Continuous Growth — Technology changes constantly, and learning should evolve with it.",
        "Clarity — Complex ideas should be taught in a structured, understandable way.",
        "Accessibility — Quality learning should be available beyond geographical limitations.",
        "Curiosity — Strong learners ask questions, experiment, and explore.",
        "Responsibility — Technology should be approached professionally, ethically, and thoughtfully.",
      ],
    },
    {
      num: "06",
      heading: "Learn / Build / Advance",
      body: "SRS Academy's approach to teaching follows a simple system.",
      list: [
        "LEARN WITH PURPOSE — Understand the concepts, systems, and tools behind modern digital work.",
        "BUILD THROUGH PRACTICE — Develop capability through exercises, projects, experimentation, and practical application.",
        "ADVANCE CONTINUOUSLY — Use what you learn as a foundation for deeper skills, professional development, and future opportunities.",
      ],
    },
    {
      num: "07",
      heading: "Principles",
      body: "[GUIDING PRINCIPLES — PLACEHOLDER SET.]",
      list: ["[PRINCIPLE 1]", "[PRINCIPLE 2]", "[PRINCIPLE 3]"],
    },
  ],
};

export const admissionsPage: EditorialPage = {
  kicker: "Admissions",
  title: "Admissions",
  intro: "[ADMISSIONS INTRO — placeholder, one sentence.]",
  ctaLabel: "[START APPLICATION]",
  sections: [
    {
      num: "01",
      heading: "Eligibility",
      body: "[GENERAL ELIGIBILITY OVERVIEW — program-specific detail lives on each Program Detail page.]",
    },
    {
      num: "02",
      heading: "Required Documents",
      body: "[DOCUMENT LIST — PLACEHOLDER SET.]",
      list: ["[DOCUMENT 1]", "[DOCUMENT 2]", "[DOCUMENT 3]", "[DOCUMENT 4]"],
    },
    {
      num: "03",
      heading: "Application Process",
      body: "[APPLICATION PROCESS OVERVIEW — full step visual below.]",
    },
    {
      num: "04",
      heading: "Fees / Payment Information",
      body: "[PAYMENT INFORMATION — PLACEHOLDER, CONFIRM BEFORE PUBLISH.]",
    },
    {
      num: "05",
      heading: "Important Dates",
      body: "[IMPORTANT DATES — PLACEHOLDER, PER-INTAKE.]",
    },
    {
      num: "06",
      heading: "Verification Process",
      body: "[VERIFICATION PROCESS — PLACEHOLDER.]",
    },
  ],
};

/** The five-step admissions journey, in the shared node language. */
export const admissionsJourney = [
  { num: "01", title: "[REVIEW PROGRAMS]", body: "[STEP DESCRIPTION — placeholder.]" },
  { num: "02", title: "[SUBMIT APPLICATION]", body: "[STEP DESCRIPTION — placeholder.]" },
  { num: "03", title: "[VERIFICATION]", body: "[STEP DESCRIPTION — placeholder.]" },
  { num: "04", title: "[CONFIRMATION]", body: "[STEP DESCRIPTION — placeholder.]" },
  { num: "05", title: "[ENROLLMENT]", body: "[STEP DESCRIPTION — placeholder.]" },
];

export const contactPage: EditorialPage = {
  kicker: "Contact",
  title: "Contact SRS Academy",
  intro: "[CONTACT INTRO — placeholder, one sentence.]",
  sections: [
    {
      num: "01",
      heading: "General Enquiries",
      body: "[DESCRIPTION + CONTACT ROUTE — PLACEHOLDER.]",
    },
    { num: "02", heading: "Admissions", body: "[DESCRIPTION + CONTACT ROUTE — PLACEHOLDER.]" },
    { num: "03", heading: "Support", body: "[DESCRIPTION + CONTACT ROUTE — PLACEHOLDER.]" },
    { num: "04", heading: "Partnerships", body: "[DESCRIPTION + CONTACT ROUTE — PLACEHOLDER.]" },
  ],
};

export const updatesPage = {
  kicker: "Updates & Announcements",
  title: "Updates",
  intro: "[UPDATES INTRO — placeholder, one sentence.]",
} as const;

export const resourcesPage = {
  kicker: "Resources",
  title: "Resources",
  intro: "[RESOURCES INTRO — placeholder, one sentence.]",
} as const;

export const faqPage = {
  kicker: "Frequently Asked Questions",
  title: "FAQ",
  intro:
    "Find quick answers about SRS Academy, our programs, learning modes, certification, admissions, and how to get started.",
} as const;
