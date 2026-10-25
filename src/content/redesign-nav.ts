/**
 * Public chrome navigation for the redesign. Route paths only — the facts
 * that fill a page (contact details, course names, …) still come from
 * site.ts and the course helpers.
 */

export type RdNavLink = { label: string; href: string };

/**
 * Header and mobile nav, in order. The "Courses" entry is rendered as a
 * dropdown on desktop (see RdCoursesMenu) and as a plain "All Courses" link
 * on mobile, where the five programs get their own section underneath.
 */
export const rdPrimaryNav: (RdNavLink & { isCourses?: boolean })[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses", isCourses: true },
  { label: "Technical Training", href: "/technical-training" },
  { label: "Admissions", href: "/admissions" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

export const rdFooterNavGroups: { heading: string; links: RdNavLink[] }[] = [
  {
    heading: "Academy",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Courses", href: "/courses" },
      { label: "Technical Training", href: "/technical-training" },
      { label: "Admissions", href: "/admissions" },
    ],
  },
  {
    heading: "Information",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Updates", href: "/updates" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

export const rdEnquireHref = "/contact";
