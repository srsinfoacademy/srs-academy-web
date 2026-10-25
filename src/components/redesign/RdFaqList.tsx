import type { FaqEntry } from "@/content/faq";

/**
 * Single-expand accordion without client JavaScript: `<details name>` makes
 * the group exclusive in current browsers, and older browsers still get a
 * working (multi-open) disclosure.
 */
export function RdFaqList({ entries, group }: { entries: FaqEntry[]; group: string }) {
  return (
    <div className="border-t border-rd-line">
      {entries.map((entry, index) => (
        <details key={entry.question} name={group} open={index === 0} className="group border-b border-rd-line">
          <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-semibold text-rd-ink transition-colors hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent [&::-webkit-details-marker]:hidden">
            <span>{entry.question}</span>
            <span aria-hidden="true" className="text-xl font-normal text-rd-soft">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p className="max-w-[68ch] pb-6 text-base leading-[1.65] text-rd-body">{entry.answer}</p>
        </details>
      ))}
    </div>
  );
}
