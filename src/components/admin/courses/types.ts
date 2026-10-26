/** Slim course row sent to the admin courses screen. */
export type AdminCourseRow = {
  id: string;
  slug: string;
  name: string;
  code: string;
  category: string;
  duration: string;
  level: string;
  published: boolean;
  origin: "catalogue" | "srs";
  moduleCount: number;
  updatedAt: string;
};

/** Months, for sorting durations like "6 Months", "2 years", "45 days". Unknown sorts last. */
export function durationMonths(duration: string): number {
  const match = duration.match(/(\d+(?:\.\d+)?)\s*(year|month|week|day|hour)/i);
  if (!match) return 9999;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  return unit === "year" ? n * 12 : unit === "month" ? n : unit === "week" ? n / 4.345 : unit === "day" ? n / 30 : n / 160;
}
