import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";

import { baseMetadata } from "@/lib/metadata";
import "./globals.css";

/**
 * Knowledge OS typefaces. Each is loaded as a variable font, subset to latin,
 * and exposed as a CSS variable that the type system composes into stacks —
 * components never reference a typeface directly.
 */
const display = Space_Grotesk({
  variable: "--srs-typeface-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Manrope({
  variable: "--srs-typeface-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--srs-typeface-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#0b0e0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
