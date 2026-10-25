import Link from "next/link";

import { cn } from "@/lib/cn";

const styles = {
  accent: "bg-rd-accent text-rd-on-accent hover:bg-rd-accent-hover",
  primary: "bg-rd-inverse text-rd-inverse-text hover:bg-rd-inverse-hover",
  secondary: "border border-rd-line-strong bg-rd-elevated text-rd-ink hover:border-rd-ink",
  text: "min-h-11 bg-transparent text-rd-link hover:text-rd-accent",
} as const;

type Variant = keyof typeof styles;

const base =
  "inline-flex items-center justify-center gap-1 rounded-[10px] text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent";

export function RdButton({
  href,
  variant = "accent",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  href?: string;
  variant?: Variant;
}) {
    // Defaults only when the caller does not set its own (Tailwind cannot order conflicting utilities).
  const custom = className ?? "";
  const classes = cn(
    base,
    styles[variant],
    variant !== "text" && !/(^|\s)px-/.test(custom) && "px-5",
    variant !== "text" && !/(^|\s)min-h-/.test(custom) && "min-h-12",
    className,
  );
  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
