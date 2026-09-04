export type VibeId = "soft" | "dark" | "fresh" | "creative" | "chill";

export type Vibe = {
  id: VibeId;
  emoji: string;
  label: string;
};

/**
 * "Pick Your Vibe" — an optional homepage-originated control that re-tints
 * accent highlights and hero mood only. It never changes body text colour,
 * contrast ratios, or layout; the brand lime button and paper/ink base stay
 * fixed regardless of selection. See `src/app/light/light.css` for the
 * token swap this drives.
 */
export const vibes: Vibe[] = [
  { id: "soft", emoji: "🩷", label: "Soft" },
  { id: "dark", emoji: "🖤", label: "Dark" },
  { id: "fresh", emoji: "💚", label: "Fresh" },
  { id: "creative", emoji: "💜", label: "Creative" },
  { id: "chill", emoji: "💙", label: "Chill" },
];

export const defaultVibe: VibeId = "fresh";
export const vibeStorageKey = "srs-light-vibe";
