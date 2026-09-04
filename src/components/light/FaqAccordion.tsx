"use client";

import { useMemo, useState } from "react";

import { faqCategories, faqEntries, type FaqCategory } from "@/content/faq";

export function FaqAccordion() {
  const [category, setCategory] = useState<FaqCategory>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => faqEntries.filter((f) => category === "All" || f.category === category),
    [category],
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2.5" role="tablist" aria-label="FAQ category">
        {faqCategories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => {
              setCategory(c);
              setOpenIndex(null);
            }}
            className={`sl-focus rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[var(--sl-dur-fast)] ${
              category === c ? "bg-sl-ink text-sl-paper" : "border border-sl-ink/15 bg-white text-sl-ink hover:border-sl-ink/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((f, i) => {
          const open = openIndex === i;
          return (
            <div key={f.question} className="rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="sl-focus flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[15px] font-semibold">{f.question}</span>
                <span
                  className={`shrink-0 text-lg text-sl-ink/50 transition-transform duration-[var(--sl-dur-fast)] ${open ? "rotate-45" : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {open ? (
                <p className="px-5 pb-4.5 text-sm leading-relaxed text-sl-ink/68">{f.answer}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
