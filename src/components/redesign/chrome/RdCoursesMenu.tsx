"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { isActivePath } from "@/components/redesign/chrome/RdNavLink";
import { coursePath } from "@/content/courses/paths";
import { cn } from "@/lib/cn";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 220;

export type CoursesMenuProgram = { slug: string; name: string; duration: string };
export type CoursesMenuCategory = { category: string; count: number };

/**
 * Desktop "Courses" mega menu (disclosure pattern).
 * - Mouse: opens on hover after a short intent delay and stays open while
 *   the pointer travels into the panel; closes shortly after leaving.
 * - Click / tap toggles. Enter and Space toggle (native button); ArrowDown
 *   opens and focuses the first link; Escape closes and returns focus;
 *   moving focus out closes it.
 */
export function RdCoursesMenu({
  programs,
  categories,
  totalCourses,
}: {
  programs: CoursesMenuProgram[];
  categories: CoursesMenuCategory[];
  totalCourses: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = isActivePath(pathname, "/courses");
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedByHover = useRef(false);

  // Close on route change (state adjusted during render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  function clearTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

  function schedule(next: boolean, delay: number) {
    clearTimer();
    timer.current = setTimeout(() => {
      openedByHover.current = next;
      setOpen(next);
    }, delay);
  }

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function focusFirstLink() {
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(`#${CSS.escape(panelId)} a`)?.focus());
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") schedule(true, open ? 0 : OPEN_DELAY);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") schedule(false, CLOSE_DELAY);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimer();
          // A click right after hover-open keeps the menu open instead of toggling it shut.
          if (open && openedByHover.current) {
            openedByHover.current = false;
            return;
          }
          openedByHover.current = false;
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            focusFirstLink();
          }
        }}
        className={cn(
          "rd-nav-underline inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-[15px] font-medium text-rd-ink transition-colors hover:text-rd-accent min-[1360px]:px-3",
          "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
          (open || active) && "is-active",
        )}
      >
        Courses
        <span aria-hidden="true" className={cn("text-[10px] transition-transform duration-200", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {/* pt-3 is a hover bridge: the pointer can cross the gap without leaving the menu. */}
      <div
        id={panelId}
        data-open={open}
        className={cn(
          "absolute left-1/2 top-full z-50 w-[min(680px,calc(100vw-48px))] -translate-x-1/2 pt-3",
          "origin-top transition-[opacity,transform,visibility] duration-200 ease-out",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.98] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100",
        )}
      >
        <div className="grid grid-cols-[1.1fr_1fr] gap-2 rounded-[16px] border border-rd-line bg-rd-elevated p-3 shadow-[var(--rd-shadow-raised)]">
          <div>
            <p className="px-3 pb-1 pt-2 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-rd-eyebrow">
              SRS programs
            </p>
            <ul>
              {programs.map((program) => (
                <li key={program.slug}>
                  <Link
                    href={coursePath(program.slug)}
                    className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-rd-ink transition-colors hover:bg-rd-muted focus-visible:outline focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-rd-accent"
                  >
                    <span className="text-[15px] font-semibold">{program.name}</span>
                    <span className="text-[13px] text-rd-soft">{program.duration}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[12px] bg-rd-muted p-2">
            <p className="px-2 pb-1 pt-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-rd-eyebrow">
              Course catalogue
            </p>
            <ul className="grid grid-cols-1">
              {categories.map((item) => (
                <li key={item.category}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(item.category)}`}
                    className="flex min-h-9 items-center justify-between gap-3 rounded-md px-2 text-[14.5px] text-rd-ink transition-colors hover:bg-rd-elevated hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-rd-accent"
                  >
                    {item.category}
                    <span className="text-[13px] text-rd-soft">{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/courses"
              className="mt-2 flex min-h-10 items-center rounded-md px-2 text-[14.5px] font-semibold text-rd-link hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-rd-accent"
            >
              View all {totalCourses} courses <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
