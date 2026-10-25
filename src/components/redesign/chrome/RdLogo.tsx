import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/**
 * Brand lockup used across the redesign chrome. The header shows the mark
 * plus the wordmark; `tone="inverse"` (the footer, on `bg-rd-inverse`) shows
 * the round logo, which already carries the wordmark.
 */
export function RdLogo({
  tone = "default",
  className,
}: {
  tone?: "default" | "inverse";
  className?: string;
}) {
  const { wordmark, mark, logoRound } = site.brand;

  if (tone === "inverse") {
    return (
      <Link
        href="/"
        aria-label={`${wordmark} home`}
        className={cn("inline-flex shrink-0 self-start rounded-full", className)}
      >
        <Image
          src={logoRound}
          alt={`${wordmark} logo`}
          width={112}
          height={112}
          sizes="112px"
          className="size-[112px]"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={`${wordmark} home`}
      className={cn("inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap", className)}
    >
      {/* Fixed box so the image never shifts the header; the disc only paints in dark mode. */}
      <span className="rd-mark-backdrop inline-flex size-11 shrink-0 items-center justify-center rounded-full">
        <Image
          src={mark}
          alt={`${wordmark} logo`}
          width={38}
          height={38}
          sizes="38px"
          preload
          className="size-[38px]"
        />
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="font-rd-sans text-[15px] font-semibold text-rd-ink">{wordmark}</span>
        {/* Hidden from 1180 to 1360px so the full desktop nav fits on one line. */}
        <span className="font-rd-sans text-[11.5px] text-rd-soft nav:hidden min-[1360px]:inline">
          by {site.organisation.legalName}
        </span>
      </span>
    </Link>
  );
}
