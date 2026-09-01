import type { ReactNode } from "react";

import { GridBackground } from "@/components/knowledge-os/GridBackground";
import {
  KnowledgeNetworkBase,
  constellation,
} from "@/components/knowledge-os/KnowledgeNetworkBase";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { cn } from "@/lib/cn";
import type { BreadcrumbItem, HeroMetaItem, HeroVariant } from "@/types";

type VariantConfig = {
  /** Vertical rhythm, from most editorial to most utilitarian. */
  padding: string;
  title: string;
  measure: string;
  grid: boolean;
  network: boolean;
};

/**
 * The four approved hero variants share one anatomy — breadcrumb, index
 * label, title, supporting copy, metadata, Knowledge OS geometry — and differ
 * only in scale and how much geometry they carry.
 */
const variants: Record<HeroVariant, VariantConfig> = {
  editorial: {
    padding: "pt-[var(--srs-section)] pb-[var(--srs-section-loose)]",
    title: "type-display-l",
    measure: "measure",
    grid: true,
    network: true,
  },
  program: {
    padding: "pt-[var(--srs-section-tight)] pb-[var(--srs-section)]",
    title: "type-h1",
    measure: "measure",
    grid: true,
    network: true,
  },
  information: {
    padding: "pt-[var(--srs-section-tight)] pb-[var(--srs-section)]",
    title: "type-h1",
    measure: "measure",
    grid: true,
    network: false,
  },
  legal: {
    padding: "pt-[var(--srs-section-tight)] pb-[var(--srs-section-tight)]",
    title: "type-h2",
    measure: "measure-narrow",
    grid: false,
    network: false,
  },
};

type PageHeroProps = {
  variant?: HeroVariant;
  /** Technical index label, e.g. "Programs" or "02 / Admissions". */
  eyebrow?: string;
  index?: string;
  title: string;
  /** Supporting copy. Kept to one paragraph by design. */
  lead?: string;
  breadcrumb?: BreadcrumbItem[];
  meta?: HeroMetaItem[];
  /** Actions or any variant-specific composition. */
  children?: ReactNode;
  className?: string;
};

export function PageHero({
  variant = "information",
  eyebrow,
  index,
  title,
  lead,
  breadcrumb,
  meta,
  children,
  className,
}: PageHeroProps) {
  const config = variants[variant];

  return (
    <section
      aria-labelledby="page-hero-title"
      className={cn("relative isolate overflow-hidden", config.padding, className)}
    >
      {config.grid ? <GridBackground fade="bottom" size={80} /> : null}

      {config.network ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[42%] opacity-70 lg:block"
        >
          <KnowledgeNetworkBase
            points={constellation.points}
            edges={constellation.edges}
            animate
          />
        </div>
      ) : null}

      <Container className="relative">
        {breadcrumb && breadcrumb.length > 0 ? (
          <Breadcrumb items={breadcrumb} className="mb-8" />
        ) : null}

        <div className={cn("flex flex-col gap-5", config.measure)}>
          {eyebrow ? (
            <IndexLabel index={index} node={!index} as="p">
              {eyebrow}
            </IndexLabel>
          ) : null}

          <h1 id="page-hero-title" className={config.title}>
            {title}
          </h1>

          {lead ? <p className="type-body-l">{lead}</p> : null}

          {children ? <div className="mt-3 flex flex-wrap gap-3">{children}</div> : null}
        </div>

        {meta && meta.length > 0 ? (
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line-hairline pt-6 sm:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <dt className="type-index">{item.label}</dt>
                <dd className="type-body-s text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}
