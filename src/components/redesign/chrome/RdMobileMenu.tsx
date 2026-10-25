"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { RdButton } from "@/components/redesign/RdButton";
import { coursePath } from "@/content/courses/paths";
import type { Course } from "@/content/courses/types";
import { rdEnquireHref, rdPrimaryNav } from "@/content/redesign-nav";
import { cn } from "@/lib/cn";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Hamburger trigger plus the expanding mobile nav panel below the `nav:`
 * breakpoint. An inline disclosure (not a full-screen dialog), matching the
 * design: it pushes page content down rather than covering it.
 */
export function RdMobileMenu({
  programs,
  studentHref,
}: {
  programs: Course[];
  studentHref?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // A route change always closes the panel (state adjusted during render,
  // per https://react.dev/learn/you-might-not-need-an-effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === firstNode) {
        event.preventDefault();
        lastNode.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === lastNode) {
        event.preventDefault();
        firstNode.focus({ preventScroll: true });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="nav:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex min-h-11 items-center rounded-[10px] border border-rd-line-strong bg-rd-elevated px-4",
          "text-[15px] font-semibold text-rd-ink",
          "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
        )}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <nav
          id={panelId}
          ref={panelRef}
          aria-label="Main"
          className="absolute inset-x-0 top-full flex max-h-[calc(100vh-72px)] flex-col gap-0.5 overflow-auto border-t border-rd-line bg-rd-bg px-[clamp(20px,4vw,40px)] pb-6 pt-3"
        >
          {rdPrimaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-12 border-b border-rd-line py-3.5 text-[17px] font-medium text-rd-ink"
            >
              {item.isCourses ? "All Courses" : item.label}
            </Link>
          ))}

          <div className="mb-1.5 mt-5 text-[12.5px] font-semibold tracking-[0.1em] text-rd-eyebrow">
            COURSES
          </div>
          {programs.map((program) => (
            <Link
              key={program.slug}
              href={coursePath(program.slug)}
              className="min-h-11 py-2.5 text-base text-rd-body"
            >
              {program.name}
            </Link>
          ))}

          <RdButton href={rdEnquireHref} variant="accent" className="mt-4 w-full">
            Enquire Now
          </RdButton>
          {studentHref ? (
            <RdButton href={studentHref} variant="secondary" className="mt-2 w-full">
              Student Login
            </RdButton>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
