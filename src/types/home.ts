/** The five Knowledge OS nodes, shared by the hero and the learning journey. */
export type StageId = "discover" | "learn" | "build" | "prove" | "advance";

export type KnowledgeNode = {
  id: StageId;
  /** Node label, always uppercase in the Knowledge OS voice. */
  short: string;
  blurb: string;
  /** Related destinations, shown beside the active node. */
  links: string[];
  /** Position within the hero network, as percentages of its box. */
  x: number;
  y: number;
};

export type Program = {
  /** Two-digit index shown in the explorer list. */
  num: string;
  slug: string;
  name: string;
  category: string;
  level: string;
  /** Structural motif used by the preview panel. */
  visualType: "grid" | "nodes" | "signals" | "direction" | "modular";
  artLabel: string;
  shortDescription: string;
  /** Stages this program moves through, drawn from the node system. */
  pathway: string[];
  meta: { label: string; value: string }[];
};

export type SystemStage = {
  id: StageId;
  num: string;
  name: string;
  title: string;
  body: string;
  short: string;
  tags: string[];
  relation: string;
};

export type Statistic = {
  /** Placeholder glyph. Never animated — see the statistics section. */
  value: string;
  label: string;
};
