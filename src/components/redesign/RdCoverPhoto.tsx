"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";

import { RdImageCredit } from "@/components/redesign/RdImageCredit";
import type { SiteImage } from "@/content/site";

/**
 * The photo inside a course cover frame. If the image fails to load it
 * swaps in `fallback` (the generated cover), including a failure that
 * happened before hydration, so a card never shows a broken image.
 */
export function RdCoverPhoto({
  image,
  sizes,
  frameClassName,
  fallback,
}: {
  image: SiteImage;
  sizes: string;
  frameClassName: string;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth === 0 && img.currentSrc) setFailed(true);
  }, []);

  if (failed) return fallback;

  return (
    <div className={frameClassName}>
      <Image
        ref={checkLoaded}
        src={image.src}
        alt={image.alt}
        fill
        loading="lazy"
        sizes={sizes}
        onError={() => setFailed(true)}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
      />
      {image.credit && image.creditHref ? <RdImageCredit image={image} className="max-w-[calc(100%-1rem)] truncate" /> : null}
    </div>
  );
}
