"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { defaultVibe, vibeStorageKey, type VibeId } from "@/content/light/vibes";

type VibeContextValue = {
  vibe: VibeId;
  setVibe: (vibe: VibeId) => void;
};

const VibeContext = createContext<VibeContextValue | null>(null);

/**
 * Wraps the entire `/light` tree. Persists the visitor's "Pick Your Vibe"
 * choice to `localStorage` (per-browser, never shared) and stamps
 * `data-vibe` on the wrapper element that `light.css` reads to retint
 * `--sl-accent`. Defaults to "fresh" (brand lime) on first visit and on any
 * environment where storage is unavailable.
 */
export function VibeProvider({ children }: { children: ReactNode }) {
  const [vibe, setVibeState] = useState<VibeId>(defaultVibe);

  useEffect(() => {
    // One-time sync from localStorage on mount — deliberately not derivable
    // from props/state, since the value only exists in the browser and must
    // stay SSR-safe (server always renders the default vibe).
    try {
      const stored = window.localStorage.getItem(vibeStorageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only hydration of a persisted preference, not a derived value
      if (stored) setVibeState(stored as VibeId);
    } catch {
      /* storage unavailable — keep the default vibe */
    }
  }, []);

  const setVibe = useCallback((next: VibeId) => {
    setVibeState(next);
    try {
      window.localStorage.setItem(vibeStorageKey, next);
    } catch {
      /* per-viewer convenience only — safe to drop silently */
    }
  }, []);

  return (
    <VibeContext.Provider value={{ vibe, setVibe }}>
      <div className="srs-light" data-vibe={vibe}>
        {children}
      </div>
    </VibeContext.Provider>
  );
}

export function useVibe(): VibeContextValue {
  const ctx = useContext(VibeContext);
  if (!ctx) throw new Error("useVibe must be used within VibeProvider");
  return ctx;
}
