"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { lightRoutes } from "@/lib/light/routes";
import { LightButton } from "@/components/light/ui/LightButton";

const navItems = [
  { label: "Courses", href: lightRoutes.courses },
  { label: "Corporate Learning", href: lightRoutes.corporateLearning },
  { label: "Admissions", href: lightRoutes.admissions },
  { label: "About", href: lightRoutes.about },
  { label: "Contact", href: lightRoutes.contact },
];

/**
 * Fixed, transparent-to-glass header. One instance, used on every `/light`
 * page. Collapses to a slide-out drawer below 1180px per the Master
 * Consolidation spec.
 */
export function LightHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-[var(--sl-dur-fast)] ${
        scrolled ? "sl-glass shadow-[0_1px_0_rgba(17,17,17,.06)]" : "bg-transparent"
      }`}
    >
      <div className="sl-container flex h-18 items-center justify-between">
        <Link href={lightRoutes.home} className="sl-focus flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-sl-lime" aria-hidden="true" />
          <span className="font-sl-display text-xl font-bold tracking-tight">
            SRS Academy
            <span className="ml-1.5 align-middle font-sl-mono text-[10px] font-medium tracking-[0.1em] text-sl-ink/45">
              LIGHT PREVIEW
            </span>
          </span>
        </Link>

        <nav className="hidden min-[1180px]:flex items-center gap-8" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sl-focus text-sm font-medium text-sl-ink/72 hover:text-sl-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-[1180px]:flex items-center gap-3">
          <LightButton href={lightRoutes.admissions} size="sm" variant="secondary">
            Talk to an Advisor
          </LightButton>
          <LightButton href={lightRoutes.courses} size="sm" variant="dark">
            Explore Courses
          </LightButton>
        </div>

        <button
          type="button"
          className="sl-focus flex h-10 w-10 min-[1180px]:hidden items-center justify-center rounded-[var(--radius-sl-sm)] border border-sl-ink/15"
          aria-expanded={open}
          aria-controls="light-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-4.5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-sl-ink transition-transform duration-[var(--sl-dur-fast)] ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-full bg-sl-ink transition-opacity duration-[var(--sl-dur-fast)] ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-full bg-sl-ink transition-transform duration-[var(--sl-dur-fast)] ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="light-mobile-nav"
        className={`min-[1180px]:hidden fixed inset-x-0 top-18 bottom-0 bg-sl-paper transition-transform duration-[var(--sl-dur-med)] ease-[var(--sl-ease)] overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <nav
          className="sl-container flex flex-col gap-1 py-6"
          aria-label="Mobile"
          onClickCapture={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sl-focus rounded-[var(--radius-sl-md)] px-3 py-3.5 text-lg font-medium hover:bg-sl-ink/5"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <LightButton href={lightRoutes.admissions} variant="secondary" block>
              Talk to an Advisor
            </LightButton>
            <LightButton href={lightRoutes.courses} variant="dark" block>
              Explore Courses
            </LightButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
