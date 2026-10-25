/** Display categories. Spreadsheet labels are normalised in the import script. */
export const courseCategories = [
  "Computer",
  "Vocational",
  "School",
  "Typing",
  "Project",
  "Stenography",
  "Professional Vocational",
  "Professional",
  "Internship",
  "Technical Training",
] as const;

export type CourseCategory = (typeof courseCategories)[number];

export type CurriculumModule = {
  title: string;
  summary: string;
  topics: string[];
};

/**
 * One public course. Catalogue rows come from courses.json. SRS programs are
 * merged in `index.ts` and are not in the spreadsheet.
 */
export type Course = {
  sno: number;
  slug: string;
  name: string;
  category: string;
  code: string;
  duration: string;
  /** Short topic lines. Not the spreadsheet's raw paragraph. */
  modules: string[];
  origin: "catalogue" | "srs";
  level?: string;
  summary?: string;
  outcomes?: string[];
  curriculum?: CurriculumModule[];
};

export type CatalogueCourse = {
  sno: number;
  slug: string;
  name: string;
  category: string;
  code: string;
  duration: string;
  modules: string[];
};

export type SiteRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};
