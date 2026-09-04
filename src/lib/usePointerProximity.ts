"use client";

import { useEffect, useRef } from "react";

/**
 * Restrained pointer-proximity offset for a container's decorative layers.
 *
 * Desktop only (>1024px, fine pointer, hover-capable) and disabled outright
 * under `prefers-reduced-motion: reduce` — this hook simply never attaches
 * the listener in either case, so there is nothing to unwind. Writes two CSS
 * custom properties (`--proximity-x` / `--proximity-y`, -1..1) on the
 * container element via rAF-throttled pointermove; consuming CSS decides how
 * far anything actually moves, which keeps every offset small and per-layer.
 *
 * Never attach this to headline, body copy or CTA elements — it is for
 * decorative geometry (network nodes, glow layers) only.
 */
export function usePointerProximity<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const capable = window.matchMedia(
      "(min-width: 64.0625rem) and (pointer: fine) and (hover: hover)",
    ).matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!capable || reduced) return;

    let frame = 0;

    function onMove(event: PointerEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el2 = ref.current;
        if (!el2) return;
        const rect = el2.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        el2.style.setProperty("--proximity-x", x.toFixed(3));
        el2.style.setProperty("--proximity-y", y.toFixed(3));
      });
    }

    function onLeave() {
      el?.style.setProperty("--proximity-x", "0");
      el?.style.setProperty("--proximity-y", "0");
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
