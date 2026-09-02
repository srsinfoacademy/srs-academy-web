"use client";

import { cn } from "@/lib/cn";

/**
 * Category filter as a row of chips. Active state carries a node and
 * `aria-pressed` alongside the colour change, never colour alone.
 */
export function FilterChips({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="type-index" id={`${label}-label`}>
        {label}
      </p>
      <ul aria-labelledby={`${label}-label`} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;

          return (
            <li key={option}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onChange(option)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-[var(--srs-radius-sm)] border px-3",
                  "type-body-s",
                  "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                  active
                    ? "border-line-active bg-[rgb(216_255_94_/_0.07)] text-lime"
                    : "border-line text-secondary hover:border-line-strong",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    active ? "bg-lime" : "bg-transparent",
                  )}
                />
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
