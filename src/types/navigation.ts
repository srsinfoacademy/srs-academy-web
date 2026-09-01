export type NavItem = {
  /** Visible label. */
  label: string;
  /**
   * Destination. Left undefined when the URL is not yet confirmed — the link
   * primitives then render a non-interactive placeholder rather than a dead
   * `#` link, which would fail keyboard and screen-reader expectations.
   */
  href?: string;
  /** Renders the external affordance and sets rel/target. */
  external?: boolean;
  /** Placeholder token shown while `href` is unresolved. */
  pending?: string;
  /** Short description, used by the mobile overlay and future mega-nav. */
  description?: string;
  /** Two-digit technical index shown in the Knowledge OS voice. */
  index?: string;
};

export type NavGroup = {
  /** Group title, rendered as an index label. */
  title: string;
  items: NavItem[];
};

export type BreadcrumbItem = {
  label: string;
  /** Omitted on the current page, which is rendered as plain text. */
  href?: string;
};
