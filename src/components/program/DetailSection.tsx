import type { ReactNode } from "react";

import { IndexLabel } from "@/components/ui/IndexLabel";
import { cn } from "@/lib/cn";

/**
 * One titled block of the program detail template. The id is the anchor the
 * in-page navigation targets.
 */
export function DetailSection({
  id,
  index,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-28 border-t border-line-hairline pt-10", className)}
    >
      <IndexLabel index={index} as="p">
        {eyebrow}
      </IndexLabel>
      <h2 id={`${id}-title`} className="type-h3 mt-5">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Definition rows used by metadata, certification and fees. */
export function DetailRows({
  rows,
  columns = 2,
}: {
  rows: { label: string; value: string }[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-5",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
      )}
    >
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <dt className="type-index">{row.label}</dt>
          <dd className="type-body-s text-primary">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Bulleted list in the Knowledge OS voice — a lime node, never a disc. */
export function NodeList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="grid grid-cols-[14px_1fr] items-baseline gap-3">
          <span
            aria-hidden="true"
            className="mt-2 size-1.5 rounded-full bg-lime/70"
          />
          <span className="type-body-s">{item}</span>
        </li>
      ))}
    </ul>
  );
}
