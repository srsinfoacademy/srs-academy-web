import Link from "next/link";
import type { ReactNode } from "react";

import { ExternalIcon } from "@/components/ui/ExternalIcon";
import { cn } from "@/lib/cn";
import { isExternalHref } from "@/lib/routes";

type TextLinkTone = "default" | "muted" | "lime";

const toneClass: Record<TextLinkTone, string> = {
  default: "text-primary decoration-line-strong hover:decoration-lime",
  muted: "text-secondary decoration-line hover:text-primary hover:decoration-lime",
  lime: "text-lime decoration-lime/40 hover:decoration-lime",
};

type TextLinkProps = {
  href?: string;
  /** Placeholder token shown while the destination is unresolved. */
  pending?: string;
  external?: boolean;
  tone?: TextLinkTone;
  /** Removes the underline; the hover state then carries the affordance. */
  bare?: boolean;
  "aria-current"?: "page" | undefined;
  className?: string;
  children: ReactNode;
};

/**
 * Inline and list link. Underlined by default so that link identity never
 * relies on colour alone.
 */
export function TextLink({
  href,
  pending,
  external,
  tone = "default",
  bare = false,
  className,
  children,
  ...rest
}: TextLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-[var(--srs-radius-xs)]",
    "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
    bare ? "no-underline" : "underline underline-offset-[0.22em] decoration-1",
    toneClass[tone],
    className,
  );

  if (!href) {
    return (
      <span
        className={cn(classes, "cursor-not-allowed no-underline opacity-55")}
        aria-disabled="true"
        data-pending-destination={pending}
        title={pending ? `Destination not yet confirmed: ${pending}` : undefined}
      >
        {children}
      </span>
    );
  }

  const outbound = external ?? isExternalHref(href);

  const content = (
    <>
      {children}
      {outbound ? (
        <>
          <ExternalIcon className="shrink-0 opacity-70" />
          <span className="sr-only-srs">(opens in a new tab)</span>
        </>
      ) : null}
    </>
  );

  if (outbound) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-current={rest["aria-current"]}>
      {content}
    </Link>
  );
}
