"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

import {
  THEME_STORAGE_KEY,
  applyThemeChoice,
  isThemeChoice,
  type ThemeChoice,
} from "@/lib/theme";

const THEME_EVENT = "srs-theme-change";

type ThemeContextValue = {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readChoice(): ThemeChoice {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeChoice(stored) ? stored : "system";
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onPreference = () => {
    applyThemeChoice(readChoice());
    onStoreChange();
  };
  media.addEventListener("change", onPreference);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => {
    media.removeEventListener("change", onPreference);
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

/**
 * Persists Light / Dark / System. The blocking script in the root layout
 * applies the saved choice before paint. This provider mirrors that choice
 * and follows the OS when the selection is System.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const choice = useSyncExternalStore(subscribe, readChoice, () => "system" as ThemeChoice);

  useEffect(() => {
    applyThemeChoice(readChoice());
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    // Cross-fade colours for this one change (reduced motion keeps it instant via redesign.css).
    const root = document.documentElement;
    root.classList.add("rd-theme-transition");
    window.setTimeout(() => root.classList.remove("rd-theme-transition"), 400);
    applyThemeChoice(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return <ThemeContext.Provider value={{ choice, setChoice }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
