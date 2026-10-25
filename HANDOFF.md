# Phase 1 handoff — SRS Academy public redesign

This branch is the shared base. Build new public pages on a branch **off this one**, and open a PR **into this branch**. Do not merge, do not push to `main`, and do not change Vercel or production settings.

## Branch and PR

- Branch: `cursor/redesign-phase-1-cdd9`
- PR: opened as a draft against `main` in the same session. The URL is in the pull request list for this branch. If this line still says “see the open draft”, the PR body is the source of truth once GitHub assigns a number.
- Base for your work: `cursor/redesign-phase-1-cdd9`, not `main`.

## DONE (do not rebuild)

- `src/content/site.ts` — one config file for public facts. Display email `srsinfoacademy@gmail.com`. Resend inbox `contact.enquiryInbox` (`srsinfotechacademy@gmail.com`) is **not** for display. Phone and WhatsApp stay hidden while `contact.phone` and `contact.phoneDigits` are empty. Address, hours, location line, social links, logo paths, Unsplash stand-ins, `features.showTestimonials === false`, `features.showFees === false`. Helpers: `publicPhone()`, `whatsappHref()`, `contactFacts()`, `hoursSummary()`.
- `site.url` is `https://www.srstechacademy.com`. Canonicals, Open Graph and the sitemap already read it. Do not point them back at the apex.
- Pinterest meta `p:domain_verify` = `793089aaf6d1e8ff5623e5867761095f` in `src/app/layout.tsx`. Leave it.
- `/api/contact` still validates, honeypots, rate-limits and sends through Resend. Notifications go to `site.contact.enquiryInbox`. Do not change that route’s spam checks.
- Course data: `content-templates/itdb_courses.xlsx` → `python3 scripts/import-courses.py` (or `pnpm courses:import`). Outputs `src/content/courses/courses.json` (418 courses) and `src/content/courses/redirects.json`. Source URL and Notes are dropped. Topics are short lines, not raw third-party paragraphs.
- Course API: `src/content/courses/index.ts`. Use `getAllCourses`, `getCourseBySlug`, `getCourseByCode`, `getCategories`, `getCoursesByCategory`, `searchCourses`, `relatedCourses`, `coursePath`, `getHomeFeaturedCourses`, `getSrsPrograms`, `coursesInArea`, `courseAreas`. Do not import the JSON from a client component; pass a slim list from a Server Component.
- Five SRS programs that are **not** spreadsheet rows live in `src/content/courses/featured-programs.ts` and are merged by the loader (Full Stack has a real curriculum; the other four have empty `modules` on purpose).
- Homepage photo cards: course codes `DLS001`, `AIDMS004`, `CDEAE053`, `CCSE505`, `BMC478`, `CMM478`. Images are on `site.imagery.courses`.
- Redesign tokens: `src/styles/redesign.css`, imported from `globals.css`. Light palette is the design. `.dark` is the derived theme. Utilities are `bg-rd-bg`, `text-rd-ink`, `text-rd-body`, `text-rd-soft`, `bg-rd-elevated`, `bg-rd-muted`, `bg-rd-inverse`, `text-rd-inverse-text`, `bg-rd-accent`, `text-rd-on-accent`, `text-rd-link`, `border-rd-line`, `border-rd-line-strong`, `bg-rd-tint-green`, `bg-rd-tint-saffron`, `text-rd-eyebrow`, `text-rd-danger`, `font-rd-display`, `font-rd-sans`. Nav breakpoint is `nav:` (1180px).
- Fonts: Newsreader (`--font-rd-newsreader`) and Mukta (`--font-rd-mukta`, latin + devanagari) via `next/font` in the root layout. Old Space Grotesk / Manrope / IBM Plex are still loaded for the current pages. New pages use `font-rd-display` and `font-rd-sans` only.
- Theme: blocking script `THEME_INIT_SCRIPT` plus `ThemeProvider` (`useTheme`) and `ThemeToggle`. Choice is `light` | `dark` | `system` in `localStorage` key `srs-theme`. `prefers-reduced-motion` is already global in `redesign.css`.
- Primitives: `RdContainer` (`wide` 1360px, `prose` 820px, gutter `clamp(20px, 4vw, 56px)`) and `RdButton` (`accent` | `primary` | `secondary` | `text`).
- Logos: `public/brand/srs-logo.png` (wordmark, background removed), `public/brand/srs-logo-round.png`. Favicon, apple icon and OG image are `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`.
- Confirmed copy already applied on the **current** pages, so do not put it back: no `+91-900007799`, no Mumbai, Facebook URL updated, admission steps are Enquire → Counselling → Enrol, fee blocks removed from program detail. Legal refund/terms text is unchanged except the contact lines drop the phone while it is empty and use the display email. CEO line “Chief Executive Officer: S Roy” stays on About.
- `pnpm lint` and `pnpm typecheck` pass on this commit.

## IN PROGRESS

None. Do not edit the files in DONE except to fix a bug in the contract. Page work starts from the lists below.

## NOT STARTED (yours)

Build only the public website. Do not build the design’s Student Portal, Admin Panel, or Design audit page.

Pages, matching `SRS Tech Academy Redesign.dc.html` (desktop 1024–1920, mobile 360–430):

1. New public chrome: header (logo + wordmark, nav, Courses menu of the five SRS programs, Student Login only when `site.portals.student.href` is set, Enquire Now, `ThemeToggle`), mobile menu, footer (no Design audit link; Admin link only when `site.portals.admin.href` is set), fixed bottom bar **Courses / Enquire Now** below the `nav` breakpoint.
2. Home. Hide the testimonials block entirely while `site.features.showTestimonials` is false. No “proposed” or “15 demo” labelling. Eyebrow is “Online & classroom · Kolkata”, not Mumbai.
3. About, including “Chief Executive Officer: S Roy”.
4. `/courses` catalogue: category chips from `getCategories()`, search, and the query contract `?q=` and `?category=` (display category, e.g. `Computer`). Photo cards only for `getHomeFeaturedCourses()`. The other ~400 courses are text cards (name, category, code, duration, module count). No per-course fee.
5. `/courses/[slug]` with `generateStaticParams` for every `getAllCourses()` entry. Show name, category, code, duration, modules. Full Stack may use `curriculum` and `outcomes`. Empty `modules` means “topic list not published yet”, not a made-up syllabus. No Source URL, no itdb branding, no fees.
6. `/technical-training` using `technicalProgramSlugs` in `featured-programs.ts`.
7. Admissions (the three steps already in `admissionsJourney`), Contact (enquiry form), Resources (the five existing articles), Updates (empty state; do not render fake “[Update title]” cards), FAQ, Privacy, Terms, Refund, Accessibility. Restyle legal pages; do not rewrite the approved policy text.
8. Enquiry form posts JSON to `/api/contact` with `name`, `email`, `phone`, `subject`, `message`, `honeypot`, `formRenderedAt`, `sourcePage`. The API requires name, email and message. Course of interest is a searchable select fed by `getAllCourses()` plus “Not sure yet”, sent as `subject`. Put course and format into `message` when the visitor leaves the textarea blank. Keep the honeypot visually hidden.
9. Retire `/light`: delete `src/app/light`, `src/components/light`, `src/content/light`, `src/proxy.ts`, the old theme cookie script in `src/app/layout.tsx` (`THEME_PREFERENCE_SCRIPT`), and `src/lib/theme-preference.ts` / `theme-route-map.ts` once nothing imports them. Then wire `legacyRedirects` from `src/content/courses/index.ts` into `redirects()` in `next.config.ts` (`permanent: true` → 308). Do **not** enable those redirects before the destination routes exist. Add a final fallback `/light/:path*` → `/` and `/programs/:slug` → `/courses` only after the specific redirects.
10. Sitemap: include every course URL plus the new static routes (`/courses`, `/technical-training`, and the routes that stay). `robots.ts` already uses `site.url`.
11. When the cookie goes away, update the Privacy “Cookies and local storage” sentence so it describes the `srs-theme` localStorage value instead of the old theme cookie and light-theme accent. Do not change the rest of that policy.
12. Remove the old Knowledge OS presentation once the new pages replace it (`src/components/home`, `knowledge-os`, `programs`, `program`, and the `(main)` pages you supersede). Keep `/api/contact`, `src/lib/contact/*`, `src/content/legal.ts`, `resources.ts`, `updates.ts`, `faq.ts`.
13. Screenshots of key pages in light and dark at desktop and mobile, and a note in the PR if a Vercel preview URL appears. `pnpm lint`, `pnpm typecheck` and `pnpm build` must pass.

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

- Phone and WhatsApp (`site.contact.phone`, `site.contact.phoneDigits`). Format when known: `https://wa.me/91XXXXXXXXXX`.
- Street address and any Mumbai campus.
- Testimonials and original photography (`site.imagery`, `features.showTestimonials`).
- Student portal and admin portal URLs.
- Durations, levels and module lists for Artificial Intelligence, Technology Programs, Business & Entrepreneurship, and Digital Skills.
- Batch dates and any step after Enrol.
- One catalogue row, “Diploma in Computer Application & FA”, has no duration (`To be confirmed`).
- The data-entry card uses a stable Unsplash photo (Luke Chesser) because the design file’s photo id did not look like a normal Unsplash id.
