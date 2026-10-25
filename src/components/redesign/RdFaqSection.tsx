import { RdButton } from "@/components/redesign/RdButton";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdFaqList } from "@/components/redesign/RdFaqList";
import { RdSection } from "@/components/redesign/RdSection";
import type { FaqEntry } from "@/content/faq";

/** FAQ block: heading column beside the accordion on wide screens, stacked on small ones. */
export function RdFaqSection({
  id,
  entries,
  tone = "plain",
  title = "Frequently asked questions",
}: {
  id: string;
  entries: FaqEntry[];
  tone?: "plain" | "muted";
  title?: string;
}) {
  return (
    <RdSection tone={tone} labelledBy={id}>
      <div data-reveal className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <RdEyebrow>FAQ</RdEyebrow>
          <h2
            id={id}
            className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink"
          >
            {title}
          </h2>
          <RdButton href="/faq" variant="text" className="mt-5">
            All questions <span aria-hidden="true">→</span>
          </RdButton>
        </div>
        <div className="max-w-[900px]">
          <RdFaqList entries={entries} group={id} />
        </div>
      </div>
    </RdSection>
  );
}
