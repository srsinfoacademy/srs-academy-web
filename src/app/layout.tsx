import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Mukta, Newsreader, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { baseMetadata } from "@/lib/metadata";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { THEME_PREFERENCE_COOKIE } from "@/lib/theme-preference";
import "./globals.css";

/**
 * First-visit-only: a brand-new visitor (no `srs-theme` cookie yet — a
 * returning one is handled server-side, with no flash, by proxy.ts) landing
 * on one of the two site entry points is routed to whichever theme matches
 * their OS/browser colour-scheme preference. Deliberately does nothing when
 * that preference can't be read or is genuinely unset, rather than guessing.
 * Once a visitor uses the sun/moon toggle, FloatingUtilityControls sets the
 * cookie and this no longer runs for them.
 */
const THEME_PREFERENCE_SCRIPT = `(function () {
  try {
    var path = window.location.pathname;
    if (path !== "/" && path !== "/light") return;
    if (document.cookie.indexOf("${THEME_PREFERENCE_COOKIE}=") !== -1) return;
    if (!window.matchMedia) return;
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (path === "/" && prefersLight) {
      window.location.replace("/light");
    } else if (path === "/light" && prefersDark) {
      window.location.replace("/");
    }
  } catch (e) {}
})();`;

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

/** Redesign typefaces. The current pages still use Space Grotesk / Manrope. */
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
      className={`${display.variable} ${sans.variable} ${mono.variable} ${newsreader.variable} ${mukta.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Script id="theme-preference" strategy="beforeInteractive">
          {THEME_PREFERENCE_SCRIPT}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
