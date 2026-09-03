import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Two situations, deliberately worded differently: nothing matches the
 * current filters, or there is no content yet at all. Telling a reader
 * "no results" when the section has never had content is misleading.
 */
export function EmptyState({
  index = "No results",
  title,
  children,
  action,
  className,
}: {
  index?: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rise-in rounded-[var(--srs-radius-xl)] border border-line p-8 text-center sm:p-10",
        className,
      )}
    >
      <p className="type-index text-lime">{index}</p>
      <p className="type-body-l mt-4 text-primary">{title}</p>
      {children ? <div className="mt-3">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
