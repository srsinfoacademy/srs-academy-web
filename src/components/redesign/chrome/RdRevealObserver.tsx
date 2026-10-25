"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `.is-revealed` to `[data-reveal]` elements as they scroll into view
 * (CSS in redesign.css does the fade/slide). Re-scans on navigation and
 * when content is added later, e.g. "Show more courses".
 */
export function RdRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      pending().forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observeAll = () => pending().forEach((element) => observer.observe(element));
    observeAll();

    const main = document.getElementById("main-content");
    const mutations = new MutationObserver(observeAll);
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
