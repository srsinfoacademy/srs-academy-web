import Link from "next/link";

import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/**
 * Typographic mark used across the redesign chrome: "SRS." plus the
 * academy wordmark. `tone="inverse"` is for surfaces already painted with
 * `bg-rd-inverse` (the footer), where ink/soft text would disappear.
 */
export function RdLogo({
  tone = "default",
  className,
}: {
  tone?: "default" | "inverse";
  className?: string;
}) {
  const inverse = tone === "inverse";

  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap", className)}
    >
      <span
        className={cn(
          "font-rd-display text-[28px] font-semibold leading-none tracking-[-0.02em]",
          inverse ? "text-rd-inverse-text" : "text-rd-ink",
        )}
      >
        SRS<span className="text-rd-accent">.</span>
      </span>
      {inverse ? (
        <span className="font-rd-sans text-base font-semibold text-rd-inverse-text">
          {site.name}
        </span>
      ) : (
        <span className="flex flex-col items-start leading-tight">
          <span className="font-rd-sans text-[15px] font-semibold text-rd-ink">{site.name}</span>
          {/* Hidden from 1180 to 1360px so the full desktop nav fits on one line. */}
          <span className="font-rd-sans text-[11.5px] text-rd-soft nav:hidden min-[1360px]:inline">
            by {site.organisation.legalName}
          </span>
        </span>
      )}
    </Link>
  );
}
