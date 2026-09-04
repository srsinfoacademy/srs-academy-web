"use client";

import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";

const TAGS = {
  div: "div",
  dl: "dl",
  ol: "ol",
  ul: "ul",
  section: "section",
} as const;

type RevealTag = keyof typeof TAGS;

/**
 * Run-once scroll entrance for a Server Component subtree.
 *
 * Owns the wrapping element itself (via a small fixed tag map, `as`) instead
 * of cloning the children passed to it — children rendered by a Server
 * Component parent arrive here as an already-serialized element, and
 * `cloneElement`-ing that across the server/client boundary produces a
 * hydration mismatch (the clone's added props silently don't survive to the
 * client's first render). Rendering the tag directly here avoids that, and
 * — for `stagger`, which staggers this element's *own* direct children (a
 * handful of columns, stat cells, or stage cards, never a long list) — it
 * also means the class lands on the real container rather than a wrapper a
 * level above it.
 *
 * The element is always in the DOM; this only ever toggles `data-revealed`
 * once, on first entry into the viewport (see `.reveal` / `.reveal-stagger`
 * in utilities.css). Reduced motion collapses that transition to 1ms at the
 * token level, so no reduced-motion branch is needed here.
 */
export function Reveal({
  as = "div",
  stagger = false,
  className,
  children,
  ...rest
}: {
  as?: RevealTag;
  stagger?: boolean;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  const { ref, revealed } = useReveal<HTMLElement>();
  const Tag = TAGS[as] as ElementType;

  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
