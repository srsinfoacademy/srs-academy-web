import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Global metadata defaults. Marketing claims are deliberately absent: the
 * description is a placeholder until SRS Academy supplies approved copy.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

/** Per-page metadata helper; keeps canonical URLs consistent across routes. */
export function pageMetadata(input: {
  title: string;
  description?: string;
  path: string;
}): Metadata {
  const description = input.description ?? site.description;

  return {
    title: input.title,
    description,
    alternates: { canonical: input.path },
    openGraph: {
      title: `${input.title} — ${site.name}`,
      description,
      url: input.path,
    },
  };
}
