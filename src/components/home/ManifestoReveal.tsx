"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Manifesto's two-step reveal: the lead sentence resolves first (muted), then
 * the warm-white clause, then the lime clause — once, on first entry into the
 * viewport. Composed in its final state as children, so with JS disabled or
 * under reduced motion (which collapses the transition durations to 1ms at
 * the token level) the statement simply reads correctly with no stagger.
 */
export function ManifestoReveal({
  lead,
  resolve,
  emphasis,
}: {
  lead: ReactNode;
  resolve: ReactNode;
  emphasis: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 id="manifesto-title" ref={ref} className="type-h2 mt-8 max-w-[22ch]">
      <span
        data-revealed={revealed}
        className="reveal inline-block text-muted"
        style={{ transitionDelay: "0ms" }}
      >
        {lead}
      </span>{" "}
      <span
        data-revealed={revealed}
        className="reveal inline-block text-primary"
        style={{ transitionDelay: "160ms" }}
      >
        {resolve}
      </span>{" "}
      <span
        data-revealed={revealed}
        className="reveal inline-block text-lime"
        style={{ transitionDelay: "320ms" }}
      >
        {emphasis}
      </span>
    </h2>
  );
}
