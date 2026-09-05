import { splitCurriculum, slugify } from "@/content/catalogue/helpers";
import type { NormalizedCourse } from "@/content/catalogue/types";

/**
 * The real SRS Academy course catalogue, transcribed from
 * `Course_Details_Master_Sheet.xlsx` ("Course List" sheet, rows 4–25 / Sl.
 * No. 1–22) and normalized per the approved decisions:
 *
 * - All 22 rows kept as independent catalogue entries — nothing consolidated.
 * - `VTDB001` (shared by rows 1 and 3) is preserved as `sourceCourseCode` on
 *   both, `courseCode` is `null` and `codeConflict: true` on both — never
 *   displayed publicly until SRS Academy corrects the source data.
 * - "Advance Diploma" → "Advanced Diploma" in the public `name`; the
 *   spreadsheet's exact text is kept in `sourceName`.
 * - "Sikhsha" → "Siksha" (row 8 only) in the public `name`.
 * - "In"/"in" capitalization normalized to lowercase "in" throughout typing
 *   course titles.
 * - Cake Bakery Course gets the new `food` category (Food & Baking).
 * - Fields the sheet doesn't provide (`mode`, `level`, `overview`,
 *   `outcomes`, `eligibility`, `certification`, `fees`) are `null` — never
 *   invented.
 *
 * Full Stack Web Development — SRS Academy's one confirmed, richly authored
 * program — is intentionally NOT duplicated here. Its catalogue-level facts
 * (name, slug, category, duration…) already live in `@/content/programs`,
 * and its rich narrative detail (about, outcomes, certification, FAQ…) in
 * `@/content/program-detail`; `helpers.ts`'s adapters read those directly so
 * "one real course object exists only once" holds for it too.
 */

function record(input: {
  sourceName: string;
  sourceCourseCode: string | null;
  codeConflict?: boolean;
  duration: { raw: string; months: number | null; hours: number | null };
  curriculumRaw: string;
  category: NormalizedCourse["category"];
  subcategory: string | null;
  tags?: string[];
  courseType: NormalizedCourse["courseType"];
  sourceRow: number;
  name?: string; // only when normalization differs from sourceName
}): NormalizedCourse {
  const name = input.name ?? input.sourceName;
  const codeConflict = input.codeConflict ?? false;
  return {
    id: slugify(name),
    slug: slugify(name),
    name,
    sourceName: input.sourceName,
    courseCode: codeConflict ? null : input.sourceCourseCode,
    sourceCourseCode: input.sourceCourseCode,
    codeConflict,
    category: input.category,
    subcategory: input.subcategory,
    tags: input.tags ?? [],
    courseType: input.courseType,
    mode: null,
    level: null,
    duration: input.duration,
    overview: null,
    outcomes: null,
    curriculum: splitCurriculum(input.curriculumRaw),
    curriculumRaw: input.curriculumRaw,
    eligibility: null,
    certification: null,
    fees: null,
    featured: false,
    status: "live",
    sourceRow: input.sourceRow,
  };
}

export const catalogueCourses: NormalizedCourse[] = [
  record({
    sourceName: "Cake Bakery Course",
    sourceCourseCode: "VTDB001",
    codeConflict: true,
    duration: { raw: "1 Month", months: 1, hours: null },
    curriculumRaw:
      "Eggless Cake Sponge, Vanilla Sponge, Butterscotch Sponge, Chocolate Sponge, Mango Sponge, Strawberry Sponge, Pineapple Sponge, Rasmalai Sponge, With Egg Sponge Cake, Premix Cake Sponge.",
    category: "food",
    subcategory: "Baking",
    courseType: "Course",
    sourceRow: 4,
  }),
  record({
    sourceName: "Basic to Advance Nail Extension Course",
    sourceCourseCode: "VTDB101",
    duration: { raw: "2 Months", months: 2, hours: null },
    curriculumRaw:
      "Product Knowledge, Refilling, Gel Extension, Tip Application, Acrylic Extension, Chrome / Mirror, French, Transfer Foil Art, Glitter Application, Permanent Polish, Stone Application, Remove, Poly Gel Extensions, Colour Acrylic Extension, 3D Art (Flower), Omra Nail Art, Full Nail Glitter Art, Dry Flower Art, Isolated (Korean) Nail Art, Blooming Art, Glass Nail Art, Bridal Nail Art, Pigment Art, Flex Art, Airbrush Nail Art, 5D Art, Poly Gel, Metallic Gel, Cat Eye, Soft Gel Extension, Advanced Nail Art.",
    category: "beauty",
    subcategory: "Nail Art & Extensions",
    courseType: "Course",
    sourceRow: 5,
  }),
  record({
    sourceName: "Basic to Advance Mehendi Master's Course",
    sourceCourseCode: "VTDB001",
    codeConflict: true,
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw:
      "Basic Knowledge, Basic Lines, Humps, Dots, Spiral, Filler Elements, Different Types Of Grid, Check, Borders, Type Of Flowers, Semi Bridal, Arabic Design, Rajasthani Design, Mandala Design, Pakistani Design, Dubai Style, Floral Design, Sanai, Tabla, etc., Agnikund, Gachkouto, Mukut, Engagement Style, Simple String Design, Client Handling, Cone Making, Organic Mehendi Making.",
    category: "creative",
    subcategory: "Mehendi Design",
    courseType: "Course",
    sourceRow: 6,
  }),
  record({
    sourceName: "Summer Internship Programme",
    sourceCourseCode: "SIP002",
    duration: { raw: "120 Hours", months: null, hours: 120 },
    curriculumRaw:
      "Fundamentals of Computers, Operating System (DOS, Windows), MS Office (Word, Excel, PowerPoint, Access), Internet.",
    category: "business",
    subcategory: "Computer & Digital Literacy / Foundation Programs",
    courseType: "Training Program",
    sourceRow: 7,
  }),
  record({
    sourceName: "Basic Internship Course",
    sourceCourseCode: "BIC001",
    duration: { raw: "120 Hours", months: null, hours: 120 },
    curriculumRaw: "Microsoft Office (Word, Excel, PowerPoint), Internet.",
    category: "business",
    subcategory: "Computer & Digital Literacy / Foundation Programs",
    courseType: "Training Program",
    sourceRow: 8,
  }),
  record({
    sourceName: "Advance Diploma in Computer Application",
    name: "Advanced Diploma in Computer Application",
    sourceCourseCode: "ADCA0002",
    duration: { raw: "1 Year", months: 12, hours: null },
    curriculumRaw:
      "Computer Fundamentals, Operating System, Windows 7, MS Office (Word, Excel, PowerPoint, Access), Internet & E-Mail, English Typing, Regional Typing, HTML, DHTML, C Programming, JavaScript, Tally Prime, PageMaker, Photoshop, CorelDRAW.",
    category: "business",
    subcategory: "Computer Applications",
    courseType: "Advanced Diploma",
    sourceRow: 9,
  }),
  record({
    sourceName: "Advance Diploma In Digital Marketing",
    name: "Advanced Diploma in Digital Marketing",
    sourceCourseCode: "ADDM0001",
    duration: { raw: "1 Year", months: 12, hours: null },
    curriculumRaw:
      "Digital Marketing Concept, Account Management, Campaign & Ad Group Management, Key Targeting, Language & Location Targeting, Budget & Bidding, Search, Display & Video Ads, Ad Formats, AdWords Tools, Performance Monitoring & Reporting, AdWords API, Google Display Network, Introduction to SEO with HTML, Photo Editing, Facebook, Instagram, Twitter, LinkedIn Account Management.",
    category: "business",
    subcategory: "Digital Marketing",
    courseType: "Advanced Diploma",
    sourceRow: 10,
  }),
  record({
    sourceName: "IT Sikhsha with AI",
    name: "IT Siksha with AI",
    sourceCourseCode: "ITSAI005",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw:
      "Computer Fundamentals, MS Office (Word, Excel, PowerPoint), Internet, AI Introduction, Chatbots, Content Writers, Code Generators, Create Images from Text Prompts, Website, Application & Game Making, AI Voice, AI Song, Sound Effect, AI Video Editing.",
    category: "tech",
    subcategory: "AI Tools & Applications",
    tags: ["AI"],
    courseType: null,
    sourceRow: 11,
  }),
  record({
    sourceName: "AI with Digital Marketing Basic Siksha",
    sourceCourseCode: "AIDMS004",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw:
      "AI Introduction, Chatbots, Content Writers, Code Generators, Create Images from Text Prompts, Website, Application & Game Making, AI Voice, AI Song, Sound Effect, AI Video Editing, Digital Marketing Introduction, Social Media Marketing (Facebook, Instagram, WhatsApp, Twitter), Email Marketing, YouTube Content Marketing, Search Engine Optimization (SEO), Mobile Marketing, Pay-Per-Click, Affiliate Marketing.",
    category: "business",
    subcategory: "AI & Digital Marketing",
    tags: ["AI", "Digital Marketing"],
    courseType: null,
    sourceRow: 12,
  }),
  record({
    sourceName: "Digital Marketing Siksha",
    sourceCourseCode: "DMS003",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw:
      "Social Media Marketing (Facebook, Instagram, WhatsApp, Twitter), Email Marketing, YouTube Content Marketing, Search Engine Optimization (SEO), Mobile Marketing, Pay-Per-Click, Affiliate Marketing.",
    category: "business",
    subcategory: "Digital Marketing",
    courseType: null,
    sourceRow: 13,
  }),
  record({
    sourceName: "IT Siksha",
    sourceCourseCode: "ITSS002",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw: "Computer Fundamentals, MS Office (Word, Excel, PowerPoint), Internet, PDP.",
    category: "business",
    subcategory: "Computer & Digital Literacy",
    courseType: null,
    sourceRow: 14,
  }),
  record({
    sourceName: "Digital Literacy Siksha",
    sourceCourseCode: "DLS001",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw:
      "Fundamentals, Windows, Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Internet, Mobile of Mobile Application, Online Form Fill Up, Print, Scan, Xerox, Google Maps Searching, YouTube, Online Television, Video Calling, Email, Ticket Booking, Hotel Booking, Movie Ticket Booking, Online Shopping, UPI Payment, Money Transfer, Mobile Recharge, Online Bill Payment, Water Bill Etc., Insurance Premium Payment, Loan Payment, LICI Premium, Fast Tag, Post / Courier Checking System, Vehicle Information & Insurance Payment Etc.",
    category: "business",
    subcategory: "Computer & Digital Literacy",
    courseType: null,
    sourceRow: 15,
  }),
  record({
    sourceName: "Certificate in Assamese Typing",
    sourceCourseCode: "CAT349",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw: "Assamese Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Assamese"],
    courseType: "Certificate",
    sourceRow: 16,
  }),
  record({
    sourceName: "Diploma In English & Hindi Typing",
    name: "Diploma in English & Hindi Typing",
    sourceCourseCode: "DEH358",
    duration: { raw: "6 Months", months: 6, hours: null },
    curriculumRaw: "English & Hindi Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Hindi", "English"],
    courseType: "Diploma",
    sourceRow: 17,
  }),
  record({
    sourceName: "Certificate in Odia Typing",
    sourceCourseCode: "COT350",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw: "Odia Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Odia"],
    courseType: "Certificate",
    sourceRow: 18,
  }),
  record({
    sourceName: "Diploma In English & Bengali Typing",
    name: "Diploma in English & Bengali Typing",
    sourceCourseCode: "DEBT357",
    duration: { raw: "6 Months", months: 6, hours: null },
    curriculumRaw: "English & Bengali Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Bengali", "English"],
    courseType: "Diploma",
    sourceRow: 19,
  }),
  record({
    sourceName: "Certificate In Hindi Typing",
    name: "Certificate in Hindi Typing",
    sourceCourseCode: "CHT351",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw: "Hindi Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Hindi"],
    courseType: "Certificate",
    sourceRow: 20,
  }),
  record({
    sourceName: "Certificate In Bengali Typing",
    name: "Certificate in Bengali Typing",
    sourceCourseCode: "CBT352",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw: "Bengali Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Bengali"],
    courseType: "Certificate",
    sourceRow: 21,
  }),
  record({
    sourceName: "Certificate In English Typing",
    name: "Certificate in English Typing",
    sourceCourseCode: "CET353",
    duration: { raw: "3 Months", months: 3, hours: null },
    curriculumRaw: "English Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["English"],
    courseType: "Certificate",
    sourceRow: 22,
  }),
  record({
    sourceName: "Diploma In English Typing",
    name: "Diploma in English Typing",
    sourceCourseCode: "DET354",
    duration: { raw: "6 Months", months: 6, hours: null },
    curriculumRaw: "English Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["English"],
    courseType: "Diploma",
    sourceRow: 23,
  }),
  record({
    sourceName: "Diploma In Hindi Typing",
    name: "Diploma in Hindi Typing",
    sourceCourseCode: "DHT355",
    duration: { raw: "6 Months", months: 6, hours: null },
    curriculumRaw: "Computer Fundamental, Hindi Typing.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Hindi"],
    courseType: "Diploma",
    sourceRow: 24,
  }),
  record({
    sourceName: "Diploma In Bengali Typing",
    name: "Diploma in Bengali Typing",
    sourceCourseCode: "DBT356",
    duration: { raw: "6 Months", months: 6, hours: null },
    curriculumRaw: "Computer Fundamentals, Bengali Typing using Bijoy & Bengali Word.",
    category: "career",
    subcategory: "Regional Language Typing",
    tags: ["Bengali"],
    courseType: "Diploma",
    sourceRow: 25,
  }),
];

export function catalogueCourseBySlug(slug: string): NormalizedCourse | undefined {
  return catalogueCourses.find((c) => c.slug === slug);
}
