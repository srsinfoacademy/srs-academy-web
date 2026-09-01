/**
 * Canonical site-level content.
 *
 * Anything in SQUARE BRACKETS is an unresolved business fact and must be
 * supplied by SRS Academy before launch. Nothing here may be invented:
 * no accreditation, affiliation, ranking, student count, testimonial,
 * award, partner, placement or recognition claim.
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
  description: "[OFFICIAL COMPANY DESCRIPTION]",
  organisation: {
    legalName: "[OFFICIAL LEGAL ENTITY NAME]",
    relationship: "[SPRS INFOTECH RELATIONSHIP WORDING]",
    mission: "[MISSION]",
    vision: "[VISION]",
    values: "[VALUES]",
  },
  contact: {
    address: "[OFFICIAL ADDRESS]",
    email: "[CONTACT EMAIL]",
    phone: "[PHONE NUMBER]",
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
  copyrightHolder: "[OFFICIAL LEGAL ENTITY NAME]",
} as const;
