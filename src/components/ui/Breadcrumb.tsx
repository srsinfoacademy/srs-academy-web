import Link from "next/link";

import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import type { BreadcrumbItem } from "@/types";

type BreadcrumbProps = {
  /** Trail excluding the Academy root, which is always prepended. */
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Breadcrumb trail in the technical index voice. The current page is marked
 * with aria-current and is not a link.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const trail: BreadcrumbItem[] = [{ label: "Academy", href: routes.home }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn("type-index", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? (
                <span aria-hidden="true" className="text-muted/60">
                  /
                </span>
              ) : null}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-[var(--srs-radius-xs)] text-muted",
                    "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                    "hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-secondary">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
