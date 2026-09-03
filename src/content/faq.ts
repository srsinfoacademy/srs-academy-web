export const faqCategories = [
  "All",
  "General",
  "Programs",
  "Admissions",
  "Payments",
  "Certification",
  "Student Support",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type FaqEntry = {
  category: Exclude<FaqCategory, "All">;
  question: string;
  answer: string;
};

/**
 * FAQ entries.
 *
 * Confirmed organisation-level answers, supplied by SRS Academy. The
 * Admissions category has no confirmed content yet and keeps structural
 * placeholders so the category, accordion and search remain exercisable —
 * no answer about the admissions process is invented.
 */
export const faqEntries: FaqEntry[] = [
  {
    category: "General",
    question: "What is SRS Academy?",
    answer:
      "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD. It focuses on technology-oriented, practical learning programs for students and aspiring professionals.",
  },
  {
    category: "General",
    question: "Is SRS Academy part of SPRS Infotech?",
    answer:
      "Yes. SRS Academy operates as the academic and training initiative of SPRS INFOTECH PVT LTD, extending the company's practical technology experience into structured learning programs.",
  },
  {
    category: "General",
    question: "Are SRS Academy programs online?",
    answer:
      "SRS Academy is primarily an online learning academy. This allows learners to participate from different locations while following a structured learning program.",
  },
  {
    category: "General",
    question: "Where is SRS Academy located?",
    answer:
      "SRS Academy has presence associated with Kolkata and Mumbai, while most learning activities are designed to be delivered online.",
  },
  {
    category: "Programs",
    question: "Who can join SRS Academy?",
    answer:
      "Eligibility depends on the individual program. Some programs may be suitable for beginners, while others may require prior knowledge or specific qualifications. Program-specific requirements are displayed on the relevant program page.",
  },
  {
    category: "Programs",
    question: "Do I need previous programming experience to join Full Stack Web Development?",
    answer:
      "No professional development experience is required for the beginner-to-intermediate Full Stack Web Development program. Basic computer literacy and a willingness to practice regularly are recommended.",
  },
  {
    category: "Certification",
    question: "Will I receive a certificate?",
    answer:
      "Where a program includes certification, learners who successfully complete the required activities and completion criteria may receive an SRS Academy Certificate of Completion. Exact certification details are provided on the individual program page.",
  },
  {
    category: "Certification",
    question: "Are SRS Academy certificates government or university accredited?",
    answer:
      "SRS Academy does not claim government, university, or external accreditation unless such recognition has been formally obtained. Any applicable recognition will be clearly stated on the relevant program page.",
  },
  {
    category: "Payments",
    question: "How can I know the course fee?",
    answer:
      "Fees are published or communicated separately for each program. If a fee is not currently displayed, learners can contact SRS Academy for current enrollment information.",
  },
  {
    category: "Student Support",
    question: "How are classes conducted?",
    answer:
      "Programs are primarily designed for online learning. Exact schedules, session formats, learning materials, and support arrangements may vary by program.",
  },
  {
    category: "Student Support",
    question: "How can I contact SRS Academy?",
    answer:
      "You can contact SRS Academy using the official email address, phone number, or contact options published on the Contact page.",
  },
  // Admissions: no confirmed process content yet — kept as structural
  // placeholders so the category and accordion remain exercisable.
  {
    category: "Admissions",
    question: "[ADMISSIONS QUESTION 1]",
    answer: "[ANSWER — approved copy pending. Nothing is asserted until confirmed.]",
  },
  {
    category: "Admissions",
    question: "[ADMISSIONS QUESTION 2]",
    answer: "[ANSWER — approved copy pending. Nothing is asserted until confirmed.]",
  },
];
