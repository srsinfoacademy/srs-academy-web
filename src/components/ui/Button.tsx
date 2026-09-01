import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { ExternalIcon } from "@/components/ui/ExternalIcon";
import { cn } from "@/lib/cn";
import { isExternalHref } from "@/lib/routes";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const base = cn(
  "type-button relative inline-flex items-center justify-center gap-2",
  "border select-none",
  "transition-[background-color,border-color,color,transform] duration-[var(--srs-duration-fast)] ease-standard",
  "active:translate-y-px",
  "disabled:pointer-events-none aria-disabled:pointer-events-none",
  "disabled:opacity-45 aria-disabled:opacity-45",
);

const variantClass: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-lime text-on-accent border-lime font-semibold",
    "hover:bg-lime-hover hover:border-lime-hover",
    "active:bg-lime-active active:border-lime-active",
  ),
  // Lime on a 40% lime hairline — the outline treatment in the design set.
  secondary: cn(
    "bg-transparent text-lime border-[var(--srs-border-accent)] font-medium",
    "hover:border-lime hover:bg-lime/8",
    "active:bg-lime/12",
  ),
  ghost: cn(
    "bg-transparent text-secondary border-transparent",
    "hover:text-primary hover:bg-surface-2",
    "active:bg-surface-elevated",
  ),
};

/*
 * Control heights from the component sheet: 52px minimum for primary actions,
 * 60px for the large variant, 12px radius throughout. The 44px small size is
 * the absolute floor allowed by the accessibility handoff.
 */
const sizeClass: Record<ButtonSize, string> = {
  sm: cn("h-[var(--srs-control-sm)] px-4 text-[0.875rem]", "rounded-[var(--srs-radius-lg)]"),
  md: cn("h-[var(--srs-control-md)] px-6", "rounded-[var(--srs-radius-lg)]"),
  lg: cn("h-[var(--srs-control-lg)] px-8", "rounded-[var(--srs-radius-lg)]"),
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches to the container width; used by the mobile navigation. */
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  "aria-current"?: "page" | undefined;
  "aria-label"?: string;
};

type ButtonAsPending = CommonProps & {
  href?: undefined;
  /** Placeholder token shown while the destination is unresolved. */
  pending: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsPending;

function isLink(props: ButtonProps): props is ButtonAsLink {
  return typeof (props as ButtonAsLink).href === "string";
}

function isPending(props: ButtonProps): props is ButtonAsPending {
  return typeof (props as ButtonAsPending).pending === "string";
}

/**
 * The one button in the system. Renders as `a` when given an href, as a
 * disabled element when its destination is an unresolved placeholder, and as
 * `button` otherwise — so semantics always follow behaviour.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", block = false, className, children } = props;

  const classes = cn(
    base,
    variantClass[variant],
    sizeClass[size],
    block && "w-full",
    className,
  );

  if (isPending(props)) {
    return (
      <span
        className={classes}
        aria-disabled="true"
        data-pending-destination={props.pending}
        title={`Destination not yet confirmed: ${props.pending}`}
      >
        {children}
      </span>
    );
  }

  if (isLink(props)) {
    const { href, external, ...rest } = props;
    const outbound = external ?? isExternalHref(href);

    const content = (
      <>
        {children}
        {outbound ? (
          <>
            <ExternalIcon className="mt-px shrink-0" />
            <span className="sr-only-srs">(opens in a new tab)</span>
          </>
        ) : null}
      </>
    );

    if (outbound) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          aria-current={rest["aria-current"]}
          aria-label={rest["aria-label"]}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        aria-current={rest["aria-current"]}
        aria-label={rest["aria-label"]}
      >
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, block: _b, className: _c, children: _ch, ...rest } = props;

  return (
    <button type={rest.type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
