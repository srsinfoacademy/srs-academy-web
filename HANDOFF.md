# Phase 1 handoff — SRS Academy public redesign

This branch is the shared base. Build new public pages on a branch **off this one**, and open a PR **into this branch**. Do not merge, do not push to `main`, and do not change Vercel or production settings.

## Branch and PR

- Branch: `cursor/redesign-phase-1-cdd9`
- PR: https://github.com/srsinfoacademy/srs-academy-web/pull/24 (draft, base `main`). Do not merge it.
- Base for your work: `cursor/redesign-phase-1-cdd9`, not `main`. Open your pull request into this branch.

## DONE (do not rebuild)

- `src/content/site.ts` — one config file for public facts. Display email `srsinfoacademy@gmail.com`. Resend inbox `contact.enquiryInbox` (`srsinfotechacademy@gmail.com`) is **not** for display. Phone and WhatsApp are the CEO-confirmed +91 8008138008 (`contact.phone`, `contact.phoneDigits`); render them only through the helpers, and they hide again if those fields are emptied. Address, hours, location line, social links, logo paths, Unsplash stand-ins, `features.showTestimonials === false`, `features.showFees === false`. Helpers: `publicPhone()`, `telHref()`, `whatsappHref()`, `contactFacts()`, `hoursSummary()`.
- `site.url` is `https://www.srstechacademy.com`. Canonicals, Open Graph and the sitemap already read it. Do not point them back at the apex.
- Pinterest meta `p:domain_verify` = `793089aaf6d1e8ff5623e5867761095f` in `src/app/layout.tsx`. Leave it.
- `/api/contact` still validates, honeypots, rate-limits and sends through Resend. Notifications go to `site.contact.enquiryInbox`. Do not change that route’s spam checks.
- Course data: `content-templates/itdb_courses.xlsx` → `python3 scripts/import-courses.py` (or `pnpm courses:import`). Outputs `src/content/courses/courses.json` (418 courses) and `src/content/courses/redirects.json`. Source URL and Notes are dropped. Topics are short lines, not raw third-party paragraphs.
- Course API: `src/content/courses/index.ts`. Use `getAllCourses`, `getCourseBySlug`, `getCourseByCode`, `getCategories`, `getCoursesByCategory`, `searchCourses`, `relatedCourses`, `coursePath`, `getHomeFeaturedCourses`, `getSrsPrograms`, `coursesInArea`, `courseAreas`. Do not import the JSON from a client component; pass a slim list from a Server Component.
- Five SRS programs that are **not** spreadsheet rows live in `src/content/courses/featured-programs.ts` and are merged by the loader (Full Stack has a real curriculum; the other four have empty `modules` on purpose).
- Homepage photo cards: course codes `DLS001`, `AIDMS004`, `CDEAE053`, `CCSE505`, `BMC478`, `CMM478`. Images are on `site.imagery.courses`.
- Redesign tokens: `src/styles/redesign.css`, imported from `globals.css`. Light palette is the design. `.dark` is the derived theme. The `@theme` block that exposes them as utilities is at the end of `src/app/globals.css`. Utilities are `bg-rd-bg`, `text-rd-ink`, `text-rd-body`, `text-rd-soft`, `bg-rd-elevated`, `bg-rd-muted`, `bg-rd-inverse`, `text-rd-inverse-text`, `bg-rd-accent`, `text-rd-on-accent`, `text-rd-link`, `border-rd-line`, `border-rd-line-strong`, `bg-rd-tint-green`, `bg-rd-tint-saffron`, `text-rd-eyebrow`, `text-rd-danger`, `font-rd-display`, `font-rd-sans`. Nav breakpoint is `nav:` (1180px).
- Fonts: Newsreader (`--font-rd-newsreader`) and Mukta (`--font-rd-mukta`, latin + devanagari) via `next/font` in the root layout. Only these two fonts are loaded; use `font-rd-display` and `font-rd-sans`.
- Theme: blocking script `THEME_INIT_SCRIPT` plus `ThemeProvider` (`useTheme`); the switcher is `RdFloatingControls`. Choice is `light` | `dark` | `system` in `localStorage` key `srs-theme`. `prefers-reduced-motion` is already global in `redesign.css`.
- Primitives: `RdContainer` (`wide` 1360px, `prose` 820px, gutter `clamp(20px, 4vw, 56px)`) and `RdButton` (`accent` | `primary` | `secondary` | `text`).
- Logos: `public/brand/srs-logo.png` (wordmark, background removed), `public/brand/srs-logo-round.png`. Favicon, apple icon and OG image are `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`.
- Confirmed copy already applied on the **current** pages, so do not put it back: no `+91-900007799`, no Mumbai, Facebook URL updated, admission steps are Enquire → Counselling → Enrol, fee blocks removed from program detail. Legal refund/terms text is unchanged except the contact lines drop the phone while it is empty and use the display email. CEO line “Chief Executive Officer: S Roy” stays on About.
- `pnpm lint` and `pnpm typecheck` pass on this commit.

## Phase 1 pages — DONE on this branch

All public pages now live in `src/app/(site)` with one layout (`RdSiteChrome`: skip link, `RdHeader`, `<main id="main-content">`, `RdFooter`, `RdMobileBar`, `RdFloatingControls`, `RdRevealObserver`) and the Light / Dark / System switcher.

- **Chrome:** header with active-route underline, Courses mega menu (see review round 1), inline Enquire Now at 600–1180px, hamburger menu below 1180px (`nav:`). Footer on the inverse surface with `contactFacts`-style facts via the `site.ts` helpers, phone + WhatsApp from `telHref()` / `whatsappHref()`, all six socials, Student Portal / Admin links only when their env URLs are set, no Design-audit link. Fixed **Courses / Enquire Now** bar below 1180px with matching page padding. Branded 404 at `src/app/not-found.tsx`.
- **Home** (`/`): hero with `site.contact.locationSummary`, featured photo cards (`getHomeFeaturedCourses()` + Unsplash credits), course areas with counts from data, SRS programs, Why SRS, About teaser + mission quote, Learn/Build/Advance, enquiry section, FAQ. Testimonials are not rendered.
- **About**: story, "Chief Executive Officer: S Roy", facts from `site.ts`, mission/vision, values.
- **/courses**: `RdCourseCatalogue` (client) fed a slim `CourseCardData[]` (`toCourseCard`) of the 418 catalogue rows. Search per `search.ts` (below), category chips from `getCategories()`, `?q=` / `?category=` read on load and kept in the URL, 24 cards per "Show more", aria-live count, empty state. SRS programs listed separately.
- **/courses/[slug]**: one template, `generateStaticParams` for every course, `dynamicParams = false`. Breadcrumb Home / Courses / name. Outcomes + curriculum accordion + "Who can apply" only where the data has them (Full Stack); topic list otherwise; dashed "details to be confirmed" panel when `modules` is empty. Certification paragraph on SRS programs only. Related courses via `relatedCourses()`. Enquire links go to `/contact?course=<slug>#enquire`.
- **/technical-training** from `technicalProgramSlugs`.
- **Admissions** (three `admissionsJourney` steps, now in `src/content/public-pages.ts`), **Contact**, **FAQ** (grouped by category), **Resources** + `/resources/[slug]`, **Updates** (empty state; `/updates/[slug]` generates nothing until `updates.ts` has entries), **Privacy / Terms / Refund / Accessibility** restyled from `legal.ts` text.
- **Enquiry form** (`RdEnquiryForm`): posts JSON to the unchanged `/api/contact` (`name`, `email`, `phone`, `subject`, `message`, `honeypot`, `formRenderedAt`, `sourcePage`). Email is required because the API requires it; mobile is optional but validated as a 10-digit Indian number when given. Searchable course select (slug values, because some course names repeat) + "Not sure yet"; subject is "Name (CODE)"; course and format are written into the message when it is blank.
- **Retired:** `/light` tree, `src/proxy.ts`, the theme-cookie script, `theme-preference.ts`, `theme-route-map.ts`, the `(main)` group, the Knowledge OS components and stylesheets, and the Space Grotesk / Manrope / IBM Plex fonts. `redirects.json` is wired into `next.config.ts` (308), then `/light/:path*` → `/` and `/programs/:slug` → `/courses`.
- **Sitemap:** static routes + every course + published resources + updates, on `site.url` (www).
- **Privacy:** only the "Cookies and local storage" sentence changed; it now describes the `srs-theme` localStorage value.
- **Tokens:** the redesign `@theme` block lives at the end of `src/app/globals.css` (the old reset was clearing every `rd-*` utility before). Added `--rd-inverse-hover`, `--rd-line-hover`, `--rd-field` (3:1 input borders), `--rd-shadow-card`, `--rd-shadow-raised`, `.rd-lattice`. Every text token pair passes WCAG AA in both themes.
- Copy for the new pages is in `src/content/public-pages.ts`. `coursePath` is in `src/content/courses/paths.ts` so client components never bundle the catalogue JSON.
- `pnpm install`, `pnpm lint`, `pnpm typecheck` and `pnpm build` pass.

## CEO review round 1 — DONE (one commit per item)

1. **Header audit** (1920/1440/1280/1180/1024/768/600/390/360, light and dark): nav labels, buttons and the logo no longer wrap (they did at 1180px); link padding tightens and the logo's "by SPRS INFOTECH PVT LTD" line hides between 1180 and 1360px so the row fits; every nav item is a 44px row; mobile menu marks the current page; sticky header z-40 above the mobile bar and floating controls (z-30).
2. **Courses mega menu** (`RdCoursesMenu`): opens on hover after 120ms, stays open while the pointer moves into the panel (hover bridge), closes 220ms after leaving; click/tap toggles; Enter/Space toggle, ArrowDown opens and focuses the first link, Escape closes and returns focus, tabbing out closes. Panel = SRS programs + catalogue categories with counts + "View all N courses"; animated open/close.
3. **Theme control moved** out of the header and mobile menu into `RdFloatingControls` (bottom-right): icon-only Light / Dark / System buttons with aria-label, aria-pressed and hover/focus tooltips, plus a Back to top button after 400px of scroll (smooth, instant under reduced motion). Below 1180px it sits above the Courses / Enquire Now bar. `ThemeToggle` was deleted.
4. **Theme default = System**: no saved value → `prefers-color-scheme`, updated live by the matchMedia listener in `ThemeProvider`; a saved `srs-theme` value overrides. `THEME_INIT_SCRIPT` runs in `<head>` (no flash) and also adds `rd-js` to `<html>` for the reveal CSS.
5. **Fluid layout**: `RdContainer` is one frame — full-width sections, content up to 1600px, padding `clamp(16px, 4vw, 64px)`. The old 1360px frame and 820px `prose` width are gone; long text sets its own measure (legal 75ch with a sticky "On this page" list, articles 72ch with a sticky side column, FAQ with a sticky topic list, `RdFaqSection` two-column on Home and Admissions).
6. **Motion** (CSS + one IntersectionObserver, no new dependency): `data-reveal` / `data-reveal="stagger"` scroll reveal via `RdRevealObserver` (re-scans on navigation and on added content), `.rd-hero` entrance, `.rd-card` hover lift, button lift, animated nav underline (`.rd-nav-underline`), animated mega menu, 350ms colour cross-fade on theme change. Hidden-before-reveal only when `rd-js` is set, with a 3s CSS fallback; `prefers-reduced-motion` turns all of it off.
- **Catalogue vs programs**: `getCatalogueCourses()` (418 spreadsheet rows) drives `/courses`, the category chips, the Home CTA, course areas and the mega menu counts; the five SRS programs are listed separately and `getSrsPrograms()` keeps `featured-programs.ts` order (Full Stack first). `getAllCourses()` still drives static params, the sitemap and the enquiry list.
- **Search** (`src/content/courses/search.ts`, shared by the client filter and `searchCourses()`): words match the start of words in the course name, category or code, ranked name first; topic lines are searched only when nothing else matches, and the result line says so.
- **Security headers** (`next.config.ts` `headers()`): CSP without nonces (keeps static generation; allows Unsplash images and the Vercel preview toolbar via vercel.live / vercel.com / assets.vercel.com / pusher; `'unsafe-eval'` only in development), X-Content-Type-Options, Referrer-Policy, X-Frame-Options SAMEORIGIN, Permissions-Policy. If a new third-party script, font or image host is added, extend the CSP list there.
- `pnpm lint`, `pnpm typecheck` and `pnpm build` pass.

### Kept on purpose

- `src/content/catalogue/*`, `src/content/programs.ts`, `src/content/program-detail.ts`, `src/types/program.ts` — the website no longer imports them, but `scripts/generate-course-*.ts` (documented in `content-templates/README.md`) still do. Delete them together with those scripts if that tooling is retired.

### Not verified in the build sandbox

- Unsplash images: the sandbox cannot reach `images.unsplash.com`, so local screenshots show empty image frames. Check them on the Vercel preview.
- Real email delivery: no Resend key in the sandbox. The browser test confirmed the JSON payload the form sends.
- The Pinterest tag and canonicals were checked in local `next start` HTML, not on the deployed preview (checklist 194/196).

## Conventions

- App Router, Server Components by default. `"use client"` only for menu, theme, catalogue filters and the enquiry form.
- Visual source: the Claude Design HTML in the original handoff, plus `src/styles/redesign.css`. Do not introduce a second palette or a second font.
- Copy and facts come from `src/content/site.ts` and the course helpers. Do not hard-code the email, address, hours or social URLs in a component.
- Never render a price, a fee range, or “fee to be announced”. Legal pages are the exception already in `legal.ts`.
- Do not invent testimonials, student counts, accreditation, batch dates, a street address, a Mumbai campus, or a phone number.
- Slugs: `slugify(name)`; if that slug is taken, append `-{course code}`. Regenerate with the import script rather than editing `courses.json` by hand.
- Duplicate spreadsheet names (about 15 pairs, plus one repeated name+code) already have distinct slugs. Old `/programs/...` URLs that matched more than one row redirect to `/courses?q=...` instead of guessing.
- Unsplash images need the credit line from `site.imagery`. `next.config.ts` already allows `images.unsplash.com`.
- Focus: `focus-visible:outline-3` in the accent colour. Icon buttons need an accessible name. Decorative images use `alt=""`.
- Student and admin portal links are external and optional. Hide them when the env URL is missing.

## Placeholders still open

- Street address (only "Saltlake, Kolkata, West Bengal 700091" is confirmed) — no street line, no Mumbai.
- Testimonials and original photography (`site.imagery`, `features.showTestimonials`). All photos are Unsplash stand-ins with credits.
- Student portal and admin portal URLs (`NEXT_PUBLIC_STUDENT_PORTAL_URL`, `NEXT_PUBLIC_ADMIN_PORTAL_URL`); the links stay hidden until set.
- Durations, levels and module lists for Artificial Intelligence, Technology Programs, Business & Entrepreneurship and Digital Skills (their pages show "To be confirmed" and the dashed panel).
- Batch dates and any admission step after Enrol.
- One catalogue row, "Diploma in Computer Application & FA", has no duration (`To be confirmed`).
- Certificate verification process (not mentioned on the site until confirmed).
- Updates: none published; the page shows its empty state.
- In dark mode the inverse surfaces (footer, "How you learn") flip to cream, as the `.dark` tokens define. Revisit if a dark footer is preferred.
- The data-entry card uses a stable Unsplash photo (Luke Chesser) because the design file's photo id did not look like a normal Unsplash id.
- PR #24 description and before/after screenshots still need updating from a session with GitHub access.
