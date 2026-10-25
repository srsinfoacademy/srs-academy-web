import { RdContainer } from "@/components/redesign/RdContainer";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { cn } from "@/lib/cn";

const tones = {
  plain: "bg-rd-bg",
  muted: "bg-rd-muted",
  elevated: "bg-rd-elevated",
} as const;

/** Full-width page section with the design's fluid vertical rhythm. */
export function RdSection({
  children,
  tone = "plain",
  className,
  id,
  labelledBy,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("border-b border-rd-line py-[clamp(56px,8vw,104px)]", tones[tone], className)}
    >
      <RdContainer>{children}</RdContainer>
    </section>
  );
}

/** Eyebrow + H2 (+ intro) with an optional action aligned right on wide screens. */
export function RdSectionHeading({
  id,
  eyebrow,
  title,
  intro,
  action,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-[680px]">
        {eyebrow ? <RdEyebrow>{eyebrow}</RdEyebrow> : null}
        <h2
          id={id}
          className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink"
        >
          {title}
        </h2>
        {intro ? <p className="mt-4 text-[17px] leading-[1.6] text-rd-body">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
