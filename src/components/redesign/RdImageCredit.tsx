import type { SiteImage } from "@/content/site";
import { cn } from "@/lib/cn";

/** Photographer credit for an Unsplash stand-in, overlaid on the image. */
export function RdImageCredit({ image, className }: { image: SiteImage; className?: string }) {
  return (
    <a
      href={image.creditHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "absolute bottom-2 left-2 z-[1] rounded-md bg-rd-inverse/85 px-2 py-0.5 text-[11.5px] leading-snug text-rd-inverse-text underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
        className,
      )}
    >
      {image.credit}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
