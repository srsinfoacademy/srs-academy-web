"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

import { useReveal } from "@/lib/light/useReveal";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "reveal" fades/rises; "mask" clips upward like a blind lifting. */
  variant?: "reveal" | "mask";
  delay?: number;
  style?: CSSProperties;
  [key: `aria-${string}`]: string | boolean | CSSProperties | undefined;
};

/** IntersectionObserver-driven scroll reveal. See `light.css` for the CSS side. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  variant = "reveal",
  delay = 0,
  style,
  ...rest
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  const cls = variant === "mask" ? "sl-mask-reveal" : "sl-reveal";

  return (
    <Tag
      ref={ref}
      className={`${cls} ${className ?? ""}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
