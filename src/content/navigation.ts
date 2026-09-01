import { routes } from "@/lib/routes";
import { site } from "@/content/site";
import type { NavGroup, NavItem } from "@/types";

/**
 * Primary navigation, in the approved order. `Academy` is the home route —
 * the wordmark and the first nav item point at the same place, which is
 * intentional and is why the wordmark carries its own accessible name.
 */
export const primaryNav: NavItem[] = [
  { label: "Academy", href: routes.home, index: "01" },
  { label: "Programs", href: routes.programs, index: "02" },
  { label: "Admissions", href: routes.admissions, index: "03" },
  { label: "Resources", href: routes.resources, index: "04" },
  { label: "Updates", href: routes.updates, index: "05" },
  { label: "About", href: routes.about, index: "06" },
  { label: "Contact", href: routes.contact, index: "07" },
];

/** Sits apart from the primary nav in both the header and the overlay. */
export const portalNav: NavItem = {
  label: site.portals.student.label,
  href: site.portals.student.href,
  pending: site.portals.student.pending,
  external: true,
};

export const footerNav: NavGroup[] = [
  {
    title: "Academy",
    items: [
      { label: "About", href: routes.about },
      { label: "Programs", href: routes.programs },
      { label: "Admissions", href: routes.admissions },
      { label: "Resources", href: routes.resources },
    ],
  },
  {
    title: "Information",
    items: [
      { label: "Updates", href: routes.updates },
      { label: "FAQ", href: routes.faq },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Portals",
    items: [
      {
        label: site.portals.student.label,
        href: site.portals.student.href,
        pending: site.portals.student.pending,
        external: true,
      },
      {
        label: site.portals.admin.label,
        href: site.portals.admin.href,
        pending: site.portals.admin.pending,
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: routes.privacy },
      { label: "Terms & Conditions", href: routes.terms },
      { label: "Refund Policy", href: routes.refundPolicy },
      { label: "Accessibility", href: routes.accessibility },
    ],
  },
];

/** Condensed legal row, reused by the footer base and the mobile overlay. */
export const legalNav: NavItem[] = [
  { label: "Privacy", href: routes.privacy },
  { label: "Terms", href: routes.terms },
  { label: "Refund Policy", href: routes.refundPolicy },
  { label: "Accessibility", href: routes.accessibility },
];

/**
 * Human-readable labels for route segments, used to derive breadcrumbs
 * without repeating strings at every call site.
 */
export const routeLabels: Record<string, string> = {
  [routes.home]: "Academy",
  [routes.about]: "About",
  [routes.programs]: "Programs",
  [routes.admissions]: "Admissions",
  [routes.resources]: "Resources",
  [routes.updates]: "Updates",
  [routes.contact]: "Contact",
  [routes.faq]: "FAQ",
  [routes.privacy]: "Privacy Policy",
  [routes.terms]: "Terms & Conditions",
  [routes.refundPolicy]: "Refund Policy",
  [routes.accessibility]: "Accessibility",
};
