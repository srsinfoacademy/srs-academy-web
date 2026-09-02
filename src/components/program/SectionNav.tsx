"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { detailSections } from "@/content/program-detail";

/**
 * In-page section navigation.
 *
 * A sticky rail from 1280 up; below that it collapses to a native disclosure,
 * following the "desktop sticky / mobile disclosure" pattern the design set
 * uses for its section navigation. It is never a wide horizontal scroller.
 *
 * The active section is tracked with an IntersectionObserver rather than
 * scroll maths, and `scroll-padding-top` on the document keeps a jumped-to
 * heading clear of the compact header, so focus is never obscured.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(detailSections[0].id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const targets = detailSections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      // Bias the band towards the top of the viewport so the highlighted
      // section is the one being read, not the one merely on screen.
      { rootMargin: "-96px 0px -55% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const links = (
    <ul className="flex flex-col">
      {detailSections.map((section) => {
        const isActive = active === section.id;

        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[var(--srs-radius-sm)] px-2",
                "type-body-s",
                "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                isActive ? "text-primary" : "text-muted hover:text-secondary",
              )}
            >
              {/* Active state carries a marker as well as colour. */}
              <span
                aria-hidden="true"
                className={cn(
                  "h-px w-4 shrink-0 transition-all duration-[var(--srs-duration-fast)]",
                  isActive ? "bg-lime" : "bg-line-strong",
                )}
              />
              {section.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile and tablet: a native disclosure, not a horizontal scroller. */}
      <div className="xl:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="section-nav-panel"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-4",
            "rounded-[var(--srs-radius-md)] border border-line px-4",
            "type-index text-secondary",
          )}
        >
          On this page
          <span
            aria-hidden="true"
            className={cn(
              "text-lg text-lime transition-transform duration-[var(--srs-duration-fast)]",
              open && "rotate-45",
            )}
          >
            +
          </span>
        </button>
        <nav id="section-nav-panel" hidden={!open} aria-label="On this page" className="mt-3">
          {links}
        </nav>
      </div>

      {/* Desktop: sticky rail. */}
      <nav
        aria-label="On this page"
        className="hidden xl:sticky xl:top-[calc(var(--srs-header-height-compact)+2rem)] xl:block"
      >
        <p className="type-index mb-4">On this page</p>
        {links}
      </nav>
    </>
  );
}
