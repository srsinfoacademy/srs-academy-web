import type { LegalDocument } from "@/content/legal";

/**
 * The single legal-page template — flat, non-glass, calm reading layout
 * with a sticky section nav, per the Master Consolidation's "Legal Section
 * Nav" component and the glass-exclusion rule for dense text content.
 */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <div className="sl-container grid grid-cols-1 gap-10 py-14 min-[900px]:grid-cols-[200px_1fr] min-[900px]:py-18">
      <aside className="hidden min-[900px]:block">
        <nav aria-label="Section" className="sticky top-24 flex flex-col gap-2.5">
          {doc.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="sl-focus text-sm text-sl-ink/55 hover:text-sl-ink">
              {s.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="max-w-160">
        <h1 className="sl-h1 mb-2 text-[2rem]">{doc.title}</h1>
        <p className="mb-8 font-sl-mono text-xs text-sl-ink/45">Last updated: {doc.lastUpdated}</p>
        {doc.intro ? <p className="mb-8 text-[15px] leading-relaxed text-sl-ink/70">{doc.intro}</p> : null}
        <nav aria-label="Section" className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-sl-ink/10 py-4 min-[900px]:hidden">
          {doc.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="sl-focus text-sm font-medium text-sl-ink/60">
              {s.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-9">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="sl-h3 mb-2.5 text-lg">{s.label}</h2>
              <p className="text-[15px] leading-relaxed text-sl-ink/70">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
