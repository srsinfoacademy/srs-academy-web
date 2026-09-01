import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type IndexLabelProps = {
  /** Optional two-digit technical index, e.g. "03". */
  index?: string;
  /** Renders the lime node marker that opens the label. */
  node?: boolean;
  tone?: "muted" | "primary" | "lime";
  /**
   * Section-index treatment from the design set: the label is followed by a
   * hairline rule running to the end of the column.
   */
  rule?: boolean;
  as?: "span" | "p" | "div";
  className?: string;
  children: ReactNode;
};

const toneClass = {
  muted: "text-muted",
  primary: "text-primary",
  lime: "text-lime",
} as const;

/**
 * The technical voice of the Knowledge OS system.
 *
 * Format is always `NN / WORD`, one per section, never nested. The handoff
 * requires it to be aria-hidden: it is a visual index, and the real heading
 * always sits beside it, so exposing it would duplicate the section name.
 */
export function IndexLabel({
  index,
  node = false,
  tone = "muted",
  rule = false,
  as: Component = "span",
  className,
  children,
}: IndexLabelProps) {
  return (
    <Component
      aria-hidden="true"
      className={cn(
        "type-index items-center gap-2",
        rule ? "flex tracking-[var(--srs-tracking-section)]" : "inline-flex",
        toneClass[tone],
        className,
      )}
    >
      {node ? (
        <span
          aria-hidden="true"
          className="size-[5px] shrink-0 rounded-full bg-lime"
        />
      ) : null}
      {index ? (
        <>
          <span className="text-lime">{index}</span>
          <span aria-hidden="true" className="text-muted">
            /
          </span>
        </>
      ) : null}
      <span>{children}</span>
      {rule ? (
        <span aria-hidden="true" className="ml-1 h-px flex-1 bg-line-hairline" />
      ) : null}
    </Component>
  );
}
