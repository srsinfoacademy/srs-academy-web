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
    title: "type-h1",
    grid: true,
    network: true,
  },
  program: {
    padding: "pt-[var(--srs-section-tight)] pb-[var(--srs-section)]",
    title: "type-h1",
    grid: true,
    network: true,
  },
  information: {
    padding: "pt-[var(--srs-section-tight)] pb-[var(--srs-section)]",
    title: "type-h1",
    grid: true,
    network: false,
  },
  legal: {
    padding: "pt-[var(--srs-section-tight)] pb-[var(--srs-section-tight)]",
    title: "type-h2",
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

        <div className="flex flex-col gap-3 lg:max-w-[58%]">
          {eyebrow ? (
            <IndexLabel index={index} node={!index} tone="lime" as="p">
              {eyebrow}
            </IndexLabel>
          ) : null}

          {/* Measures come from the design set: 20ch title, 62ch lead. */}
          <h1 id="page-hero-title" className={cn(config.title, "max-w-[20ch]")}>
            {title}
          </h1>

          {lead ? <p className="type-body-l mt-2 max-w-[62ch]">{lead}</p> : null}

          {children ? <div className="mt-3 flex flex-wrap gap-3">{children}</div> : null}
        </div>

        {meta && meta.length > 0 ? (
          <dl className="mt-5 flex flex-wrap gap-2.5">
            {meta.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "type-breadcrumb inline-flex items-center gap-1.5",
                  "rounded-[var(--srs-radius-sm)] border border-line px-[11px] py-1.5",
                  "text-secondary",
                )}
              >
                <dt className="sr-only-srs">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}
