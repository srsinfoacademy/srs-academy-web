/**
 * Course catalogue content for the light-theme preview.
 *
 * Taxonomy and course set are taken from `SRS Light Theme Phase 2 Course
 * System.dc.html`, which is authoritative for category IDs (per the Master
 * Consolidation's conflict-resolution note). SRS Academy currently has one
 * confirmed program — Full Stack Web Development, from
 * `@/content/programs` / `@/content/program-detail` — which is the only
 * `status: "live"` entry and the only one with real curriculum, audience,
 * fee and admissions detail on its course-detail page.
 *
 * Every other entry is a structural placeholder that demonstrates the
 * catalogue's intended multi-domain scale (9 categories spanning tech,
 * business, beauty, creative arts, fashion, trades and career skills). Each
 * carries `status: "placeholder"`, is rendered with a "Coming soon" badge,
 * and asserts no fee, accreditation, duration-in-weeks, or outcome — only a
 * category, mode, level and duration *bucket*, which are structural filter
 * facets rather than business facts.
 */

export type CourseCategoryId =
  | "tech"
  | "webdev"
  | "business"
  | "beauty"
  | "creative"
  | "fashion"
  | "trades"
  | "career"
  | "corporate";

export type CourseCategory = {
  id: CourseCategoryId;
  label: string;
  emoji: string;
  /** Tailwind arbitrary-value friendly tint, used on Learning Worlds cards. */
  tint: string;
};

export const courseCategories: CourseCategory[] = [
  { id: "tech", label: "AI & Technology", emoji: "🤖", tint: "rgba(59,130,246,.12)" },
  { id: "webdev", label: "Web & Software Development", emoji: "💻", tint: "rgba(182,245,66,.16)" },
  { id: "business", label: "Digital & Business Skills", emoji: "💼", tint: "rgba(139,92,246,.12)" },
  { id: "beauty", label: "Beauty & Makeup", emoji: "💄", tint: "rgba(255,183,213,.28)" },
  { id: "creative", label: "Mehendi & Creative Arts", emoji: "🌿", tint: "rgba(255,90,95,.14)" },
  { id: "fashion", label: "Fashion & Lifestyle", emoji: "👗", tint: "rgba(255,90,95,.13)" },
  { id: "trades", label: "Technical & Skilled Trades", emoji: "🛠️", tint: "rgba(59,130,246,.12)" },
  { id: "career", label: "Communication & Career Skills", emoji: "🗣️", tint: "rgba(182,245,66,.14)" },
  { id: "corporate", label: "Professional & Corporate Learning", emoji: "🏢", tint: "rgba(139,92,246,.14)" },
];

export type CourseMode = "online" | "offline" | "hybrid";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseDurationBucket = "short" | "medium" | "long";

export type Course = {
  id: string;
  /** Matches `programs.ts` slug for the one live program. */
  slug: string;
  title: string;
  category: CourseCategoryId;
  mode: CourseMode;
  level: CourseLevel;
  duration: CourseDurationBucket;
  photo: string;
  blurb: string;
  status: "live" | "placeholder";
};

export const modeLabels: Record<CourseMode, string> = {
  online: "Online",
  offline: "Offline",
  hybrid: "Hybrid",
};
export const levelLabels: Record<CourseLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
export const durationLabels: Record<CourseDurationBucket, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

export const courses: Course[] = [
  {
    id: "fullstack",
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    category: "webdev",
    mode: "online",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    blurb:
      "A practical, project-based path from web fundamentals to full-stack development — frontend, backend, databases and deployment.",
    status: "live",
  },
  {
    id: "ai",
    slug: "artificial-intelligence-fundamentals",
    title: "Artificial Intelligence Fundamentals",
    category: "tech",
    mode: "hybrid",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    blurb: "From first computer class to building simple AI tools.",
    status: "placeholder",
  },
  {
    id: "python",
    slug: "python-programming",
    title: "Python Programming",
    category: "tech",
    mode: "online",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
    blurb: "Programming fundamentals with hands-on projects.",
    status: "placeholder",
  },
  {
    id: "java",
    slug: "java-programming",
    title: "Java Programming",
    category: "tech",
    mode: "online",
    level: "intermediate",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80",
    blurb: "Core Java concepts for aspiring developers.",
    status: "placeholder",
  },
  {
    id: "networking",
    slug: "hardware-and-networking",
    title: "Hardware & Networking",
    category: "webdev",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
    blurb: "Practical computer hardware and network setup skills.",
    status: "placeholder",
  },
  {
    id: "digitalmkt",
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "business",
    mode: "online",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
    blurb: "Social media, SEO basics and campaign fundamentals.",
    status: "placeholder",
  },
  {
    id: "tally",
    slug: "tally-and-gst",
    title: "Tally & GST",
    category: "business",
    mode: "hybrid",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?auto=format&fit=crop&w=700&q=80",
    blurb: "Practical accounting and GST filing skills for jobs.",
    status: "placeholder",
  },
  {
    id: "graphic",
    slug: "graphic-design",
    title: "Graphic Design",
    category: "business",
    mode: "online",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=700&q=80",
    blurb: "Visual design fundamentals using industry-standard tools.",
    status: "placeholder",
  },
  {
    id: "autocad",
    slug: "autocad",
    title: "AutoCAD",
    category: "business",
    mode: "hybrid",
    level: "intermediate",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
    blurb: "Technical drafting and design software skills.",
    status: "placeholder",
  },
  {
    id: "makeup",
    slug: "makeup-artistry",
    title: "Makeup Artistry",
    category: "beauty",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Everyday and party makeup techniques, hands-on.",
    status: "placeholder",
  },
  {
    id: "bridal",
    slug: "bridal-makeup-artistry",
    title: "Bridal Makeup Artistry",
    category: "beauty",
    mode: "offline",
    level: "intermediate",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Professional bridal looks and client handling.",
    status: "placeholder",
  },
  {
    id: "beautytherapy",
    slug: "beauty-therapy",
    title: "Beauty Therapy",
    category: "beauty",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Skin, hair and body treatment fundamentals.",
    status: "placeholder",
  },
  {
    id: "nails",
    slug: "nail-extension",
    title: "Nail Extension",
    category: "beauty",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    blurb: "Nail art and extension techniques for real clients.",
    status: "placeholder",
  },
  {
    id: "mehendi",
    slug: "mehendi-design",
    title: "Mehendi Design",
    category: "creative",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
    blurb: "From basic patterns to bridal mehendi artistry.",
    status: "placeholder",
  },
  {
    id: "tailoring",
    slug: "tailoring-and-fashion-design",
    title: "Tailoring & Fashion Design",
    category: "fashion",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80",
    blurb: "Stitching, pattern-making and garment design.",
    status: "placeholder",
  },
  {
    id: "electrician",
    slug: "electrician-training",
    title: "Electrician Training",
    category: "trades",
    mode: "offline",
    level: "beginner",
    duration: "medium",
    photo:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
    blurb: "Practical household and commercial wiring skills.",
    status: "placeholder",
  },
  {
    id: "acrepair",
    slug: "ac-repair-and-servicing",
    title: "AC Repair & Servicing",
    category: "trades",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=700&q=80",
    blurb: "Installation, servicing and troubleshooting basics.",
    status: "placeholder",
  },
  {
    id: "plumbing",
    slug: "plumbing",
    title: "Plumbing",
    category: "trades",
    mode: "offline",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=700&q=80",
    blurb: "Residential plumbing fundamentals, hands-on.",
    status: "placeholder",
  },
  {
    id: "english",
    slug: "spoken-english",
    title: "Spoken English",
    category: "career",
    mode: "online",
    level: "beginner",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
    blurb: "Confidence, fluency and interview-ready communication.",
    status: "placeholder",
  },
  {
    id: "corporate-upskilling",
    slug: "corporate-team-upskilling",
    title: "Corporate Team Upskilling",
    category: "corporate",
    mode: "hybrid",
    level: "intermediate",
    duration: "short",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80",
    blurb: "Workshops and cohort tracks built around a team's real workload.",
    status: "placeholder",
  },
];

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function categoryOf(course: Course): CourseCategory {
  return courseCategories.find((c) => c.id === course.category) ?? courseCategories[0];
}
