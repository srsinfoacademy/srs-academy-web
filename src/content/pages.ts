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
  intro: "[ABOUT INTRO — one to two sentences, placeholder.]",
  ctaLabel: "[EXPLORE PROGRAMS]",
  sections: [
    {
      num: "01",
      heading: "Our Story",
      body: "[OUR STORY — placeholder narrative. No historical claims until confirmed.]",
    },
    {
      num: "02",
      heading: "Relationship with SPRS INFOTECH PVT LTD",
      body: "[OFFICIAL DESCRIPTION OF THE RELATIONSHIP WITH SPRS INFOTECH PVT LTD — CONFIRM EXACT WORDING BEFORE PUBLISH.]",
    },
    { num: "03", heading: "Mission", body: "[MISSION STATEMENT — PLACEHOLDER.]" },
    { num: "04", heading: "Vision", body: "[VISION STATEMENT — PLACEHOLDER.]" },
    {
      num: "05",
      heading: "Values",
      body: "[VALUES — PLACEHOLDER SET.]",
      list: ["[VALUE 1]", "[VALUE 2]", "[VALUE 3]", "[VALUE 4]"],
    },
    {
      num: "06",
      heading: "Learn / Build / Advance",
      body: "[PHILOSOPHY STATEMENT FOR EACH WORD — PLACEHOLDER.]",
      list: ["LEARN — [STATEMENT]", "BUILD — [STATEMENT]", "ADVANCE — [STATEMENT]"],
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
  intro: "[FAQ INTRO — placeholder, one sentence.]",
} as const;
