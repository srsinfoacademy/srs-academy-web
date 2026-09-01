import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type IndexLabelProps = {
  /** Optional two-digit technical index, e.g. "03". */
  index?: string;
  /** Renders the lime node marker that opens the label. */
  node?: boolean;
  tone?: "muted" | "primary" | "lime";
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
 * The technical voice of the Knowledge OS system: a mono, uppercase,
 * wide-tracked label used to index sections and metadata.
 */
export function IndexLabel({
  index,
  node = false,
  tone = "muted",
  as: Component = "span",
  className,
  children,
}: IndexLabelProps) {
  return (
    <Component className={cn("type-index inline-flex items-center gap-2", toneClass[tone], className)}>
      {node ? (
        <span
          aria-hidden="true"
          className="size-[5px] shrink-0 rounded-full bg-lime"
        />
      ) : null}
      {index ? <span className="text-lime">{index}</span> : null}
      <span>{children}</span>
    </Component>
  );
}
