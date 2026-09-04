"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import { getThemeCounterpartUrl } from "@/lib/theme-route-map";

const SCROLL_SHOW_THRESHOLD = 450;

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function getHashSnapshot() {
  return window.location.hash;
}
function getHashServerSnapshot() {
  return "";
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 2.5v2.25M12 19.25v2.25M4.22 4.22l1.6 1.6M18.18 18.18l1.6 1.6M2.5 12h2.25M19.25 12h2.25M4.22 19.78l1.6-1.6M18.18 5.82l1.6-1.6"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19V5M6 11l6-6 6 6"
      />
    </svg>
  );
}

type Variant = "dark" | "light";

const surfaceClass: Record<Variant, string> = {
  dark: cn(
    "bg-black/55 border-white/10 text-[var(--srs-warm-050,#f2f4ef)]",
    "hover:border-lime/50 focus-visible:border-lime/60",
  ),
  light: cn(
    "bg-white/70 border-sl-ink/10 text-sl-ink",
    "hover:border-sl-lime/60 focus-visible:border-sl-lime/70",
  ),
};

/**
 * Small fixed bottom-right utility stack, mounted once per theme layout
 * (each passes its own `variant` so styling never crosses the dark/light
 * boundary). Theme switch reads the current URL and jumps to the mapped
 * counterpart route (see `getThemeCounterpartUrl`); back-to-top is a plain
 * scroll-position toggle.
 */
export function FloatingUtilityControls({ variant }: { variant: Variant }) {
  return (
    <Suspense fallback={null}>
      <FloatingUtilityControlsInner variant={variant} />
    </Suspense>
  );
}

function FloatingUtilityControlsInner({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeToHash, getHashSnapshot, getHashServerSnapshot);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > SCROLL_SHOW_THRESHOLD);
        raf = 0;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const search = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  const { url: counterpartUrl } = getThemeCounterpartUrl(pathname, search, hash);
  const isLight = variant === "light";

  function handleBackToTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  const buttonBase = cn(
    "flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md",
    "shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-200 ease-out",
    "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
    // Dark already gets a global two-tone focus-visible ring (base.css);
    // light opts each focusable element in via `.sl-focus` (light.css) —
    // mirror each theme's own convention instead of inventing a third one.
    isLight && "sl-focus",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
    surfaceClass[variant],
  );

  return (
    <div
      className="fixed right-5 z-40 flex flex-col items-center gap-2 sm:right-6"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
    >
      <Link
        href={counterpartUrl}
        aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
        className={cn(buttonBase, "group")}
      >
        <span className="transition-transform duration-200 ease-out group-hover:rotate-[15deg] group-focus-visible:rotate-[15deg] motion-reduce:group-hover:rotate-0 motion-reduce:group-focus-visible:rotate-0">
          {isLight ? <MoonIcon /> : <SunIcon />}
        </span>
      </Link>

      <button
        type="button"
        onClick={handleBackToTop}
        aria-label="Back to top"
        className={cn(
          buttonBase,
          "origin-bottom transition-[opacity,transform,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          showBackToTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1.5 opacity-0",
        )}
        tabIndex={showBackToTop ? 0 : -1}
        aria-hidden={!showBackToTop}
      >
        <ArrowUpIcon />
      </button>
    </div>
  );
}
