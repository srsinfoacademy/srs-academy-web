"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { isActivePath } from "@/components/redesign/chrome/RdNavLink";
import { cn } from "@/lib/cn";
import { coursePath } from "@/content/courses/paths";
import type { Course } from "@/content/courses/types";

/**
 * Desktop "Courses" dropdown — the five SRS programs plus a link to the
 * full catalogue. Closes on Escape, an outside click, or losing focus.
 */
export function RdCoursesMenu({ programs }: { programs: Course[] }) {
  const [open, setOpen] = useState(false);
  const active = isActivePath(usePathname(), "/courses");
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
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

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-md border-b-2 px-2 text-[15px] font-medium text-rd-ink transition-colors min-[1360px]:px-3",
          "hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
          open || active ? "border-rd-accent" : "border-transparent",
        )}
      >
        Courses
        <span aria-hidden="true" className={cn("text-[10px] transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Courses"
          className="absolute left-[-12px] top-full z-50 mt-2 w-[340px] rounded-[14px] border border-rd-line bg-rd-elevated p-2.5 shadow-[0_18px_40px_-18px_rgba(22,33,58,0.28)]"
        >
          {programs.map((program) => (
            <Link
              key={program.slug}
              href={coursePath(program.slug)}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-rd-ink hover:bg-rd-muted"
            >
              <span className="text-[15px] font-semibold">{program.name}</span>
              <span className="text-[13px] text-rd-soft">{program.duration}</span>
            </Link>
          ))}
          <div className="mt-1.5 border-t border-rd-line pt-2.5">
            <Link
              href="/courses"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-1 text-[14.5px] font-semibold text-rd-link hover:text-rd-accent"
            >
              View all courses →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
