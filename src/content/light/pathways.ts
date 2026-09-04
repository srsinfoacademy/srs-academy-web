/** "Who are you?" — the Find Your Path control on the homepage. */
export type Pathway = {
  id: string;
  emoji: string;
  label: string;
  body: string;
};

export const pathways: Pathway[] = [
  {
    id: "student",
    emoji: "🎓",
    label: "Student",
    body: "Still in school or college and want a head start — practical skills alongside your studies, at a pace that fits around them.",
  },
  {
    id: "career-starter",
    emoji: "🚀",
    label: "Career starter",
    body: "Ready to move from learning to doing — a structured program that builds toward a real, demonstrable project or portfolio.",
  },
  {
    id: "career-switcher",
    emoji: "🔁",
    label: "Career switcher",
    body: "Changing direction and need a credible, practical foundation in a new field — without starting completely from zero.",
  },
  {
    id: "working-professional",
    emoji: "💼",
    label: "Working professional",
    body: "Upskilling around a job — flexible online formats designed to fit evenings, weekends, and a full calendar.",
  },
  {
    id: "entrepreneur",
    emoji: "🌱",
    label: "Entrepreneur",
    body: "Building a business — from a home-based mehendi or makeup practice to a small technology venture — and want the practical skills to run it.",
  },
  {
    id: "corporate-team",
    emoji: "🏢",
    label: "Corporate / team lead",
    body: "Looking to upskill a team — cohort-based, business-relevant training delivered on your organisation's timeline.",
  },
];
