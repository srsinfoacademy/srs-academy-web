import { IndexLabel } from "@/components/ui/IndexLabel";
import { cn } from "@/lib/cn";
import type { PageSection } from "@/content/pages";

/**
 * The shared editorial body: a numbered section index, a heading, a
 * paragraph, and an optional list. Values and principles drop from two
 * columns to one at 768, as the design notes require.
 */
export function EditorialSections({
  sections,
  className,
}: {
  sections: PageSection[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-14", className)}>
      {sections.map((section) => (
        <section
          key={section.num}
          id={`section-${section.num}`}
          aria-labelledby={`section-${section.num}-title`}
          className="scroll-mt-28 border-t border-line-hairline pt-8"
        >
          <IndexLabel index={section.num} as="p">
            {section.heading}
          </IndexLabel>

          <h2 id={`section-${section.num}-title`} className="type-h3 mt-5 max-w-[24ch]">
            {section.heading}
          </h2>

          <p className="type-body measure mt-5">{section.body}</p>

          {section.list?.length ? (
            <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
              {section.list.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  className="grid grid-cols-[14px_1fr] items-baseline gap-3 border-b border-line-hairline pb-3"
                >
                  <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-lime/70" />
                  <span className="type-body-s">{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
