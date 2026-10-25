import { RdContainer } from "@/components/redesign/RdContainer";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { cn } from "@/lib/cn";

/**
 * Hero band for inner pages: eyebrow, one H1, intro. `children` sits
 * below the intro (buttons, search, breadcrumb trail, …).
 */
export function RdPageHero({
  eyebrow,
  title,
  intro,
  children,
  before,
  titleClassName,
  lattice = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  /** Rendered above the eyebrow, e.g. a breadcrumb. */
  before?: React.ReactNode;
  titleClassName?: string;
  /** Faint 45° lattice motif (course headers). */
  lattice?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-b border-rd-line py-[clamp(40px,6vw,80px)]",
        lattice ? "rd-lattice bg-rd-muted" : "bg-rd-bg",
      )}
    >
      <RdContainer className="rd-hero">
        {before}
        {eyebrow ? <RdEyebrow rule>{eyebrow}</RdEyebrow> : null}
        <h1
          className={cn(
            "mt-4 max-w-[22ch] font-rd-display text-[clamp(38px,5vw,60px)] font-medium leading-[1.04] tracking-[-0.025em] text-rd-ink",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {intro ? (
          <div className="mt-5 max-w-[62ch] text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-rd-body">{intro}</div>
        ) : null}
        {children}
      </RdContainer>
    </section>
  );
}
