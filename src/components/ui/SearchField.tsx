"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";

/**
 * Labelled search input with a clear button. A native `type="search"` field:
 * keyboard behaviour, mobile keyboards and screen-reader support arrive
 * correct without a library.
 */
export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  className,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-index">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-11 w-full rounded-[var(--srs-radius-md)] border border-line bg-surface-2",
            "pl-3 pr-10 type-body-s text-primary placeholder:text-muted",
            "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
            "hover:border-line-strong focus-visible:border-lime",
          )}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className={cn(
              "rise-in absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center",
              "rounded-[var(--srs-radius-sm)] text-muted hover:text-primary",
              "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
            )}
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only-srs">Clear search</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
