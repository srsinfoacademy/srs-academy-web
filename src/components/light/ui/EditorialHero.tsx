import { Reveal } from "@/components/light/ui/Reveal";

export function EditorialHero({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="sl-container py-14 min-[700px]:py-18">
      <Reveal className="max-w-160">
        <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          {kicker.toUpperCase()}
        </div>
        <h1 className="sl-h1 mb-4 text-[2.25rem] min-[700px]:text-[2.75rem]">{title}</h1>
        {intro ? <p className="text-[16px] leading-relaxed text-sl-ink/68">{intro}</p> : null}
        {children}
      </Reveal>
    </section>
  );
}
