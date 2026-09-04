import type { Metadata } from "next";

import { CourseCatalogue } from "@/components/light/courses/CourseCatalogue";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse SRS Academy's course catalogue across technology, business, beauty, creative arts, fashion, trades and career skills.",
};

export default async function LightCoursesPage({
  searchParams,
}: PageProps<"/light/courses">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "all";

  return (
    <div className="sl-container py-12 min-[700px]:py-16">
      <div className="mb-9 max-w-160">
        <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          COURSE CATALOGUE
        </div>
        <h1 className="sl-h1 mb-3 text-[2.1rem]">A course for every starting point</h1>
        <p className="text-[15px] leading-relaxed text-sl-ink/68">
          One confirmed program is live today — Full Stack Web Development. The rest of
          this catalogue previews the categories SRS Academy is building toward, marked
          &ldquo;Coming soon&rdquo; until each is confirmed.
        </p>
      </div>
      <CourseCatalogue initialQuery={q} initialCategory={category} />
    </div>
  );
}
