/**
 * Copy for the redesigned public pages. Facts (address, phone, email,
 * hours, CEO, mission, vision) are NOT repeated here — pages read them from
 * site.ts. Course names, durations and counts come from the course helpers.
 *
 * Rules: no fees or prices, no student counts, no accreditation, no batch
 * dates, no Mumbai, no testimonials, no hard-coded course counts.
 */

export const homeCopy = {
  hero: {
    title: "Learn skills. Build confidence. Shape your future.",
    intro:
      "SRS Academy is the training initiative of SPRS Infotech Pvt Ltd. We turn real experience in web development, software and digital design into practical, project-based courses.",
    features: ["Online-first learning", "Project-based programs", "SRS Certificate of Completion"],
    featuredLabel: "Featured program",
  },
  courses: {
    eyebrow: "Featured courses",
    title: "Explore our courses",
    intro:
      "Practical digital, technology, communication and vocational skills, with courses designed for beginners as well as learners who want to go further.",
  },
  areas: {
    eyebrow: "Course areas",
    title: "Three areas, one practical approach",
  },
  programs: {
    eyebrow: "SRS programs",
    title: "Start with a program built around real projects",
  },
  why: {
    eyebrow: "Why SRS Academy",
    title: "Learning that comes from real technology work",
    items: [
      {
        title: "Practical and project-based",
        body: "Programs build toward working projects — Full Stack ends with a complete, deployed web application.",
      },
      {
        title: "Rooted in real industry work",
        body: "Built on SPRS Infotech’s experience in web, app, software and UI/UX projects.",
      },
      {
        title: "Structured curriculum",
        body: "Clear modules that move from foundations to applied work, revised as tools change.",
      },
      {
        title: "Learn online, from anywhere",
        body: "Quality learning beyond geographical limits, with classroom support in Kolkata.",
      },
      {
        title: "Certificate of Completion",
        body: "Issued by SRS Academy to learners who meet the completion criteria.",
      },
    ],
  },
  aboutTeaser: {
    eyebrow: "About the academy",
    body: "SPRS Infotech works across web and application development, software solutions, UI/UX and digital design. SRS Academy brings that practical experience into structured, skill-focused programs — helping learners understand modern tools and build real capability.",
  },
  howYouLearn: {
    eyebrow: "How you learn",
    title: "Learn. Build. Advance.",
    intro: "Every SRS program follows the same simple system.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
  },
} as const;

/** Learn / Build / Advance. Images are keyed into `site.imagery`. */
export const learnBuildAdvance = [
  {
    image: "learn",
    eyebrow: "Learn with purpose",
    title: "Understand the why",
    body: "Understand the concepts, systems and tools behind modern digital work.",
  },
  {
    image: "build",
    eyebrow: "Build through practice",
    title: "Make real things",
    body: "Develop capability through exercises, projects, experimentation and practical application.",
  },
  {
    image: "advance",
    eyebrow: "Advance continuously",
    title: "Keep growing",
    body: "Use what you learn as a foundation for deeper skills, professional development and future opportunities.",
  },
] as const;

export const aboutCopy = {
  eyebrow: "About us",
  title: "Practical technology experience, turned into structured learning.",
  intro:
    "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD. Most courses are online-first, with classroom support in Kolkata.",
  storyTitle: "Our story",
  story: [
    "SRS Academy was created to bring the practical technology experience of SPRS Infotech into a structured learning environment for students and aspiring professionals.",
    "SPRS Infotech works across web development, application development, software solutions, UI/UX and digital design, prototypes and mock-ups. Through SRS Academy, that experience becomes accessible, skill-focused programs that help learners understand modern tools and prepare for technology-driven opportunities.",
  ],
  valuesTitle: "Our values",
  values: [
    { title: "Practical Learning", body: "Education should connect knowledge with meaningful application." },
    { title: "Continuous Growth", body: "Technology changes constantly, and learning should evolve with it." },
    { title: "Clarity", body: "Complex ideas should be taught in a structured, understandable way." },
    { title: "Accessibility", body: "Quality learning should be available beyond geographical limitations." },
    { title: "Curiosity", body: "Strong learners ask questions, experiment and explore." },
    { title: "Responsibility", body: "Technology should be approached professionally, ethically and thoughtfully." },
  ],
} as const;

export const technicalTrainingCopy = {
  eyebrow: "Technical training",
  title: "Software, web and AI skills — taught the way they’re used at work",
  intro:
    "Our technical programs draw on SPRS Infotech’s day-to-day work in web, application and software development. You learn the concepts, then apply them in exercises and projects.",
  programsTitle: "Technical programs",
  moreTitle: "Looking for something else?",
  moreBody:
    "The full catalogue also covers computer applications, office skills, typing, vocational and other courses.",
} as const;

export const coursesCopy = {
  eyebrow: "All courses",
  title: "Explore our courses",
  intro:
    "Search the SRS Academy catalogue by course name, category or code, or filter by category. Every course has its own page with its duration and topic list.",
  programsEyebrow: "SRS programs",
  programsTitle: "Programs designed by SRS Academy",
  programsIntro:
    "Our own programs, built on SPRS Infotech’s technology work. Full Stack Web Development has a published curriculum; details for the others are being finalised.",
  searchPlaceholder: "Try “Excel”, “Tally”, “mehendi” or “typing”",
} as const;

export const courseDetailCopy = {
  topicsTitle: "What the course covers",
  topicsPending:
    "The topic list for this course has not been published yet. Send an enquiry and the team will share what the course covers.",
  pendingEyebrow: "Details to be confirmed",
  pendingTitle: "Curriculum details are being finalised",
  certificationTitle: "Certification",
  certificationBody:
    "Learners who complete the required activities and completion criteria may receive an SRS Academy Certificate of Completion, issued by SRS Academy, the training initiative of SPRS INFOTECH PVT LTD.",
  asideTitle: "Interested in this course?",
  asideBody: "Send an enquiry and the SRS team will reply with availability and how to enrol.",
  relatedTitle: "Related courses",
  whoTitle: "Who can apply",
  /** Full Stack only — from the approved program outline. */
  fullStackWho: [
    "Students, beginners, career starters and learners interested in web and software development. No previous professional development experience is required.",
    "You’ll need basic computer literacy, a computer suitable for development work, a stable internet connection, and a willingness to practise regularly.",
  ],
} as const;

export const admissionsCopy = {
  eyebrow: "Admissions & enquiry",
  title: "Start with a conversation",
  intro:
    "Admissions open based on current course availability. Send an enquiry and the SRS team will share course details, timing and next steps.",
  stepsTitle: "How to join",
} as const;

/** The three confirmed admission steps. Nothing after Enrol has been confirmed. */
export const admissionsJourney = [
  { num: "01", title: "Enquire", body: "Tell us which course you are interested in and how we can reach you." },
  { num: "02", title: "Counselling", body: "Talk with the academy team about the course and whether it fits what you want to learn." },
  { num: "03", title: "Enrol", body: "When you are ready, the team confirms the next step to join. Batch dates are shared only when a course is open." },
];

export const contactCopy = {
  eyebrow: "Contact us",
  title: "We’re here to help you choose",
  intro:
    "Questions about courses, timings or eligibility? Write to us using the form below, or reach SRS Academy directly.",
} as const;

export const enquiryCopy = {
  eyebrow: "Enquire",
  title: "Tell us what you’d like to learn",
  intro: "We’ll reply with course details and how to enrol.",
  formats: ["No preference", "Online", "Classroom (Kolkata)", "Need guidance"],
  consent: "By submitting you agree to be contacted about your enquiry. See our",
} as const;

export const resourcesCopy = {
  eyebrow: "Resources",
  title: "Learning resources",
  intro: "Short guides to help you choose a course, prepare for class and get in touch with the academy.",
} as const;

export const updatesCopy = {
  eyebrow: "Updates",
  title: "Updates & news",
  intro: "Admission notices and academy news from SRS Academy.",
  emptyTitle: "No updates published yet",
  emptyBody: "New posts will appear here. To ask about current admissions, send an enquiry.",
} as const;

export const faqPageCopy = {
  eyebrow: "FAQ",
  title: "Frequently asked questions",
  intro: "Answers to common questions about SRS Academy, its courses and how to get in touch.",
} as const;
