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
 * The questions are structural placeholders so the categories, accordion and
 * search are exercisable. No answer is invented — the design set records
 * "no answers are invented — placeholders throughout until content is
 * confirmed", and a wrong answer about fees or certification would be worse
 * than no answer at all.
 */
export const faqEntries: FaqEntry[] = (
  [
    "General",
    "Programs",
    "Admissions",
    "Payments",
    "Certification",
    "Student Support",
  ] as const
).flatMap((category) =>
  [1, 2].map((n) => ({
    category,
    question: `[${category.toUpperCase()} QUESTION ${n}]`,
    answer: "[ANSWER — approved copy pending. Nothing is asserted until confirmed.]",
  })),
);
