import { Reveal } from "@/components/light/ui/Reveal";
import type { PageSection } from "@/content/pages";

/** Reads dark-theme `PageSection[]` content, styled for the light system. */
export function EditorialSections({ sections }: { sections: PageSection[] }) {
  return (
    <div className="sl-container flex flex-col gap-10 pb-16 min-[700px]:gap-14 min-[700px]:pb-20">
      {sections.map((s) => (
        <Reveal key={s.num} className="grid grid-cols-1 gap-4 min-[800px]:grid-cols-[100px_1fr]">
          <div className="font-sl-mono text-sm text-sl-ink/35">{s.num}</div>
          <div className="max-w-160">
            <h2 className="sl-h3 mb-3 text-xl">{s.heading}</h2>
            <p className="mb-3 text-[15px] leading-relaxed text-sl-ink/70">{s.body}</p>
            {s.list ? (
              <ul className="flex flex-col gap-2.5">
                {s.list.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-sl-ink/68">
                    <span className="mt-0.5 shrink-0" style={{ color: "var(--sl-accent-text)" }} aria-hidden="true">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
