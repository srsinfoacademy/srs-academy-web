import type { Metadata } from "next";

import { site } from "@/content/site";

/** Admin area: never indexed (also X-Robots-Tag from src/proxy.ts and robots.txt). */
export const metadata: Metadata = {
  title: { default: `Admin · ${site.name}`, template: `%s · ${site.name} Admin` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-1 flex-col bg-ad-bg font-rd-sans text-rd-body">{children}</div>;
}
