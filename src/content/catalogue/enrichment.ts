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
 * FIRST CONTENT BATCH (this file's initial pass)
 * Full Stack Web Development already has its own confirmed, hand-authored
 * detail in `@/content/program-detail` and isn't part of this catalogue's
 * base records — see that file rather than this one. The five courses
 * below are the ones named for this pass; for all five, the source
 * spreadsheet has nothing beyond name/code/duration/curriculum, so every
 * field except a manually organized curriculum stays unset here — adding
 * mode, level, overview, outcomes, eligibility, certification or fees for
 * any of them needs a real answer from SRS Academy first.
 */
export const courseEnrichment: Partial<Record<CatalogueSlug, CourseEnrichment>> = {
  "advanced-diploma-in-computer-application": {
    curriculum: [
      {
        title: "Computer Fundamentals & Office Skills",
        topics: [
          "Computer Fundamentals",
          "Operating System",
          "Windows 7",
          "MS Office (Word, Excel, PowerPoint, Access)",
          "Internet & E-Mail",
        ],
      },
      { title: "Typing", topics: ["English Typing", "Regional Typing"] },
      { title: "Web & Programming", topics: ["HTML", "DHTML", "C Programming", "JavaScript"] },
      { title: "Business & Design Tools", topics: ["Tally Prime", "PageMaker", "Photoshop", "CorelDRAW"] },
    ],
  },

  "advanced-diploma-in-digital-marketing": {
    curriculum: [
      {
        title: "Foundations & Account Management",
        topics: ["Digital Marketing Concept", "Account Management", "Campaign & Ad Group Management"],
      },
      {
        title: "Targeting, Budgeting & Ad Formats",
        topics: [
          "Key Targeting",
          "Language & Location Targeting",
          "Budget & Bidding",
          "Search, Display & Video Ads",
          "Ad Formats",
        ],
      },
      {
        title: "AdWords Tools & Reporting",
        topics: ["AdWords Tools", "Performance Monitoring & Reporting", "AdWords API", "Google Display Network"],
      },
      {
        title: "SEO, Editing & Social Media",
        topics: [
          "Introduction to SEO with HTML",
          "Photo Editing",
          "Facebook, Instagram, Twitter, LinkedIn Account Management",
        ],
      },
    ],
  },

  "basic-to-advance-mehendi-masters-course": {
    curriculum: [
      {
        title: "Foundations",
        topics: [
          "Basic Knowledge",
          "Basic Lines",
          "Humps",
          "Dots",
          "Spiral",
          "Filler Elements",
          "Different Types Of Grid",
          "Check",
          "Borders",
          "Type Of Flowers",
        ],
      },
      {
        title: "Design Styles",
        topics: [
          "Semi Bridal",
          "Arabic Design",
          "Rajasthani Design",
          "Mandala Design",
          "Pakistani Design",
          "Dubai Style",
          "Floral Design",
          "Sanai",
          "Tabla",
          "etc.",
          "Agnikund",
          "Gachkouto",
          "Mukut",
          "Engagement Style",
          "Simple String Design",
        ],
      },
      {
        title: "Client & Business Skills",
        topics: ["Client Handling", "Cone Making", "Organic Mehendi Making"],
      },
    ],
  },

  "basic-to-advance-nail-extension-course": {
    curriculum: [
      {
        title: "Extension Foundations",
        topics: [
          "Product Knowledge",
          "Refilling",
          "Gel Extension",
          "Tip Application",
          "Acrylic Extension",
          "Remove",
          "Poly Gel Extensions",
          "Colour Acrylic Extension",
          "Poly Gel",
          "Soft Gel Extension",
        ],
      },
      {
        title: "Nail Art Techniques",
        topics: [
          "Chrome / Mirror",
          "French",
          "Transfer Foil Art",
          "Glitter Application",
          "Permanent Polish",
          "Stone Application",
          "3D Art (Flower)",
          "Pigment Art",
          "Flex Art",
          "Metallic Gel",
          "Cat Eye",
        ],
      },
      {
        title: "Advanced & Specialty Art",
        topics: [
          "Omra Nail Art",
          "Full Nail Glitter Art",
          "Dry Flower Art",
          "Isolated (Korean) Nail Art",
          "Blooming Art",
          "Glass Nail Art",
          "Bridal Nail Art",
          "Airbrush Nail Art",
          "5D Art",
          "Advanced Nail Art",
        ],
      },
    ],
  },

  "cake-bakery-course": {
    curriculum: [
      {
        title: "Cake Sponge Varieties",
        topics: [
          "Eggless Cake Sponge",
          "Vanilla Sponge",
          "Butterscotch Sponge",
          "Chocolate Sponge",
          "Mango Sponge",
          "Strawberry Sponge",
          "Pineapple Sponge",
          "Rasmalai Sponge",
          "With Egg Sponge Cake",
          "Premix Cake Sponge",
        ],
      },
    ],
  },
};
