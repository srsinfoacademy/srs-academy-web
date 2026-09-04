/**
 * "Inside SRS" — vertical 9:16 media/reel section. Static poster imagery
 * only (per Master Consolidation: "Reel/story cards are static images with
 * a play affordance until real video is produced; never fabricate real
 * testimonial footage"). Photo IDs are reused, verified Unsplash IDs already
 * present elsewhere in the approved design set.
 */
export type ReelCard = {
  id: string;
  label: string;
  photo: string;
};

export const reelCards: ReelCard[] = [
  {
    id: "ai-learning",
    label: "AI learning",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "coding",
    label: "Coding practice",
    photo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "makeup",
    label: "Makeup practice",
    photo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "mehendi",
    label: "Mehendi artistry",
    photo: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "creative-skills",
    label: "Creative skills",
    photo: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "vocational",
    label: "Vocational training",
    photo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "working-professional",
    label: "Working-professional learning",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "corporate",
    label: "Corporate upskilling",
    photo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80",
  },
];
