"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

/** True when `pathname` is `href` or one of its descendants ("/" only matches itself). */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop header link with the 2px accent underline on the current route. */
export function RdNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-11 items-center whitespace-nowrap rounded-md border-b-2 px-2 text-[15px] font-medium text-rd-ink transition-colors hover:text-rd-accent min-[1360px]:px-3",
        "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
        active ? "border-rd-accent" : "border-transparent",
      )}
    >
      {children}
    </Link>
  );
}
