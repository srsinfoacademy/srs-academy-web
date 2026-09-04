"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `.is-in` to the element once it enters the viewport, and immediately
 * (no observation) when the visitor prefers reduced motion — the CSS side
 * (`sl-reveal`, `sl-mask-reveal`, `sl-line-draw`) then renders the same
 * finished state either way, per the reduced-motion architecture used across
 * this repo.
 */
export function useReveal<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
