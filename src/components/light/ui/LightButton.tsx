import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-13 px-6 text-[15px]",
  lg: "h-15 px-8 text-[15px]",
};

const variantClass: Record<Variant, string> = {
  primary:
    "bg-sl-lime text-sl-ink font-semibold hover:brightness-95 active:brightness-90",
  dark: "bg-sl-ink text-sl-paper font-semibold hover:bg-black active:bg-black",
  secondary:
    "bg-transparent text-sl-ink font-medium border border-sl-ink/20 hover:border-sl-ink/40 hover:bg-sl-ink/5",
  ghost: "bg-transparent text-sl-ink/70 font-medium hover:text-sl-ink hover:bg-sl-ink/5",
};

const base =
  "sl-focus inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sl-md)] transition-[transform,background-color,border-color,filter] duration-[var(--sl-dur-fast)] ease-[var(--sl-ease)] active:translate-y-px select-none";

type Common = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string; external?: boolean; pending?: undefined };
type AsPending = Common & { href?: undefined; pending: string };
type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
    pending?: undefined;
  };

export type LightButtonProps = AsLink | AsPending | AsButton;

function isLink(p: LightButtonProps): p is AsLink {
  return typeof (p as AsLink).href === "string";
}
function isPending(p: LightButtonProps): p is AsPending {
  return typeof (p as AsPending).pending === "string";
}

/**
 * The light-theme button. Mirrors the dark theme's `pending` pattern (see
 * `src/components/ui/Button.tsx`): a destination not yet confirmed renders
 * as a disabled, clearly-labelled element rather than a dead `#` link.
 */
export function LightButton(props: LightButtonProps) {
  const { variant = "primary", size = "md", block, className, children } = props;
  const classes = `${base} ${variantClass[variant]} ${sizeClass[size]} ${block ? "w-full" : ""} ${className ?? ""}`;

  if (isPending(props)) {
    return (
      <span
        className={`${classes} opacity-50 cursor-not-allowed`}
        aria-disabled="true"
        title={`Destination not yet confirmed: ${props.pending}`}
      >
        {children}
      </span>
    );
  }

  if (isLink(props)) {
    const { href, external } = props;
    if (external || /^https?:\/\//.test(href)) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, block: _b, className: _c, children: _ch, ...rest } = props as AsButton;
  void _v;
  void _s;
  void _b;
  void _c;
  void _ch;

  return (
    <button type={rest.type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
