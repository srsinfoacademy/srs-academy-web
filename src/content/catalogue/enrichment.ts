import type { CatalogueSlug } from "@/content/catalogue/courses";
import type { CourseEnrichment } from "@/content/catalogue/types";

/**
 * Enrichment for individual courses in the shared catalogue — the one place
 * to add `mode`, `level`, `overview`, `outcomes`, `eligibility`,
 * `certification`, `fees`, a richer curriculum structure, or a custom
 * enquiry CTA once SRS Academy actually confirms them. Both `/programs`
 * (dark) and `/light/courses` (light) pick these up automatically, via
 * `mergeEnrichment()` in `helpers.ts` — nothing here is theme-specific.
 *
 * HOW TO ADD OR EDIT AN ENTRY
 * - Key must be a real course slug (`CatalogueSlug` — see `courses.ts`); a
 *   typo'd or removed slug fails `pnpm typecheck`, and `assertSlugsMatch()`
 *   in `courses.ts` fails the build too, as a second guardrail.
 * - Every field is optional — set only what's actually confirmed. Leave a
 *   field out entirely (don't write `field: null`) when it isn't known yet;
 *   that keeps a half-filled entry honest about what's still missing.
 * - Never write marketing copy to fill a gap. If SRS Academy hasn't
 *   confirmed it, it doesn't belong here yet.
 * - `certification`/`fees` are neutral strings — see the type-level
 *   comments in `types.ts` for exactly what they must not imply.
 * - `fees: "Contact for current fees"` is a real value you choose per
 *   course, not a default this file (or anything downstream) applies on
 *   its own — a course with no `fees` key just omits the Fees section.
 *
 * FIRST CONTENT BATCH
 * Full Stack Web Development already has its own confirmed, hand-authored
 * detail in `@/content/program-detail` and isn't part of this catalogue's
 * base records — see that file rather than this one. Five courses below
 * additionally carry a manually organized curriculum from that initial
 * pass, kept exactly as authored.
 *
 * EDITORIAL DRAFT PASS (course-content-draft.xlsx, approved)
 * `overview`, `outcomes` and (for two AI/digital-marketing courses)
 * `curriculum` module grouping were generated strictly from course name,
 * category/subcategory, duration and existing verified curriculum topics
 * (see `scripts/generate-course-draft.ts`), reviewed, and applied via
 * `scripts/import-course-content.py --apply`. `mode`, `level`,
 * `eligibility`, `certification` and `fees` are still deliberately unset
 * everywhere in this file — none of that has been confirmed by SRS
 * Academy yet, and none of it was drafted or inferred.
 */

export const courseEnrichment: Partial<Record<CatalogueSlug, CourseEnrichment>> = {
  "advanced-diploma-in-computer-application": {
    curriculum: [
      { title: "Computer Fundamentals & Office Skills", topics: ["Computer Fundamentals", "Operating System", "Windows 7", "MS Office (Word, Excel, PowerPoint, Access)", "Internet & E-Mail"] },
      { title: "Typing", topics: ["English Typing", "Regional Typing"] },
      { title: "Web & Programming", topics: ["HTML", "DHTML", "C Programming", "JavaScript"] },
      { title: "Business & Design Tools", topics: ["Tally Prime", "PageMaker", "Photoshop", "CorelDRAW"] }
    ],
    overview: "This course introduces learners to computer applications, covering Computer Fundamentals, Operating System, Windows 7, MS Office, Internet & E-Mail and English Typing, over a duration of 1 Year.",
    outcomes: ["Understand computer fundamentals.", "Learn to operating system.", "Practice windows 7.", "Explore ms office.", "Use basic internet & e-mail.", "Develop familiarity with english typing."],
  },

  "advanced-diploma-in-digital-marketing": {
    curriculum: [
      { title: "Foundations & Account Management", topics: ["Digital Marketing Concept", "Account Management", "Campaign & Ad Group Management"] },
      { title: "Targeting, Budgeting & Ad Formats", topics: ["Key Targeting", "Language & Location Targeting", "Budget & Bidding", "Search, Display & Video Ads", "Ad Formats"] },
      { title: "AdWords Tools & Reporting", topics: ["AdWords Tools", "Performance Monitoring & Reporting", "AdWords API", "Google Display Network"] },
      { title: "SEO, Editing & Social Media", topics: ["Introduction to SEO with HTML", "Photo Editing", "Facebook, Instagram, Twitter, LinkedIn Account Management"] }
    ],
    overview: "This course introduces learners to digital marketing, covering Digital Marketing Concept, Account Management, Campaign & Ad Group Management, Key Targeting, Language & Location Targeting and Budget & Bidding, over a duration of 1 Year.",
    outcomes: ["Understand digital marketing concept.", "Learn to account management.", "Practice campaign & ad group management.", "Explore key targeting.", "Use basic language & location targeting.", "Develop familiarity with budget & bidding."],
  },

  "basic-to-advance-mehendi-masters-course": {
    curriculum: [
      { title: "Foundations", topics: ["Basic Knowledge", "Basic Lines", "Humps", "Dots", "Spiral", "Filler Elements", "Different Types Of Grid", "Check", "Borders", "Type Of Flowers"] },
      { title: "Design Styles", topics: ["Semi Bridal", "Arabic Design", "Rajasthani Design", "Mandala Design", "Pakistani Design", "Dubai Style", "Floral Design", "Sanai", "Tabla", "etc.", "Agnikund", "Gachkouto", "Mukut", "Engagement Style", "Simple String Design"] },
      { title: "Client & Business Skills", topics: ["Client Handling", "Cone Making", "Organic Mehendi Making"] }
    ],
    overview: "This course introduces learners to mehendi design, covering Basic Knowledge, Basic Lines, Humps, Dots, Spiral and Filler Elements, over a duration of 3 Months.",
    outcomes: ["Understand basic knowledge.", "Learn to basic lines.", "Practice humps.", "Explore dots.", "Use basic spiral.", "Develop familiarity with filler elements."],
  },

  "basic-to-advance-nail-extension-course": {
    curriculum: [
      { title: "Extension Foundations", topics: ["Product Knowledge", "Refilling", "Gel Extension", "Tip Application", "Acrylic Extension", "Remove", "Poly Gel Extensions", "Colour Acrylic Extension", "Poly Gel", "Soft Gel Extension"] },
      { title: "Nail Art Techniques", topics: ["Chrome / Mirror", "French", "Transfer Foil Art", "Glitter Application", "Permanent Polish", "Stone Application", "3D Art (Flower)", "Pigment Art", "Flex Art", "Metallic Gel", "Cat Eye"] },
      { title: "Advanced & Specialty Art", topics: ["Omra Nail Art", "Full Nail Glitter Art", "Dry Flower Art", "Isolated (Korean) Nail Art", "Blooming Art", "Glass Nail Art", "Bridal Nail Art", "Airbrush Nail Art", "5D Art", "Advanced Nail Art"] }
    ],
    overview: "This course introduces learners to nail art & extensions, covering Product Knowledge, Refilling, Gel Extension, Tip Application, Acrylic Extension and Remove, over a duration of 2 Months.",
    outcomes: ["Understand product knowledge.", "Learn to refilling.", "Practice gel extension.", "Explore tip application.", "Use basic acrylic extension.", "Develop familiarity with remove."],
  },

  "cake-bakery-course": {
    curriculum: [
      { title: "Cake Sponge Varieties", topics: ["Eggless Cake Sponge", "Vanilla Sponge", "Butterscotch Sponge", "Chocolate Sponge", "Mango Sponge", "Strawberry Sponge", "Pineapple Sponge", "Rasmalai Sponge", "With Egg Sponge Cake", "Premix Cake Sponge"] }
    ],
    overview: "This course introduces learners to baking, covering Eggless Cake Sponge, Vanilla Sponge, Butterscotch Sponge, Chocolate Sponge, Mango Sponge and Strawberry Sponge, over a duration of 1 Month.",
    outcomes: ["Understand eggless cake sponge.", "Learn to vanilla sponge.", "Practice butterscotch sponge.", "Explore chocolate sponge.", "Use basic mango sponge.", "Develop familiarity with strawberry sponge."],
  },

  "summer-internship-programme": {
    overview: "This course introduces learners to computer & digital literacy / foundation programs, covering Fundamentals of Computers, Operating System, MS Office and Internet, over a duration of 120 Hours.",
    outcomes: ["Understand fundamentals of computers.", "Learn to operating system.", "Practice ms office.", "Explore internet."],
  },

  "basic-internship-course": {
    overview: "This course introduces learners to computer & digital literacy / foundation programs, covering Microsoft Office and Internet, over a duration of 120 Hours.",
  },

  "it-siksha-with-ai": {
    overview: "This course introduces learners to ai tools & applications, covering Computer Fundamentals, MS Office, Internet, AI Introduction, Chatbots and Content Writers, over a duration of 3 Months.",
    outcomes: ["Understand computer fundamentals.", "Learn to ms office.", "Practice internet.", "Explore ai introduction.", "Use basic chatbots.", "Develop familiarity with content writers."],
    curriculum: [
      { title: "Foundations", topics: ["Computer Fundamentals", "MS Office (Word, Excel, PowerPoint)", "Internet"] },
      { title: "AI Concepts", topics: ["AI Introduction", "Chatbots", "Content Writers", "Code Generators", "Create Images from Text Prompts", "Website", "Application & Game Making", "AI Voice", "AI Song", "Sound Effect", "AI Video Editing"] }
    ],
  },

  "ai-with-digital-marketing-basic-siksha": {
    overview: "This course introduces learners to ai & digital marketing, covering AI Introduction, Chatbots, Content Writers, Code Generators, Create Images from Text Prompts and Website, over a duration of 3 Months.",
    outcomes: ["Understand ai introduction.", "Learn to chatbots.", "Practice content writers.", "Explore code generators.", "Use basic create images from text prompts.", "Develop familiarity with website."],
    curriculum: [
      { title: "AI Concepts", topics: ["AI Introduction", "Chatbots", "Content Writers", "Code Generators", "Create Images from Text Prompts", "Website", "Application & Game Making", "AI Voice", "AI Song", "Sound Effect", "AI Video Editing"] },
      { title: "Digital Marketing Concepts", topics: ["Digital Marketing Introduction", "Social Media Marketing (Facebook, Instagram, WhatsApp, Twitter)", "Email Marketing", "YouTube Content Marketing", "Search Engine Optimization (SEO)", "Mobile Marketing", "Pay-Per-Click", "Affiliate Marketing"] }
    ],
  },

  "digital-marketing-siksha": {
    overview: "This course introduces learners to digital marketing, covering Social Media Marketing, Email Marketing, YouTube Content Marketing, Search Engine Optimization, Mobile Marketing and Pay-Per-Click, over a duration of 3 Months.",
    outcomes: ["Understand social media marketing.", "Learn to email marketing.", "Practice youtube content marketing.", "Explore search engine optimization.", "Use basic mobile marketing.", "Develop familiarity with pay-per-click."],
  },

  "it-siksha": {
    overview: "This course introduces learners to computer & digital literacy, covering Computer Fundamentals, MS Office, Internet and PDP, over a duration of 3 Months.",
    outcomes: ["Understand computer fundamentals.", "Learn to ms office.", "Practice internet.", "Explore pdp."],
  },

  "digital-literacy-siksha": {
    overview: "This course introduces learners to computer & digital literacy, covering Fundamentals, Windows, Microsoft Word, Microsoft Excel, Microsoft PowerPoint and Internet, over a duration of 3 Months.",
    outcomes: ["Understand fundamentals.", "Learn to windows.", "Practice microsoft word.", "Explore microsoft excel.", "Use basic microsoft powerpoint.", "Develop familiarity with internet."],
  },

  "certificate-in-assamese-typing": {
    overview: "This course introduces learners to regional language typing, covering Assamese Typing, over a duration of 3 Months.",
  },

  "diploma-in-english-and-hindi-typing": {
    overview: "This course introduces learners to regional language typing, covering English & Hindi Typing, over a duration of 6 Months.",
  },

  "certificate-in-odia-typing": {
    overview: "This course introduces learners to regional language typing, covering Odia Typing, over a duration of 3 Months.",
  },

  "diploma-in-english-and-bengali-typing": {
    overview: "This course introduces learners to regional language typing, covering English & Bengali Typing, over a duration of 6 Months.",
  },

  "certificate-in-hindi-typing": {
    overview: "This course introduces learners to regional language typing, covering Hindi Typing, over a duration of 3 Months.",
  },

  "certificate-in-bengali-typing": {
    overview: "This course introduces learners to regional language typing, covering Bengali Typing, over a duration of 3 Months.",
  },

  "certificate-in-english-typing": {
    overview: "This course introduces learners to regional language typing, covering English Typing, over a duration of 3 Months.",
  },

  "diploma-in-english-typing": {
    overview: "This course introduces learners to regional language typing, covering English Typing, over a duration of 6 Months.",
  },

  "diploma-in-hindi-typing": {
    overview: "This course introduces learners to regional language typing, covering Computer Fundamental and Hindi Typing, over a duration of 6 Months.",
  },

  "diploma-in-bengali-typing": {
    overview: "This course introduces learners to regional language typing, covering Computer Fundamentals and Bengali Typing using Bijoy & Bengali Word, over a duration of 6 Months.",
  },

};
