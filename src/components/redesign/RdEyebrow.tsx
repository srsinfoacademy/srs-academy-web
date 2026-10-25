import { cn } from "@/lib/cn";

/** Uppercase kicker label above section headings. */
export function RdEyebrow({
  children,
  className,
  rule = false,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  /** Short accent rule before the label, as in the hero. */
  rule?: boolean;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-3 font-rd-sans text-[13.5px] font-semibold uppercase tracking-[0.1em] text-rd-eyebrow",
        className,
      )}
    >
      {rule ? <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-rd-accent" /> : null}
      <span>{children}</span>
    </Tag>
  );
}
