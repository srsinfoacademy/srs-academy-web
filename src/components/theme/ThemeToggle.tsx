"use client";

import { useId, useState } from "react";

import { useTheme } from "@/components/theme/ThemeProvider";
import { themeChoices, type ThemeChoice } from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * Light / Dark / System control for the redesign header and mobile menu.
 * Not mounted on the current Knowledge OS header — add it there when that
 * header is replaced.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { choice, setChoice } = useTheme();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const label = themeChoices.find((item) => item.value === choice)?.label ?? "System";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-rd-line-strong bg-rd-elevated px-3 text-[15px] font-semibold text-rd-ink"
      >
        <span className="text-rd-soft">Theme</span>
        <span>{label}</span>
      </button>
      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label="Colour theme"
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-[12px] border border-rd-line bg-rd-elevated py-1 shadow-[0_18px_40px_-18px_rgba(22,33,58,0.28)]"
        >
          {themeChoices.map((item) => (
            <li key={item.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={choice === item.value}
                onClick={() => {
                  setChoice(item.value as ThemeChoice);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-11 w-full items-center px-3 text-left text-[15px] text-rd-ink",
                  choice === item.value ? "bg-rd-muted font-semibold" : "hover:bg-rd-muted",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
