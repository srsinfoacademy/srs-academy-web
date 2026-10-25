import type { Metadata, Viewport } from "next";
import { Mukta, Newsreader } from "next/font/google";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { baseMetadata } from "@/lib/metadata";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

/** Newsreader (display) and Mukta (UI and body, Devanagari-ready). */
const newsreader = Newsreader({
  variable: "--font-rd-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const mukta = Mukta({
  variable: "--font-rd-mukta",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...baseMetadata,
  other: {
    "p:domain_verify": "793089aaf6d1e8ff5623e5867761095f",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F0" },
    { media: "(prefers-color-scheme: dark)", color: "#10182B" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${mukta.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
