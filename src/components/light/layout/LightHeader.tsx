"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { lightRoutes } from "@/lib/light/routes";
import { LightButton } from "@/components/light/ui/LightButton";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    // 24px, not a hair-trigger 8px: the header should settle into its
    // compact state once scrolling is clearly underway, not on the first
    // pixel of rubber-band bounce.
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  /*
   * Move focus into the panel on open and back to the trigger on close —
   * guarded by wasOpenRef so mounting the header (open: false) never steals
   * focus onto the trigger button before anyone has opened anything.
   */
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Escape closes the panel; Tab cycling is trapped inside it while open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-[var(--sl-dur-fast)] ease-[var(--sl-ease)] ${
        scrolled ? "sl-glass shadow-[0_1px_0_rgba(17,17,17,.06)]" : "bg-transparent"
      }`}
    >
      {/*
        Compacting header: roomy (72px) at the top of the page, settling to
        a tighter 64px once scrolled — the height the reference design shows
        throughout. Height/padding animate together via the row's own
        height (flex + items-center derives the padding), so nothing needs
        a separate padding transition.
      */}
      <div
        className={`sl-container flex items-center justify-between transition-[height] duration-[var(--sl-dur-fast)] ease-[var(--sl-ease)] ${
          scrolled ? "h-16" : "h-18"
        }`}
      >
        <Link href={lightRoutes.home} className="sl-focus flex items-center gap-2.5">
          <span
            className={`rounded-full bg-sl-lime transition-[width,height] duration-[var(--sl-dur-fast)] ease-[var(--sl-ease)] ${
              scrolled ? "h-1.5 w-1.5" : "h-2 w-2"
            }`}
            aria-hidden="true"
          />
          <span
            className={`font-sl-display font-bold tracking-tight transition-transform duration-[var(--sl-dur-fast)] ease-[var(--sl-ease)] origin-left ${
              scrolled ? "text-xl scale-[0.92]" : "text-xl scale-100"
            }`}
          >
            SRS Academy
          </span>
        </Link>

        <nav className="hidden min-[1180px]:flex items-center gap-8" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`sl-focus relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-sl-ink after:transition-transform after:duration-[var(--sl-dur-fast)] after:ease-[var(--sl-ease)] hover:after:scale-x-100 focus-visible:after:scale-x-100 ${
                  active ? "text-sl-ink after:scale-x-100" : "text-sl-ink/72 hover:text-sl-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className={`hidden min-[1180px]:flex items-center gap-3 transition-transform duration-[var(--sl-dur-fast)] ease-[var(--sl-ease)] origin-right ${
            scrolled ? "scale-95" : "scale-100"
          }`}
        >
          <LightButton href={lightRoutes.admissions} size="sm" variant="secondary">
            Talk to an Advisor
          </LightButton>
          <LightButton href={lightRoutes.courses} size="sm" variant="dark">
            Explore Courses
          </LightButton>
        </div>

        <button
          ref={triggerRef}
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`min-[1180px]:hidden fixed inset-x-0 bottom-0 bg-sl-paper transition-[transform,top] duration-[var(--sl-dur-med)] ease-[var(--sl-ease)] overflow-y-auto ${
          scrolled ? "top-16" : "top-18"
        } ${open ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
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
