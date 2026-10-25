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
      body: "SRS Academy is the academic and professional training initiative of SPRS INFOTECH PVT LTD. It was created to bring the practical technology experience of SPRS Infotech into a structured learning environment for students and aspiring professionals. SPRS INFOTECH PVT LTD works across web development, application development, software solutions, UI/UX and digital design, prototypes, mock-ups, and related technology services. Through SRS Academy, this practical industry experience is transformed into accessible, skill-focused learning programs designed to help learners understand modern tools, build practical capabilities, and prepare for technology-driven opportunities. SRS Academy operates primarily as an online learning academy, with classroom support in Kolkata.",
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
      body: "SRS Academy is guided by three core principles.",
      list: [
        "LEARN WITH PURPOSE — Understand the concepts, systems, and tools behind modern digital work.",
        "BUILD THROUGH PRACTICE — Develop capability through exercises, projects, experimentation, and practical application.",
        "ADVANCE CONTINUOUSLY — Use what you learn as a foundation for deeper skills, professional development, and future opportunities.",
      ],
    },
  ],
};

export const admissionsPage: EditorialPage = {
  kicker: "Admissions",
  title: "Admissions",
  intro:
    "Choose a program, review the available learning details, and contact SRS Academy for current admission guidance.",
  // The exact application destination (form/portal) isn't confirmed yet;
  // "Application form" is the honest neutral label shown wherever that
  // pending destination is surfaced (see Button/LightButton `pending`).
  ctaLabel: "Application form",
  sections: [
    {
      num: "01",
      heading: "Eligibility",
      body: "Eligibility depends on the individual program. Some programs may be suitable for beginners, while others may require prior knowledge or specific qualifications — program-specific requirements are shown on each program's detail page.",
    },
    {
      num: "02",
      heading: "Required Documents",
      body: "Required documents may vary by program. SRS Academy will confirm the applicable documents during the admission process.",
    },
    {
      num: "03",
      heading: "Application Process",
      body: "The application process follows the steps in the admissions journey below — from exploring a program to starting your course once admission is confirmed.",
    },
    {
      num: "04",
      heading: "Important Dates",
      body: "Batch dates are not published here. They are shared during counselling, and only when a course is open.",
    },
    {
      num: "05",
      heading: "Verification Process",
      body: "Submitted information may be reviewed before enrollment is confirmed.",
    },
  ],
};

/**
 * Generic admission steps. Dates, batch timings and fees are not confirmed
 * and must not be added here.
 */
export const admissionsJourney = [
  { num: "01", title: "Enquire", body: "Tell us which course you are interested in and how we can reach you." },
  { num: "02", title: "Counselling", body: "Talk with the academy team about the course and whether it fits what you want to learn." },
  { num: "03", title: "Enrol", body: "When you are ready, the team confirms the next step to join. Batch dates are shared only when a course is open." },
];

export const contactPage: EditorialPage = {
  kicker: "Contact",
  title: "Contact SRS Academy",
  intro: "Reach out using the details below, or send a message directly through this page.",
  sections: [
    {
      num: "01",
      heading: "General Enquiries",
      body: "For general questions about SRS Academy, programs, learning options, or academy information.",
    },
    {
      num: "02",
      heading: "Admissions",
      body: "For help choosing a program, understanding the admission process, or checking current course availability.",
    },
    {
      num: "03",
      heading: "Support",
      body: "For assistance with an existing enquiry, website issue, or learning-related support request.",
    },
    {
      num: "04",
      heading: "Partnerships",
      body: "For institutional, corporate, training, or collaboration enquiries.",
    },
  ],
};

export const updatesPage = {
  kicker: "Updates & Announcements",
  title: "Updates",
  intro: "Announcements and updates from SRS Academy will appear here as they're published.",
} as const;

export const resourcesPage = {
  kicker: "Resources",
  title: "Resources",
  intro: "Practical guides to help you choose, prepare for, and get the most from a course.",
} as const;

export const faqPage = {
  kicker: "Frequently Asked Questions",
  title: "FAQ",
  intro:
    "Find quick answers about SRS Academy, our programs, learning modes, certification, admissions, and how to get started.",
} as const;
