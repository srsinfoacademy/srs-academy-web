"use client";

import { useEffect, useState } from "react";

import { useTheme } from "@/components/theme/ThemeProvider";
import type { ThemeChoice } from "@/lib/theme";
import { cn } from "@/lib/cn";

const SHOW_BACK_TO_TOP_AFTER = 400;

const icons: Record<ThemeChoice | "top", React.ReactNode> = {
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  top: <path d="M12 19V5M5 12l7-7 7 7" />,
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

/** Tooltip shown on hover and keyboard focus; the button's aria-label carries the name. */
function Tip({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-rd-inverse px-2.5 py-1 text-[13px] font-medium text-rd-inverse-text opacity-0 shadow-[var(--rd-shadow-card)] transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}

const buttonBase =
  "group relative inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent";

const options: { value: ThemeChoice; label: string }[] = [
  { value: "light", label: "Light theme" },
  { value: "dark", label: "Dark theme" },
  { value: "system", label: "Match device theme" },
];

/**
 * Fixed bottom-right controls: icon-only Light / Dark / System switcher and
 * a Back to top button that appears after scrolling. Sits above the mobile
 * Courses / Enquire bar below the `nav:` breakpoint.
 */
export function RdFloatingControls() {
  const { choice, setChoice } = useTheme();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > SHOW_BACK_TO_TOP_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function backToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Keyboard users continue from the top of the page.
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  }

  return (
    <div className="fixed bottom-[calc(84px+env(safe-area-inset-bottom))] right-3 z-30 flex flex-col items-end gap-2.5 print:hidden nav:bottom-6 nav:right-6">
      <div
        role="group"
        aria-label="Colour theme"
        className="flex flex-col gap-1 rounded-full border border-rd-line bg-rd-elevated/95 p-1 shadow-[var(--rd-shadow-card)] backdrop-blur-sm"
      >
        {options.map((option) => {
          const active = choice === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={active}
              onClick={() => setChoice(option.value)}
              className={cn(
                buttonBase,
                active ? "bg-rd-inverse text-rd-inverse-text" : "text-rd-ink hover:bg-rd-muted",
              )}
            >
              <Icon name={option.value} />
              <Tip>{option.label}</Tip>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Back to top"
        onClick={backToTop}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={showTop ? undefined : true}
        className={cn(
          buttonBase,
          "size-11 border border-rd-line bg-rd-elevated/95 text-rd-ink shadow-[var(--rd-shadow-card)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-rd-line-hover",
          "transition-[opacity,transform,border-color] duration-200",
          showTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Icon name="top" />
        <Tip>Back to top</Tip>
      </button>
    </div>
  );
}
