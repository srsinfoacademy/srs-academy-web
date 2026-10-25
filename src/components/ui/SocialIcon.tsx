import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  x: <path d="M5 5l14 14M19 5L5 19" />,
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M11 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M11 17.5c.4-1.3.7-2.6.8-3.4.1-.2.1-.5 0-.7-.4.2-.9.3-1.4.3-1.8 0-3.1-1.5-3.1-3.4 0-1.5 1.2-2.8 3.2-2.8 1.7 0 2.9 1.1 2.9 2.7 0 2-1 3.4-2.4 3.4-.6 0-1.1-.4-1-1 .1-.6.4-1.3.4-1.7 0-.4-.2-.7-.7-.7-.6 0-1 .6-1 1.4 0 .5.2 1 .2 1l-.8 3.2" />
    </>
  ),
};

export type SocialIconId = keyof typeof paths;

/**
 * Minimal line-icon glyphs for the "Follow us" footer row. Generic
 * outline renditions (in the spirit of common open-source icon sets),
 * not a reproduction of any platform's brand artwork.
 */
export function SocialIcon({ id, className }: { id: string; className?: string }) {
  const glyph = paths[id];
  if (!glyph) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </svg>
  );
}
