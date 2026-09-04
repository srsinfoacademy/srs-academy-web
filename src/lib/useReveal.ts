"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Run-once scroll entrance. Returns a callback ref and a `revealed` flag to
 * spread onto the element that should transition in — see the `.reveal` /
 * `.reveal-stagger` utilities in utilities.css, which key off
 * `data-revealed`. The element is always in the DOM; this only ever adds an
 * attribute, so it never withholds content, and reduced motion (which
 * collapses the transition duration to 1ms at the token level) needs no
 * special case here.
 *
 * A callback ref rather than a cloned/wrapped element: the target element is
 * authored directly at the call site (often the actual Server Component
 * markup being animated), which sidesteps the identity issues that come from
 * cloning an element serialized across the server/client boundary.
 */
export function useReveal<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  const ref = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { ref, revealed };
}
