"use client";

import { cn } from "@/lib/cn";

/**
 * Print action. A real button rather than a styled link, because it performs
 * an action rather than navigating. Hidden from the printed output itself.
 */
export function PrintLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        "type-index inline-flex min-h-11 items-center gap-2 rounded-[var(--srs-radius-sm)] px-2",
        "text-lime transition-colors duration-[var(--srs-duration-fast)] ease-standard",
        "hover:text-lime-hover print:hidden",
        className,
      )}
    >
      <span aria-hidden="true">↓</span>
      Print this page
    </button>
  );
}
