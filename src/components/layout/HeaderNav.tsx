"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { primaryNav } from "@/content/navigation";
import { cn } from "@/lib/cn";
import { isRouteActive } from "@/lib/routes";

/**
 * Desktop primary navigation. The active page is marked three ways — a lime
 * node, a colour change and aria-current — so state is never colour-only.
 */
export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center">
        {primaryNav.map((item) => {
          const href = item.href ?? "/";
          const active = isRouteActive(pathname, href);

          return (
            <li key={item.label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "type-nav relative inline-flex h-11 items-center gap-2 rounded-[var(--srs-radius-sm)]",
                  "px-2 xl:px-3",
                  "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                  active ? "text-primary" : "text-secondary hover:text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-[5px] shrink-0 rounded-full",
                    "transition-[background-color,opacity,transform] duration-[var(--srs-duration-base)] ease-entrance",
                    active
                      ? "bg-lime opacity-100"
                      : "bg-lime opacity-0 scale-50",
                  )}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
