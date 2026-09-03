/**
 * Canonical site-level content.
 *
 * Confirmed organisation facts are recorded here as supplied by SRS Academy.
 * Anything still in SQUARE BRACKETS remains an unresolved business fact and
 * must be supplied before launch. Nothing here may be invented: no
 * accreditation, affiliation, ranking, student count, testimonial, award,
 * partner, placement or recognition claim.
 */
export const site = {
  name: "SRS Academy",
  /** Compact wordmark used in the header and mobile navigation. */
  shortName: "SRS.",
  domain: "srstechacademy.com",
  url: "https://srstechacademy.com",
  locale: "en",
  /** Used by metadata; intentionally descriptive, never promotional. */
  tagline: "[OFFICIAL TAGLINE]",
  /**
   * Global meta description and Open Graph default. Kept concise for SEO —
   * the full company description lives on the About page.
   */
  description:
    "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD, offering practical, technology-focused learning programs online.",
  organisation: {
    legalName: "SPRS INFOTECH PVT LTD",
    relationship:
      "SRS Academy is the academic and training initiative of SPRS INFOTECH PVT LTD, created to extend its practical experience in technology, software development, digital products, and design into structured learning programs.",
    mission:
      "To make practical, technology-focused education accessible to learners who want to build relevant skills, understand modern digital tools, and turn knowledge into real-world capability.",
    vision:
      "To build a modern learning ecosystem where education, technology, practical experience, and continuous skill development work together to prepare learners for an evolving digital world.",
  },
  contact: {
    address: "5C, Webel More, Salt Lake City, Sector V, Kolkata",
    /** No confirmed Mumbai street address has been supplied — not invented. */
    locationSummary: "Kolkata · Mumbai · Online",
    email: "srsinfotechacademy@gmail.com",
    /**
     * Preserved exactly as supplied. Still requires human verification
     * before final launch.
     */
    phone: "+91-900007799",
  },
  /**
   * Portal destinations live outside this repository. They are read from the
   * environment so the public site never hard-codes an unconfirmed URL.
   */
  portals: {
    student: {
      label: "Student Portal",
      href: process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL || undefined,
      pending: "[STUDENT PORTAL URL]",
      external: true,
    },
    admin: {
      label: "Admin Portal",
      href: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || undefined,
      pending: "[ADMIN PORTAL URL]",
      external: true,
    },
  },
  copyrightHolder: "SPRS INFOTECH PVT LTD",
} as const;
