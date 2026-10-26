import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

import { RdImageCredit } from "@/components/redesign/RdImageCredit";
import { coverLayout, coverVariant, type CoverIcon } from "@/content/courses/covers";
import type { CourseCardData } from "@/content/courses/types";
import { cn } from "@/lib/cn";

/** 24×24 line icons, drawn with the cover's stroke colour. */
const icons: Record<CoverIcon, ReactNode> = {
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M8 20.5h8M12 16.5v4" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13h.01M18 10h.01M18 13h.01M8 15h8" />
    </>
  ),
  "folder-code": (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M10 11l-2 2 2 2M14 11l2 2-2 2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18M11 12.5v1.5h2v-1.5" />
    </>
  ),
  "id-card": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10.5" r="2" />
      <path d="M6 16a3 3 0 0 1 6 0M14.5 9.5h4M14.5 13h4" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9 13.8 7.8 21l4.2-2.2 4.2 2.2-1.2-7.2M10 9l1.4 1.4L14.2 7.6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M8 7.5h8" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l4.5-1L19 8.5 15.5 5 5 15.5z" />
      <path d="M13.5 7l3.5 3.5M4 20h16" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.8 4.5l-3.6 15" />,
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9.5 2.5v3.5M14.5 2.5v3.5M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5" />
    </>
  ),
  layers: <path d="M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5" />,
  chart: (
    <>
      <path d="M3 20h18" />
      <path d="M4 16l5-5 4 3.5L20 7.5M15 7.5h5v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3z" />
    </>
  ),
};

type CoverCourse = Pick<CourseCardData, "slug" | "name" | "category" | "origin" | "image">;

/**
 * Cover at the top of every course card, in one 16:9 frame. A real photo
 * (the admin "Cover image", or a site stand-in with its Unsplash credit)
 * renders with next/image; every other course gets a generated cover drawn
 * inline, so there is no image request and no layout shift. The generated
 * cover is decorative and hidden from assistive technology.
 */
export function RdCourseCover({
  course,
  sizes = "(min-width: 1180px) 400px, (min-width: 700px) 45vw, 100vw",
  className,
}: {
  course: CoverCourse;
  sizes?: string;
  className?: string;
}) {
  const frame = cn("relative aspect-[16/9] w-full overflow-hidden bg-rd-muted", className);

  if (course.image) {
    return (
      <div className={frame}>
        <Image
          src={course.image.src}
          alt={course.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        {course.image.credit && course.image.creditHref ? <RdImageCredit image={course.image} /> : null}
      </div>
    );
  }

  const variant = coverVariant(course);
  const layout = coverLayout(course.slug);
  const style = {
    "--cv": variant.color,
    "--cv-angle": `${layout.angle}deg`,
    "--cv-pattern-angle": `${layout.patternAngle}deg`,
    "--cv-pattern-offset": layout.patternOffset,
    "--cv-mask-x": layout.maskX,
    "--cv-mask-y": layout.maskY,
  } as CSSProperties;

  return (
    <div aria-hidden="true" className={cn(frame, "rd-cover", variant.brand && "rd-cover--brand")} style={style}>
      <div className={cn("rd-cover-pattern absolute inset-0", `rd-cover-pattern--${layout.pattern}`)} />
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        className="rd-cover-art absolute inset-0 h-full w-full"
        focusable="false"
      >
        <circle cx={layout.blobX} cy={layout.blobY} r={layout.blobR} className="rd-cover-blob" />
        <circle cx="236" cy="90" r={layout.ringB} className="rd-cover-ring" />
        <circle cx="236" cy="90" r={layout.ringA} className="rd-cover-ring" />
        <rect x="206" y="60" width="60" height="60" rx="16" className="rd-cover-tile" />
        <g
          transform="translate(218 72) scale(1.5)"
          className="rd-cover-icon"
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[variant.icon]}
        </g>
      </svg>
      <span className="rd-cover-label absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase leading-none tracking-[0.08em]">
        <span className="rd-cover-dot size-1.5 rounded-full" />
        {variant.label}
      </span>
    </div>
  );
}
