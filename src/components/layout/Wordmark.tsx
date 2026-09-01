import Link from "next/link";

import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";

/**
 * `SRS.` wordmark with the lime node that opens it. The link carries an
 * explicit accessible name because "SRS." alone is not a destination.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-[var(--srs-radius-xs)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full bg-lime",
          "transition-transform duration-[var(--srs-duration-base)] ease-entrance",
          "group-hover:scale-125",
        )}
      />
      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-[-0.02em] text-primary">
        {site.shortName}
      </span>
    </Link>
  );
}
