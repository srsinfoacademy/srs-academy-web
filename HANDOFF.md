# Handoff — SRS Academy website (Phase 1 redesign + admin panel v1)

Phase 1 (the public redesign) is merged into `main`. The admin panel is built on `claude/admin-panel` with a draft PR into `main` titled "Admin panel (basic) v1". Do not merge it from a session, do not push to `main`, and do not change Vercel or production settings.

## Admin panel (basic) v1 — DONE on `claude/admin-panel`

Design source: the approved Claude Design file `SRS-Admin-Panel.dc.html` (navy sidebar, white top bar, grey canvas, white panels). The prototype's sample data, "Sample data" badges and simulated-login notes were dropped; every screen shows real data.

- **Routes:** `/admin/login`, `/admin` (dashboard), `/admin/courses`, `/admin/courses/new`, `/admin/courses/[id]`, `/admin/categories`, `/admin/enquiries`, `/admin/enquiries/[id]`, `/admin/contact`, `/admin/settings`. Signed-in screens share `src/app/admin/(panel)/layout.tsx` → `AdminShell` (collapsible sidebar persisted in `localStorage` key `srs-admin-sidebar`, mobile drawer below 1024px, top bar with course search, Light/Dark/System switch using the site `ThemeProvider`, View website, profile menu with logout). Greyed "coming later" items: Students, Admissions, Live Classes, Assignments, Certificates, Content, Portal.
- **API:** `src/app/api/admin/*` — `login`, `logout`, `courses` (POST create), `courses/[id]` (PUT, DELETE), `courses/bulk`, `courses/import`, `categories` (one POST with an `action`), `contact` (PUT), `enquiries/[id]` (PATCH status / note / deleteNote). Server-side mutations live in `src/lib/admin/course-mutations.ts` and `category-mutations.ts`.
- **Data module (`src/lib/data/`)** — used by both the public site and the admin:
  - `store.ts`: private Vercel Blob JSON documents (`data/courses.json`, `data/categories.json`, `data/contact.json`, `enquiries/<id>.json`); gitignored `.admin-data/` folder in local dev without a token; read-only fallback in production without a token.
  - `seed.ts`: seed documents from `src/content/courses` (418 catalogue rows + 5 SRS programs) and `src/content/site.ts`. Used until the first save.
  - `courses.ts` / `contact.ts`: `getPublic*` helpers read through `unstable_cache` tagged `courses`, `categories`, `contact`. A course is public when `published` and its category is visible.
  - `revalidate.ts`: every admin save calls `revalidateTag(tag, { expire: 0 })` plus `revalidatePath("/", "layout")` and the sitemap. Verified with a production build: a static course page returned 404 and left the sitemap right after unpublishing; About/Contact showed a new phone immediately.
  - `schemas.ts`: zod schemas shared by forms and API (`ADMIN_PASSWORD_MIN = 6`, `SUMMARY_MAX = 200`). `import-rules.ts`: the topic / duration / category / code clean-up ported from `scripts/import-courses.py`; re-importing `content-templates/itdb_courses.xlsx` in update mode changes nothing.
- **Public site now reads through the data module:** header course menu, mobile menu, home, `/courses` (chips accept `?category=` name or admin slug), `/courses/[slug]` (SEO title/description from admin; `dynamicParams` is now on so admin-created courses render on demand, and unpublished slugs 404), technical training, sitemap, footer, enquiry section, About address, Contact (optional Google Maps embed). `src/content/courses/index.ts` remains for the seed, `courseAreas` and the content scripts.
- **Courses screen:** 423 rows (SRS programs flagged with a pill and a Type filter), search, category / status / type filters, sortable columns + sort menu, 25/50/100 per page, row/page/all-matching selection, bulk Publish / Unpublish / Change category / Delete (confirm), Export CSV (filtered or selected, formula-safe), Import from Excel (SheetJS in the browser → column mapping → preview → summary → upsert by course code on the server; duplicate codes in the catalogue match by occurrence; new courses start unpublished; unknown categories are created).
- **Course form:** name, slug (auto from name until edited), code, category, duration (datalist), level, short description (200 max), repeatable modules (reorder/remove), image URL (Unsplash or site path, preview), SEO title/description with search preview, Published switch, delete.
- **Categories:** counts, add / rename (moves courses), reorder (drag + up/down, saved immediately), show/hide, delete only when empty or after choosing where its courses go.
- **Enquiries:** `/api/contact` keeps its validation, honeypot, timing and rate-limit checks and the Resend emails; it now also saves the enquiry first, emails the notification to the admin-set inbox (fallback `site.contact.enquiryInbox`), and returns success when the enquiry was saved even if Resend fails. Admin list (search, status filters new / contacted / follow-up / closed, CSV) and detail (reply by email / WhatsApp, status, internal notes).
- **Contact Page:** phone (+91 8008138008 seed), WhatsApp digits, public email, enquiry notification email, address, office-hours rows, six social links, Google Maps embed URL (pasting the iframe code keeps the link), live preview, Save / Discard.
- **Settings:** account and session, **Change password note: the password is managed via the `ADMIN_PASSWORD` env var for now (minimum 6 characters)** with the Vercel steps, data-storage status.
- **Auth/security:** `ADMIN_EMAIL`, `ADMIN_PASSWORD` (6+ chars), `AUTH_SECRET` (16+ chars). Timing-safe compare, `jose` HS256 session cookie `srs_admin_session` (httpOnly, SameSite=Lax, Secure in production, 12h). `src/proxy.ts` guards `/admin/*` and `/api/admin/*` except login and adds `X-Robots-Tag: noindex` + `no-store`; pages and routes re-check the session. Durable login lockout (5 failures / 15 min per hashed IP, stored in Blob). All mutations: session + zod + same-origin `Origin` check. `/admin` is noindex, disallowed in `robots.txt`, not in the sitemap. CSP change: `frame-src` adds `https://www.google.com` for the map embed only.
- **Vercel (already set by the CEO, not changed here):** `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` for Production and Preview; private Blob store `srs-academy-admin-data` connected, so `BLOB_READ_WRITE_TOKEN` is provided.
- **Styling:** admin surface tokens in `src/styles/admin.css` (light + dark) exposed as `bg-ad-*` / `border-ad-*` utilities at the end of `globals.css`; ink, accent, link and danger come from `redesign.css`. Newsreader + Mukta only.
- `pnpm lint`, `pnpm typecheck` and `pnpm build` pass.

### Admin — open items

- SheetJS: the npm `xlsx@0.18.5` build is used because this sandbox can't reach `cdn.sheetjs.com`. It is lazy-loaded only in the import dialog and parses files the signed-in admin picks, but the maintained build is the CDN tarball; switch with `pnpm add https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` from a machine that can reach it.
- Single admin account; no roles, no in-app password change or reset (env var for now).
- Documents are rewritten whole on each save: two people saving the same document at the same moment means last write wins.
- Login lockout is durable: 5 failed attempts per IP within 15 minutes lock that IP for 15 minutes (429 with a message and `Retry-After`). Counters live in Blob at `security/login/<sha256(IP + AUTH_SECRET)>.json` (no raw IPs); a successful sign-in deletes the record. If Blob is unreachable the counter falls back to the instance's memory instead of blocking sign-in. Two simultaneous attempts can race and get one extra try. The contact-form rate limit is still in-memory per instance.
- Blob reads retry twice on errors. If the store is still unreachable, public pages render the bundled content and log "Public data: … could not be read from storage" (a Vercel preview build failed once on a Blob 500 before this). A page built that way keeps the bundled data until the next admin save or deploy. Admin screens and saves never fall back, so an outage can't overwrite stored data.
- Course images take a URL (Unsplash or a site path); there is no upload yet.
- Legal pages (`src/content/legal.ts`) still read the phone and email from `site.ts`, because that text is approved policy wording. If the admin changes the phone or email, update `site.ts` too.
- The Blob store and the real Vercel preview were not reachable from the build sandbox; Blob was exercised through the same code path with the local store. Check one save on the Vercel preview.
- RULES.md rule 11 ("Do not build ... Admin Panel") was the Phase 1 scope; the admin panel was requested afterwards.

## Phase 1 foundations — DONE (do not rebuild)

- `src/content/site.ts` — one config file for public facts. Display email `srsinfoacademy@gmail.com`. Resend inbox `contact.enquiryInbox` (`srsinfotechacademy@gmail.com`) is **not** for display. Phone and WhatsApp are the CEO-confirmed +91 8008138008 (`contact.phone`, `contact.phoneDigits`); render them only through the helpers, and they hide again if those fields are emptied. Address, hours, location line, social links, logo paths, Unsplash stand-ins, `features.showTestimonials === false`, `features.showFees === false`. Helpers: `publicPhone()`, `telHref()`, `whatsappHref()`, `contactFacts()`, `hoursSummary()`.
- `site.url` is `https://www.srstechacademy.com`. Canonicals, Open Graph and the sitemap already read it. Do not point them back at the apex.
- Pinterest meta `p:domain_verify` = `793089aaf6d1e8ff5623e5867761095f` in `src/app/layout.tsx`. Leave it.
- `/api/contact` still validates, honeypots, rate-limits and sends through Resend. Notifications go to `site.contact.enquiryInbox`. Do not change that route’s spam checks.
- Course data: `content-templates/itdb_courses.xlsx` → `python3 scripts/import-courses.py` (or `pnpm courses:import`). Outputs `src/content/courses/courses.json` (418 courses) and `src/content/courses/redirects.json`. Source URL and Notes are dropped. Topics are short lines, not raw third-party paragraphs.
- Course API: public pages now use `src/lib/data/courses.ts` (`getPublicCourses`, `getPublicCatalogue`, `getPublicSrsPrograms`, `getPublicCourseBySlug`, `getPublicCategories`, `getPublicRelatedCourses`, `getPublicHomeFeatured`, `toPublicCard`), which reads the admin data with the bundled `src/content/courses/index.ts` data as seed. Do not import the JSON from a client component; pass a slim list from a Server Component.
- Five SRS programs that are **not** spreadsheet rows live in `src/content/courses/featured-programs.ts` and are merged by the loader (Full Stack has a real curriculum; the other four have empty `modules` on purpose).
- Homepage photo cards: course codes `DLS001`, `AIDMS004`, `CDEAE053`, `CCSE505`, `BMC478`, `CMM478`. Images are on `site.imagery.courses`.
- Redesign tokens: `src/styles/redesign.css`, imported from `globals.css`. Light palette is the design. `.dark` is the derived theme. The `@theme` block that exposes them as utilities is at the end of `src/app/globals.css`. Utilities are `bg-rd-bg`, `text-rd-ink`, `text-rd-body`, `text-rd-soft`, `bg-rd-elevated`, `bg-rd-muted`, `bg-rd-inverse`, `text-rd-inverse-text`, `bg-rd-accent`, `text-rd-on-accent`, `text-rd-link`, `border-rd-line`, `border-rd-line-strong`, `bg-rd-tint-green`, `bg-rd-tint-saffron`, `text-rd-eyebrow`, `text-rd-danger`, `font-rd-display`, `font-rd-sans`. Nav breakpoint is `nav:` (1180px).
- Fonts: Newsreader (`--font-rd-newsreader`) and Mukta (`--font-rd-mukta`, latin + devanagari) via `next/font` in the root layout. Only these two fonts are loaded; use `font-rd-display` and `font-rd-sans`.
- Theme: blocking script `THEME_INIT_SCRIPT` plus `ThemeProvider` (`useTheme`); the switcher is `RdFloatingControls`. Choice is `light` | `dark` | `system` in `localStorage` key `srs-theme`. `prefers-reduced-motion` is already global in `redesign.css`.
- Primitives: `RdContainer` (`wide` 1360px, `prose` 820px, gutter `clamp(20px, 4vw, 56px)`) and `RdButton` (`accent` | `primary` | `secondary` | `text`).
- Logos: `public/brand/srs-mark*.png|webp` (mark, transparent; header), `public/brand/srs-tech-academy-logo-round-1024.*` (round logo; footer), `public/brand/srs-tech-academy-icon-*.*` (mark on white). Never use an "SPRS Academy" logo. Favicon, apple icon and OG image are `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png` (plus `twitter-image.png`).
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
- **Retired:** `/light` tree, the old theme `src/proxy.ts` (a new `src/proxy.ts` now guards the admin), the theme-cookie script, `theme-preference.ts`, `theme-route-map.ts`, the `(main)` group, the Knowledge OS components and stylesheets, and the Space Grotesk / Manrope / IBM Plex fonts. `redirects.json` is wired into `next.config.ts` (308), then `/light/:path*` → `/` and `/programs/:slug` → `/courses`.
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
- The Student portal link is external and optional; hide it when the env URL is missing. The footer's Admin / Staff Login link goes to `NEXT_PUBLIC_ADMIN_PORTAL_URL` when set, otherwise to `/admin/login`.

## Placeholders still open

- Street address (only "Saltlake, Kolkata, West Bengal 700091" is confirmed) — no street line, no Mumbai.
- Testimonials and original photography (`site.imagery`, `features.showTestimonials`). All photos are Unsplash stand-ins with credits.
- Student portal URL (`NEXT_PUBLIC_STUDENT_PORTAL_URL`); the link stays hidden until set.
- Durations, levels and module lists for Artificial Intelligence, Technology Programs, Business & Entrepreneurship and Digital Skills (their pages show "To be confirmed" and the dashed panel).
- Batch dates and any admission step after Enrol.
- One catalogue row, "Diploma in Computer Application & FA", has no duration (`To be confirmed`).
- Certificate verification process (not mentioned on the site until confirmed).
- Updates: none published; the page shows its empty state.
- In dark mode the inverse surfaces (footer, "How you learn") flip to cream, as the `.dark` tokens define. Revisit if a dark footer is preferred.
- The data-entry card uses a stable Unsplash photo (Luke Chesser) because the design file's photo id did not look like a normal Unsplash id.
- PR #24 description and before/after screenshots still need updating from a session with GitHub access.
