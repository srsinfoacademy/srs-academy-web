export type ProgramLevel = "[LEVEL]" | "Foundation" | "Intermediate" | "Advanced";

export type CategorySlug =
  | "web-software-development"
  | "artificial-intelligence"
  | "technology-programs"
  | "business-entrepreneurship"
  | "digital-skills";

/** Structural motif family. Each category owns one. */
export type VisualType = "grid" | "nodes" | "signals" | "direction" | "modular";

export type ProgramCategory = {
  slug: CategorySlug;
  num: string;
  name: string;
  /** Short label used by the index rail and the preview. */
  label: string;
  visualType: VisualType;
  artLabel: string;
};

export type Program = {
  num: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  level: string;
  mode: string;
  duration: string;
  eligibility: string;
  /** Admissions status. Rendered with text, never colour alone. */
  status: "open" | "upcoming" | "pending";
  visualType: VisualType;
  artLabel: string;
  /** Stages this program moves through, drawn from the node system. */
  pathway: string[];
};
