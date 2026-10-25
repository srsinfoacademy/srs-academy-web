import { RdSiteChrome } from "@/components/redesign/chrome/RdSiteChrome";

/** Layout for every redesigned public page. One layout, Light / Dark / System. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RdSiteChrome>{children}</RdSiteChrome>;
}
