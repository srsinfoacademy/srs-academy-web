import type { SharedCategory } from "@/content/catalogue/types";

/**
 * The shared academy taxonomy — the same 9 categories already used by the
 * light theme's catalogue (`src/content/light/courses.ts`, prior to this
 * file), plus Food & Baking, added because the source spreadsheet has no
 * category that fits Cake Bakery Course otherwise (approved decision).
 *
 * Both `/programs` (dark) and `/light/courses` (light) read this same list —
 * see `helpers.ts` for how each theme adapts it to its own visual system.
 */
export const sharedCategories: SharedCategory[] = [
  { id: "tech", label: "AI & Technology", emoji: "🤖", tint: "rgba(59,130,246,.12)" },
  { id: "webdev", label: "Web & Software Development", emoji: "💻", tint: "rgba(182,245,66,.16)" },
  { id: "business", label: "Digital & Business Skills", emoji: "💼", tint: "rgba(139,92,246,.12)" },
  { id: "beauty", label: "Beauty & Makeup", emoji: "💄", tint: "rgba(255,183,213,.28)" },
  { id: "creative", label: "Mehendi & Creative Arts", emoji: "🌿", tint: "rgba(255,90,95,.14)" },
  { id: "fashion", label: "Fashion & Lifestyle", emoji: "👗", tint: "rgba(255,90,95,.13)" },
  { id: "trades", label: "Technical & Skilled Trades", emoji: "🛠️", tint: "rgba(59,130,246,.12)" },
  { id: "career", label: "Communication & Career Skills", emoji: "🗣️", tint: "rgba(182,245,66,.14)" },
  { id: "corporate", label: "Professional & Corporate Learning", emoji: "🏢", tint: "rgba(139,92,246,.14)" },
  { id: "food", label: "Food & Baking", emoji: "🎂", tint: "rgba(255,159,67,.16)" },
];

export function sharedCategoryOf(id: string | null): SharedCategory | undefined {
  return sharedCategories.find((c) => c.id === id);
}

/**
 * Dark's Knowledge OS preview art has exactly 5 structural motifs
 * (`grid`/`nodes`/`signals`/`direction`/`modular` — see
 * `src/components/home/ProgramArt.tsx`). Rather than inventing a 10th motif,
 * each of the 10 shared categories reuses one of the existing 5, chosen for
 * a loose thematic fit. This is a data mapping, not a new visual asset.
 */
export const categoryVisual: Record<
  SharedCategory["id"],
  { visualType: "grid" | "nodes" | "signals" | "direction" | "modular"; artLabel: string }
> = {
  webdev: { visualType: "grid", artLabel: "MODULAR GRID ARCHITECTURE" },
  tech: { visualType: "nodes", artLabel: "NODES & RELATIONSHIPS" },
  business: { visualType: "direction", artLabel: "DIRECTIONAL STRUCTURE" },
  corporate: { visualType: "direction", artLabel: "DIRECTIONAL STRUCTURE" },
  career: { visualType: "signals", artLabel: "SYSTEMS & SIGNALS" },
  beauty: { visualType: "modular", artLabel: "MODULAR SIGNALS" },
  creative: { visualType: "modular", artLabel: "MODULAR SIGNALS" },
  fashion: { visualType: "modular", artLabel: "MODULAR SIGNALS" },
  trades: { visualType: "signals", artLabel: "SYSTEMS & SIGNALS" },
  food: { visualType: "modular", artLabel: "MODULAR SIGNALS" },
};
