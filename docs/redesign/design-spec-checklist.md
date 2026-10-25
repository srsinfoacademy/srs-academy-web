# SRS Tech Academy Redesign — Design-Fidelity Spec & Checklist

**Source reviewed:** `SRS Tech Academy Redesign.dc.html` (1,214 lines, read in full) + `screens/desktop-01..06.png` + `screens/mobile-01..11.png` (all viewed) + `repo-analysis.md` (context on the live Next.js repo).

**What this file is:** a page-by-page fidelity spec and a testable checklist for reviewing an implementation against the design. The design file is a clickable prototype ("dc.html") built with a custom templating syntax (`sc-if`, `sc-for`, `{{ }}` bindings) — it is **not** the final markup, but its inline `style` attributes are the literal source of truth for colors, spacing, radii, type and states used below.

**Pages/sections covered:** Header, mobile menu, mobile sticky bar, footer, Home, About, Courses (catalogue + published programs), Program/Course detail (×2 templates), Online-course detail, Technical Training, Admissions, Contact, 4 Legal pages (Privacy/Terms/Refund/Accessibility), Resources, Updates, global Enquiry form, global FAQ, and the prototype's own "Design audit" meta-page.

**Checklist item count:** 196 items (numbered 1–196), grouped by area.

**Key placeholders flagged:** the entire Testimonials section (bracketed quote/name/photo), all 15 "online course" catalogue cards (stock Unsplash photos + invented descriptions), every "Fee: To be announced" field, 4 of 5 "published programs" marked "to be confirmed", all 4 legal pages' body text (`[Existing policy text]`), the Updates page (3 fully bracketed cards), most of Resources ("Coming soon"), the academy email (`[Academy email — confirm; obscured on current site]`), the phone number (flagged in-design as "appears to be 9 digits"), and the Admissions step 3–4 copy. Full list in §5.

**Constraints overriding the design:** theme toggle (light/dark/system in one layout), 418 dynamic courses (not the design's hardcoded 15+5), no fees anywhere, testimonials hidden (not placeholder-shown) until real content exists, and the Pinterest verification meta tag must survive. See §6 — these materially change several sections described in §3.

---

## 1. Global design tokens

### 1.1 Colour

**Core palette (named in the design file's own "Design system" swatches, `audit` page, lines 1198–1201):**

| Name | Hex | Use |
|---|---|---|
| Ink | `#16213A` | primary text, navy buttons, header wordmark, footer bg |
| Ink 2 | `#3A4459` | body copy |
| Ivory | `#FAF7F0` | page background |
| White | `#FFFFFF` | cards |
| Saffron | `#B4561A` | "Enquire Now" / conversion CTA, links on hover, focus ring |
| Saffron tint | `#F6E7D6` | notice/status pill backgrounds |
| Deep green | `#1E5A43` | links, category tags, bullet dots |
| Green tint | `#E3EEE7` | chip/pill backgrounds |
| Line | `#E7E1D3` | default borders, section dividers |

Confirmed against the source: cream background is `#FAF7F0` (not `#efe9dc` — that hex exists too, see below, but as a *secondary* tint, not the page background). Navy is `#16213A`. Rust/CTA is `#B4561A` with hover `#94450F` (confirmed at `style-hover="background:#94450F"` on every Enquire button). Green is `#1E5A43`.

**Additional colours used in inline styles but not in the official swatch list** (implementation should still tokenise these — they recur across the file):

| Hex | Where used |
|---|---|
| `#94450F` | Saffron button hover state (all "Enquire Now" buttons) |
| `#24345A` | Navy button hover state (all primary "View Course"/"View Details" buttons) |
| `#B9AF99` | Card border on hover (course cards, category cards) |
| `#CFC7B5` | Secondary/outline button border, default input border, dashed placeholder border |
| `#C0432A` | Form field border on validation error |
| `#A0321C` | Form field error message text |
| `#FBEAE6` / `#E8B4A8` / `#8A2A16` | Error summary banner: bg / border / text |
| `#5A6477` | Secondary meta text (`dt` labels, small captions) |
| `#4A5468` | Body copy inside cards (distinct from Ink 2) |
| `#8A5A2E` | Eyebrow/kicker label text (e.g. "ABOUT US", "COURSE AREAS") |
| `#8A3F0E` | Warning/"to be confirmed" badge text (e.g. "Admissions open*", "Proposed online course") |
| `#E1DACB` | Stat-strip (`dl`) background/border grid lines |
| `#EFE9DC` | Light dividers, course-card image placeholder background |
| `#ECE6D9` | Mobile nav item divider |
| `#F4EFE4` | Dropdown-item hover background, topic chip background |
| `#F1EADB` | Hero decorative panel background (behind the lattice pattern) |
| `#E9A56E` | Accent dot in "SRS**.**" wordmark (footer/dark contexts) |
| `#C9CEDA` | Footer body text |
| `#9AA3B5` | Footer secondary links ("Admin / Staff Login", "Design audit") |
| `#2E3B5E` | Footer top border |
| `#22305A` | Image-placeholder background inside the dark "How You Learn" section |
| `#E9E4D8` | Footer social-link text colour |
| `#174A36` / `#7A3A10` | Resource-card status pill text ("For students" green / "Coming soon" orange) |
| `rgba(180,86,26,.35)` | Input focus ring (rust at 35% opacity) |
| `rgba(22,33,58,.28–.55)` | Card/dropdown/hero drop shadows (navy at varying opacity) |
| `rgba(30,90,67,.05–.09)` / `rgba(180,86,26,.05–.09)` | Faint 45° "jaali" lattice motif (green/rust), hero and course-header sections only |

**Not found in the source despite the prompt's expectation:** `#efe9dc` does **not** appear as the page/cream background — the page bg is `#FAF7F0`. `#efe9dc` (`#EFE9DC`) does appear, but only as a light divider/placeholder-image background tint. Flag this distinction to whoever wrote the original brief.

**Excluded from the token list:** the prototype's own "UI PREVIEW" chrome (viewport switcher toolbar) uses a separate set of colours (`#111A2E`, `#1E2942`, `#3A4766`, `#E7E3DA`, `#F2C79A`) — these belong to the Claude Design authoring tool, not the website, and must not be mistaken for design tokens.

### 1.2 Typography

- **Headings:** `Newsreader` (serif, optical sizing 6..72, weights 400/500/600), loaded via Google Fonts. Weight **500** for all page H1/H2/H3 headings; weight **600** only for the "SRS." wordmark.
- **Body/UI:** `Mukta` (sans, weights 400/500/600/700) — described in-design as "Indian-designed, Devanagari-ready."
- **H1** — `font: 500 clamp(Xpx, Yvw, Zpx) 'Newsreader'`, line-height ~1.02–1.06, letter-spacing `-.025em`. The clamp range **differs per page** (verify each, don't assume one shared value):
  | Page | H1 clamp |
  |---|---|
  | Home | `clamp(40px,5.6vw,68px)` |
  | About | `clamp(38px,5vw,60px)` |
  | Courses | `clamp(36px,4.6vw,56px)` |
  | Program/Course detail | `clamp(38px,5vw,62px)` |
  | Online-course detail | `clamp(34px,4.6vw,56px)` |
  | Technical Training | `clamp(38px,5vw,60px)` |
  | Admissions / Contact / Resources / Updates | `clamp(38px,5vw,60px)` |
  | Legal | `clamp(34px,4.4vw,52px)` |
  | Design audit | `clamp(36px,4.6vw,54px)` |
- **H2** — weight 500 Newsreader, typically `clamp(28–30px, 3.2–3.6vw, 38–44px)`, line-height 1.1.
- **H3** — mixed: Newsreader 500 at 22–26px for card titles; Mukta 600 at 18px for grid-item titles (e.g. "Why SRS Academy" cards).
- **Body** — Mukta, 15–19.5px, line-height 1.55–1.7 depending on context; meta/caption text never below 13px.
- **Eyebrow/kicker label** — 13.5px, weight 600, letter-spacing `.1em`, colour `#8A5A2E`, uppercase copy.
- Global CSS: `html,body{font-family:'Mukta',system-ui,sans-serif}`, antialiased.

### 1.3 Spacing, containers, radii, shadows, borders

- **Container widths:** `1360px` (most sections), `1200px` (home hero only), `860px` (FAQ, legal column), `820px` (legal page outer padding wrapper). Gutter is fluid: `clamp(20px,4vw,40–56px)`.
- **Section vertical padding:** fluid `clamp(28px,4vw,48px)` up to `clamp(56px,8vw,104px)` depending on section weight (hero sections use the smaller end, feature sections the larger).
- **Card gap:** 16–24px depending on grid; grid columns are `repeat(auto-fit/auto-fill, minmax(min(100%,Npx),1fr))` with N ranging 140px (stat cells) to 520px (featured course split).
- **Radii:** `999px` (pills/chips/badges/legal tabs), `6px` (focus-visible outline radius), `8px` (small level-filter chips, topic chips), `10px` (buttons, inputs), `12px` (search input), `14–16px` (stat grids, dropdown menu, resource cards), `16–20px` (cards, section panels, image corners), `22–28px` (hero image frame).
- **Shadows:** card hover `0 18px 36px -24px rgba(22,33,58,.35)`; header dropdown `0 18px 40px -18px rgba(22,33,58,.28)`; hero/featured-program image `0 30px 60px -30px rgba(22,33,58,.4)` and `0 18px 40px -20px rgba(22,33,58,.3)`. No shadow at rest — shadows are hover/elevation-only.
- **Borders:** `1px solid #E7E1D3` is the default card/section border; `1.5px dashed #CFC7B5` marks every "placeholder / to-be-confirmed" block (a deliberate, reusable visual language — see §1.4).

### 1.4 The "dashed border" placeholder convention

The design uses a **consistent visual pattern** for anything not production-ready: `border:1.5px dashed #CFC7B5` + rounded corners. It appears on: the "no results" empty states (courses, programs), the testimonial cards, the course-detail "details to be confirmed" box, the Updates placeholder cards, and the legal-page migration notice. Treat this as a first-class design token/component ("PlaceholderCard"), not an ad-hoc style — and note that real implementations should **not** literally ship this pattern for the Testimonials section per the constraint in §6 (hide, don't placeholder-render).

### 1.5 Breakpoints and responsive logic

No fixed breakpoint list is declared as CSS custom properties; responsive behaviour is driven by **JS logic + fluid CSS** (`clamp()`, `auto-fit`/`auto-fill` grids). The functional thresholds found in the prototype's own state logic are:
- `narrow = viewport width < 1180px` → header collapses to the hamburger menu; mobile sticky Courses/Enquire bar appears.
- `midW = narrow && width >= 600px` → header shows inline text "Student Login" + "Enquire Now" buttons *next to* the hamburger (not yet full mobile menu only).
- Below 600px → hamburger only, no inline header buttons.
- Grid `auto-fit`/`auto-fill` minmax values create implicit breakpoints that vary per section (220px–520px per column), i.e. there is no single shared grid breakpoint.

⚠️ **Contradiction to flag:** the design's own "audit" page (§1 layout notes, line 771) states "nav collapses `<920px`" — but the actual interactive logic uses **1180px**. See §7.

### 1.6 Motion

- Hover transitions: `box-shadow .2s, border-color .2s, transform .2s` on cards; `background .2s` on buttons; `border-color .2s` on outline buttons.
- Card hover lift: `translateY(-2px)`.
- Global: `@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}` — must be preserved.
- No page-transition or scroll-reveal animation is specified anywhere in the source.

---

## 2. Global components

### 2.1 Header / navigation
- Sticky, `top:0`, `z-index:40`, background `rgba(250,247,240,.96)` with `backdrop-filter: blur(10px)`, bottom border `1px solid #E7E1D3`. Height 72px (desktop).
- Logo: button, `aria-label="SRS Academy home"`, wordmark "SRS**.**" (Newsreader 600, 30px, rust accent dot) + stacked "SRS Academy" / "by SPRS Infotech Pvt Ltd" (11.5px, `#5A6477`).
- **Desktop nav (≥1180px):** Home, About Us, **Courses** (dropdown), Technical Training, Admissions, Resources, Contact Us — each a text button with a 2px bottom border that highlights `#B4561A` on the active route, transparent otherwise. Courses dropdown opens on click (`onClick`, not hover) and closes on `onMouseLeave` of the wrapping div; panel is 340px wide, white, bordered, radius 14px, shadow, lists the 5 "published programs" (title + category) plus a "View all courses →" link to `/courses`. Followed by "Student Login" (white/outline button) and "Enquire Now" (rust button, `margin-left:6px`).
- **Mid-width (600–1180px):** inline "Student Login" (text button, green) + "Enquire Now" (rust button) shown next to the hamburger.
- **Narrow (<600px):** hamburger only — button labelled "Menu"/"Close" (text label, no icon), `aria-expanded`, `aria-controls="mobile-menu"`.
- Active state is computed off current route; Courses/CourseDetail routes also light up the "Courses" nav item.

### 2.2 Mobile menu (`#mobile-menu`)
- Slides in below header on toggle, `border-top:1px solid #E7E1D3`, bg `#FAF7F0`, scrollable (`max-height: calc(100vh - 72px)`).
- Stacked nav buttons (left-aligned, 48px min-height, bottom-divider `#ECE6D9` each, 17px text).
- "COURSES" eyebrow label (`#8A5A2E`) followed by the 5 published-program buttons (16px, `#3A4459`).
- Full-width "Enquire Now" (rust) then full-width "Student Login" (outline) buttons at the bottom.

### 2.3 Mobile sticky action bar
- `position:sticky; bottom:0; z-index:30`, bg `rgba(250,247,240,.97)`, top border `#E1DACB`.
- 2-column grid: "Courses" (white/outline, links to `/courses`) + "Enquire Now" (rust, scrolls to `#enquire` or routes to Admissions with `toForm`). Both 48px min-height.
- Visible whenever `narrow` (width < 1180px) — i.e. on tablet and mobile, present on every page screenshot reviewed.

### 2.4 Footer
- Background `#16213A`, text `#C9CEDA`, padding `clamp(48px,7vw,80px) 0 28px`.
- 4-column grid (`auto-fit`, min 200px): brand column (wordmark, one-paragraph description, address + phone) + 3 nav columns from data (**ACADEMY**: About Us/Courses/Technical Training/Admissions; **INFORMATION**: Resources/Updates/FAQ/Contact Us/Student Portal; **LEGAL**: Privacy Policy/Terms & Conditions/Refund Policy/Accessibility).
- Bottom bar (`border-top:1px solid #2E3B5E`): "© 2026 SPRS INFOTECH PVT LTD", "Admin / Staff Login" link, "Design audit" link (both muted `#9AA3B5`, underlined) on the left; Instagram/Facebook/LinkedIn text links (`#E9E4D8`, `target="_blank" rel="noopener"`) on the right.
- FAQ footer link routes to `/admissions` (FAQ has no standalone route — it's embedded in Home and Admissions only).

### 2.5 Buttons — all variants and states
| Variant | Default | Hover | Notes |
|---|---|---|---|
| Primary (navy) | bg `#16213A`, text `#fff` | bg `#24345A` | "View Course", "View Details", "Explore Courses" |
| Conversion (rust) | bg `#B4561A`, text `#fff` | bg `#94450F` | "Enquire Now" everywhere |
| Secondary (outline) | bg `#fff`, border `#CFC7B5`, text `#16213A` | border → `#16213A` (or `#B4561A` + text `#B4561A` on course-card "Enquire") | "Student Login", "All 15 courses" |
| Text link button | no bg/border, text `#1E5A43` | text `#B4561A` | "View details →", "Learn more about us →" |
| Chip/filter (inactive) | bg `#fff`, border `#CFC7B5`, text `#16213A` | — | category/level filters |
| Chip/filter (active) | bg `#16213A`, text `#fff`, border `#16213A` | — | `aria-pressed="true"` |
- Standard button radius 10px, min-height 44–48px (52px on the Enquiry submit). Chips: radius 999px, min-height 36–42px.
- **No disabled-button state is defined anywhere in the source** — flagged as a gap (§7).
- Focus state is global: `:focus-visible{outline:3px solid #B4561A;outline-offset:2px;border-radius:6px}`.

### 2.6 Cards
- Course/program card: white bg, `1px solid #E7E1D3`, radius 18px; hover → border `#B9AF99`, shadow, `translateY(-2px)`, `transition .2s`.
- Clickable category/area cards use the identical hover treatment but are `<button>` elements, not `<article>`.
- "1px gap grid on a coloured background" trick creates hairline dividers for the "Why SRS Academy" and "Our values" grids (cells sit on `#E7E1D3`, creating 1px seams).

### 2.7 Forms / inputs — states and validation
- Inputs: height 50px (54px for the courses search), border `#CFC7B5`, radius 10–12px, 16–17px text.
- Focus: `outline:3px solid rgba(180,86,26,.35)` (+ `border-color:#B4561A` on the search field).
- **Error state:** border → `#C0432A`, inline error text in `#A0321C` below the field, `aria-invalid="true"`, `aria-describedby` pointing at the error span. Validation runs only after the first submit attempt (`tried` flag) — not on blur/live before that.
- **Error summary banner:** `role="alert"`, bg `#FBEAE6`, border `#E8B4A8`, text `#8A2A16`, shown above the form fields, reads "Please fix N field(s) below."
- **Success state:** replaces the entire form card with a check-icon + "Thank you, {name}." + "Your enquiry about **{course}** has been captured." + an explicit **prototype disclaimer** ("Prototype state — nothing was sent...") + "Send another enquiry" button. The disclaimer text must **not** ship as-is; it documents that the prototype has no backend.
- Enquiry form fields: Full name* (text), Mobile number* (tel, validated as 10-digit Indian mobile after stripping `+91`/`91`/`0` prefix, regex `^[6-9]\d{9}$`), Email (optional, regex-validated if filled), Course of interest* (select — options = 5 programs + 15 online courses + "Not sure yet"), Preferred format (select — No preference / Online / Need guidance), Message (optional, textarea, 3 rows).
- No honeypot/anti-spam/rate-limit field exists in this *design* file (unlike the real backend in `repo-analysis.md`, which has a honeypot, 1.2s fill-timer and rate limiting) — the visual form must be wired to the existing `/api/contact` behaviour, not a new one.

### 2.8 Badges / pills
- Category tag: green-tint bg `#E3EEE7`, text `#1E5A43`, pill.
- Warning/status tag ("Admissions open*", "Proposed online course", "Proposed learning model", "DETAILS TO BE CONFIRMED"): saffron-tint bg `#F6E7D6`, text `#8A3F0E`, pill or rounded-rect.
- Resource status pills: "Coming soon" (bg `#F6E7D6`/text `#7A3A10`) vs "For students" (bg `#E3EEE7`/text `#174A36`).
- Count pill (e.g. category card program count): bg `#F4EFE4`, text `#5A6477`, pill.

### 2.9 Accordion pattern (shared by FAQ and Curriculum modules)
- `<button>` header with `aria-expanded`, `aria-controls`, a `+`/`−` sign (aria-hidden), min-height 60px, hover bg `#FBF8F2` (modules) or text colour change to `#B4561A` (FAQ).
- Only one item open at a time in each instance (`faqOpen`/`modOpen` single-index state) — i.e. it is **not** a multi-expand accordion.
- Content panel uses `id` matching `aria-controls`.

### 2.10 Image slots
- All imagery outside the 15-course catalogue is an `<image-slot>` placeholder with descriptive alt-style text (e.g. "Hero photo: Indian learners working on laptops — approved SRS photography") — **none of these are final assets**.
- The 15 online-course cards use **real Unsplash stock photos** with visible photographer credit overlays ("Photo by X on Unsplash") linking to the photographer's Unsplash profile — these are explicitly flagged in the design's own "to confirm" list as needing replacement with licensed/approved photography before launch.

---

## 3. Pages and sections

### 3.1 Home (`/`)
- **Hero:** eyebrow "ONLINE TECHNOLOGY ACADEMY · KOLKATA & MUMBAI", H1 "Learn skills. Build confidence. Shape your future.", intro paragraph, "Explore Courses" (navy) + "Enquire Now" (outline) buttons, 3-item inline feature list (online-first learning / project-based programs / SRS Certificate of Completion), hero image with faint lattice-pattern backdrop and a floating "FEATURED PROGRAM — Full Stack Web Development" card overlapping the image bottom-left.
- **Explore Our Online Courses:** eyebrow "ONLINE COURSES · PROPOSED CATALOGUE", H2, intro, "Explore All 15 Courses" CTA (rust), 6-card grid of featured items from the 15-course catalogue (digital-literacy, ai-dm-basic, data-entry-excel, spoken-english, bridal-makeup, mehendi), each card: image + credit, category/number row, title, description, duration/online meta row, "View Course" + "Enquire Now" buttons. Footnote: "Proposed courses shown for review. Availability, fees and certificates are to be confirmed before enrolment opens."
- **Three areas, one practical approach:** eyebrow "COURSE AREAS", H2, "Browse all courses →" link, 3 clickable category cards (Web & Software Development / AI & Technology / Digital & Business Skills) each showing a number, program-count pill, name, description, member-program list, "View courses →".
- **Start with a program built around real projects:** eyebrow "FEATURED COURSES", H2, split layout — large Full Stack Web Development card (category + "Admissions open*" pills, title, description, duration/mode/level stat row, 6 skill chips, "View Details"+"Enquire Now", footnote "*Admissions open based on current course availability.") next to a 2×2 grid of the other 4 programs (AI, Technology Programs, Business & Entrepreneurship, Digital Skills), each with "Duration: to be confirmed" and "View details →".
- **Why SRS Academy:** eyebrow, H2 "Learning that comes from real technology work", 5-cell hairline grid (numbered 1–5: Practical and project-based / Rooted in real industry work / Structured curriculum / Learn online, from anywhere / Certificate of Completion).
- **About teaser:** image + eyebrow "ABOUT THE ACADEMY", H2 "The training initiative of SPRS Infotech Pvt Ltd", paragraph, pull-quote mission statement with "— Our mission" attribution, "Learn more about us →".
- **How You Learn (dark section):** bg `#16213A`, eyebrow "HOW YOU LEARN" (`#E9A56E`), H2 "Learn. Build. Advance.", 3-column image+eyebrow+title+body (Understand the why / Make real things / Keep growing).
- **Student Stories (Testimonials):** eyebrow "STUDENT STORIES", H2 "In our learners' words", explicit badge "Placeholder — replace with real, consented testimonials", 3 dashed-border cards each with bracketed quote `[Approved student quote — 2–3 sentences...]`, circle photo placeholder, `[Student name]`, `[Program · batch]`. **Must be hidden entirely per §6, not shipped as placeholder.**
- **Global Enquiry section + Global FAQ section** appear at the bottom (shared markup — see §3.13/3.14).

### 3.2 About (`/about`)
- Hero: eyebrow "ABOUT US", H1 "Practical technology experience, turned into structured learning.", intro paragraph.
- **Our story:** 2-up layout — text column (2 paragraphs) + fact `dl` (Parent company: SPRS INFOTECH PVT LTD / Chief Executive Officer: **S Roy** / Learning format: Primarily online / Presence: Kolkata · Mumbai) alongside a portrait-ratio image placeholder.
- **Mission / Vision:** 2-up cards, cream bg, mission (`#8A5A2E` eyebrow) and vision (`#1E5A43` eyebrow) statements in Newsreader 23px.
- **Our values:** H2, 6-cell hairline grid (Practical Learning, Continuous Growth, Clarity, Accessibility, Curiosity, Responsibility).
- CTA row: "Explore what we teach" (navy) + "Contact us" (outline).
- ⚠️ "S Roy" / CEO credit is a **real fact to preserve** (per repo-analysis §7.5), not a placeholder — but it is the kind of fact a reviewer should double check against the live source of truth before shipping.

### 3.3 Courses (`/courses`) — combines TWO course concepts on one route
- **Hero band:** eyebrow "ALL COURSES", H1 "Explore Our Online Courses", intro, badge "Proposed online course demos — enrolment opens once confirmed", search input (`type="search"`, placeholder `Try "Excel", "mehendi", "AI" or "English"`), category chip row (All + 6 categories from the 15-course catalogue).
- **Online-courses grid:** `aria-live="polite"` result count label, responsive grid of the **15-item catalogue** (same card component as Home), empty state "No online courses match" / "Try a broader search or another category." / "Show all courses" reset button.
- **"Published SRS Programs" section (second, distinct catalogue on the same page):** eyebrow "PUBLISHED SRS PROGRAMS" (`#1E5A43`), H2 "Current technology programs", subcopy "The five programs listed on srstechacademy.com today.", area filter chips + level filter chips (separate `role="group"`s), result label, grid of the **5-item programs catalogue** (duration/level stat row, "View Course Details" + "Enquire" buttons), empty state "No published programs match these filters." / "Clear filters".
- ⚠️ This dual-catalogue structure (15 "proposed" demo courses + 5 "published" structured programs, both on `/courses`) is a major structural decision that conflicts with the 418-dynamic-course constraint — see §6.2 and §7.

### 3.4 Program/Course detail (`/programs/[slug]`) — the 5 "published programs"
- Hero band (tinted lattice bg): breadcrumb (Home / Courses / Title), eyebrow category, H1, long description, 4-cell stat strip (Duration / Mode / Level / **Fee: "To be announced"**), "Enquire About This Course" (rust) + "Admissions open based on current course availability." note.
- **Verified branch (Full Stack only, `cp.verified`):** "What you will learn" (8-item checklist grid), "Curriculum" accordion (7 modules — see data below), "Who can apply" (2 paragraphs).
- **Unverified/TBC branch (other 4 programs, `cp.isTbc`):** single dashed-border box, "DETAILS TO BE CONFIRMED" label, H2 "Curriculum, duration and eligibility are being finalised", explicit note "This page uses the same template as Full Stack Web Development."
- **Certification** (shown on both branches): paragraph about the SRS Academy Certificate of Completion + `[Certificate verification process — to be confirmed]` in warning colour.
- Sticky aside (desktop only, `top:96px`): "Interested in this course?" + "The fee hasn't been announced yet..." + "Enquire Now" + "RELATED COURSES" (up to 3, same-category first).
- Full Stack's 7-module curriculum (titles only, for content parity checks): Web Foundations · JavaScript & Programming Fundamentals · Modern Frontend Development · Backend & APIs · Databases & Application Data · Development Workflow & Deployment · Practical Project.

### 3.5 Online-course detail (`/courses/[slug]`) — the 15-item catalogue
- Hero band (tinted lattice bg): breadcrumb (Home / Online courses / Title), category pill + "Proposed online course" pill, H1, description, 4-cell stat strip (Duration / Format: Online / Level: Beginner / **Fee: "To be announced"**), "Enquire Now" + "All 15 courses" buttons, detail image with credit.
- **Course overview** (auto-generated sentence appending duration), **What you will learn** (checklist derived from the card description), **How online learning works** (5-format grid: Recorded video lessons / Audio lessons / Live Google Meet sessions / Downloadable notes / Instructor feedback — badge "Proposed learning model" + disclaimer "These services are still being set up and will be confirmed before enrolment."), **Practical assignments** + **Device & internet** (2-up lists, content varies by category via `CAT_INFO` lookup), **Who this course is for** (category-specific).
- Sticky aside: "Interested in this course?" + "Send an enquiry to hear when enrolment opens, plus fees and batch timing." + "Enquire Now" + related courses (with thumbnail images, unlike the programs version).

### 3.6 Technical Training (`/technical-training`)
- Hero: eyebrow, H1 "Software, web and AI skills — taught the way they're used at work", intro, image.
- "Technical programs" — 3 cards (Full Stack, AI, Technology Programs — i.e. every program **except** the "Digital & Business Skills" category), each with "View Course Details" (navy).
- Reused "Learn/Build/Advance" 3-cell text-only grid (no images here, just eyebrow+paragraph).

### 3.7 Admissions (`/admissions`)
- Hero: eyebrow "ADMISSIONS & ENQUIRY", H1 "Start with a conversation", intro.
- 4-step `<ol>` (Explore courses → Send an enquiry → Talk to the team → Enrol), step 3 note `[Counselling call — confirm]`, step 4 note `[Enrolment & payment steps — confirm with SRS]`.
- Footnote: "Steps 3–4 are a proposed flow — confirm the actual admission process before launch."
- Followed by the global Enquiry section **and** global FAQ section (both shown on this page).

### 3.8 Contact (`/contact`)
- Hero only: eyebrow "CONTACT US", H1 "We're here to help you choose", intro.
- Followed by the global Enquiry section (shown) — **no FAQ section** on Contact.

### 3.9 Legal pages (`/privacy`, `/terms`, `/refund-policy`, `/accessibility`)
- Shared template, narrow 820px container. Tab bar (`role="tablist"`) switching between the 4 policies (pill buttons, active = navy).
- H1 = policy title. Meta line: "Last updated: **[date from current page]** · Applies to srstechacademy.com" — the date is itself a placeholder instruction.
- Dashed migration notice: "Migrate the existing wording from **{path}** unchanged. This template only restyles it — legal text was not rewritten in this prototype."
- Section headings per policy (e.g. Privacy: Information we collect / How we use your information / Sharing and retention / Your rights and contact) each followed by literal placeholder body text `[Existing policy text]`.
- ⚠️ Per `repo-analysis.md`, the *real* legal content already exists in the live repo (PR #23, merged) — this design's legal pages are a **restyle template only**; the actual copy must come from the existing site, not be invented.

### 3.10 Resources (`/resources`)
- Hero: eyebrow, H1 "Learning resources", intro "Resources appear here once they're published."
- 4 cards: Course guides ("Coming soon"), Lesson notes & downloads ("For students", CTA "Student Login" → `/student-portal/login`), Getting started online ("Coming soon"), Study & career tips ("Coming soon").
- Empty-state dashed panel: "No public resources published yet" / "We haven't added any downloadable files yet..." + "Explore courses" (rust) + "Contact us" (outline).

### 3.11 Updates (`/updates`)
- Hero: eyebrow "UPDATES", H1 "Updates & news", intro.
- Primary card: "No updates published yet" + "New posts will appear here. To ask about current admissions, send an enquiry." + "Enquire Now" (rust).
- Secondary column labelled "UPDATE CARD LAYOUT · PLACEHOLDER": 3 fully bracketed dashed cards — `[Date] · [Category]`, `[Update title]`, `[Short summary, 1–2 lines]`.

### 3.12 Design audit (`/design-audit`) — prototype-only meta page
- This is the prototype author's own process documentation: competitor audit notes (5 sites reviewed, adopt/avoid lists), structure decisions, a content-to-confirm list, the colour swatches, type/button/layout specs, an SEO URL/title table, and an "Implementation & QA status" list admitting no code/lint/build was run.
- It is linked from the public footer ("Design audit"). **This entire page and its footer link almost certainly should not ship to production** — flag explicitly for a product decision (see §6/§7).

### 3.13 Global Enquiry section (`#enquire`)
- Shown on: Home, Course detail, Admissions, Contact, Online-course detail (`showEnquiry` = those 5 pages only — not Courses, Technical Training, Resources, Updates, Legal, Audit).
- 2-up layout: left = eyebrow "ENQUIRE", H2 "Tell us what you'd like to learn", intro, contact `dl` (Address: "5C, Webel More, Salt Lake City, Sector V, Kolkata" / Phone: "+91-900007799" with inline warning "[verify — appears to be 9 digits]" / Email: "[Academy email — confirm; obscured on current site]" in warning colour / Follow: Instagram/Facebook/LinkedIn links). Right = the form card (see §2.7).

### 3.14 Global FAQ section
- Shown on: Home, Admissions only (`showFaq`).
- Eyebrow "FAQ", H2 "Frequently asked questions", single-expand accordion, 7 items (Which courses are available? / Who can enrol? / How long are the courses? / Are classes online or offline? / What are the fees? / Will I receive a certificate? / How do I enquire or apply?).
- Content of these answers references "five programs" and "a catalogue of 15 proposed online courses" — copy that must be rewritten once course data is dynamic (§6.2).

---

## 4. Checklist

### Global tokens & system (1–14)
- [ ] 1. Page background colour is `#FAF7F0` (not `#EFE9DC` or any other cream) everywhere the design shows ivory/cream.
- [ ] 2. Primary text/ink colour is `#16213A`; body copy uses `#3A4459` (or `#4A5468` inside cards) — not a single flattened "gray".
- [ ] 3. Conversion/"Enquire Now" buttons use `#B4561A` default / `#94450F` hover, consistently, on every instance across every page.
- [ ] 4. Primary navy buttons use `#16213A` default / `#24345A` hover.
- [ ] 5. Links and tags use `#1E5A43`, hovering to `#B4561A` (global `a:hover` rule too).
- [ ] 6. Eyebrow/kicker labels are 13.5px, weight 600, `letter-spacing:.1em`, colour `#8A5A2E`, uppercase.
- [ ] 7. Headings render in Newsreader (weight 500, except the 600-weight wordmark); body/UI renders in Mukta.
- [ ] 8. H1 clamp ranges match the per-page table in §1.2 (not one shared value reused everywhere).
- [ ] 9. Card border default is `1px solid #E7E1D3`; hover border is `#B9AF99` with the specified shadow + `translateY(-2px)`.
- [ ] 10. Every "to be confirmed / not yet available" block uses the dashed `1.5px dashed #CFC7B5` convention, not a solid border or plain text.
- [ ] 11. `:focus-visible` shows a 3px solid `#B4561A` outline with 2px offset and 6px corner radius on every interactive element (buttons, links, inputs, chips, accordion headers).
- [ ] 12. `prefers-reduced-motion: reduce` disables all transitions/animations/smooth-scroll site-wide.
- [ ] 13. Radii are applied per component class correctly: 999px pills, 10px buttons/inputs, 16–20px cards, 6px focus outline — not a single global radius.
- [ ] 14. No shadow is rendered at rest on cards/buttons — shadows appear only on hover/elevated states.

### Header & navigation (15–28)
- [ ] 15. Header is sticky, `rgba(250,247,240,.96)` with backdrop blur, bottom border `#E7E1D3`, 72px tall on desktop.
- [ ] 16. Logo is a button (not a link styled as one unless semantically equivalent) with `aria-label="SRS Academy home"` and routes to `/`.
- [ ] 17. Desktop nav shows exactly: Home, About Us, Courses (dropdown), Technical Training, Admissions, Resources, Contact Us, Student Login, Enquire Now.
- [ ] 18. Courses dropdown opens on click (not hover-only) and lists the 5 published programs + "View all courses →"; it closes on mouse-leave of the wrapper.
- [ ] 19. Active nav item shows a 2px bottom border in `#B4561A`; Courses also activates for `/programs/[slug]` program detail and online-course detail routes.
- [ ] 20. Header collapses to hamburger below the real breakpoint used by the implementation — confirm and document whichever width is chosen (design's logic says 1180px, design's own copy says 920px — these conflict, see §7.1).
- [ ] 21. Between the hamburger breakpoint and 600px, inline "Student Login" (text) + "Enquire Now" (button) still show next to the hamburger.
- [ ] 22. Below 600px, only the hamburger ("Menu"/"Close" text label) shows in the header bar.
- [ ] 23. Hamburger button has `aria-expanded` and `aria-controls="mobile-menu"` wired correctly.
- [ ] 24. Mobile menu panel lists all 7 top nav items, then a "COURSES" eyebrow + the 5 published programs, then full-width Enquire Now + Student Login buttons.
- [ ] 25. Mobile menu is scrollable and capped at `calc(100vh - 72px)`.
- [ ] 26. Mobile sticky Courses/Enquire bar is present on every page below the nav-collapse breakpoint, 2-column grid, 48px min-height buttons.
- [ ] 27. "Student Login" routes to `/student-portal/login`; "Admin / Staff Login" (footer) routes to `/admin/login` — confirm these are real, working routes (or a deliberate decision to remove them — see §7.6).
- [ ] 28. Header background uses `backdrop-filter: blur(10px)` — verify fallback/behaviour for browsers without backdrop-filter support.

### Footer (29–36)
- [ ] 29. Footer background `#16213A`, text `#C9CEDA`.
- [ ] 30. Footer brand column shows wordmark, one description paragraph, address, and phone.
- [ ] 31. Three footer nav columns match the data exactly: ACADEMY (About Us, Courses, Technical Training, Admissions), INFORMATION (Resources, Updates, FAQ→/admissions, Contact Us, Student Portal), LEGAL (Privacy Policy, Terms & Conditions, Refund Policy, Accessibility).
- [ ] 32. Footer bottom bar shows "© 2026 SPRS INFOTECH PVT LTD" and the three social links (Instagram/Facebook/LinkedIn, `target="_blank" rel="noopener"`, matching the exact URLs in repo-analysis §7.6).
- [ ] 33. Footer "Admin / Staff Login" and "Design audit" links are present only if a product decision confirms they should ship (default recommendation: remove "Design audit" — see §6/§7).
- [ ] 34. Footer link colour/hover states match: body links `#C9CEDA`→`#fff`, social links `#E9E4D8`.
- [ ] 35. Footer year "© 2026" is correct/current at ship time (not stale from the design file).
- [ ] 36. Footer FAQ link correctly routes to `/admissions#faq` or equivalent (FAQ has no standalone page).

### Buttons, forms, cards, badges (37–54)
- [ ] 37. Every button variant (primary/conversion/secondary/text-link/chip) matches the state table in §2.5, including hover colours.
- [ ] 38. A disabled-button visual state is defined and used appropriately even though the source design never shows one (e.g. submit button during in-flight network request) — flagged gap, implementation must design this.
- [ ] 39. Course/program search input is 54px tall, placeholder reads exactly `Try "Excel", "mehendi", "AI" or "English"` (or an updated placeholder reflecting real course names once dynamic).
- [ ] 40. Form field focus ring is `3px solid rgba(180,86,26,.35)`; invalid fields get `#C0432A` border + `#A0321C` message text + `aria-invalid`/`aria-describedby`.
- [ ] 41. Mobile number validates as a 10-digit Indian mobile (`^[6-9]\d{9}$`) after stripping `+91`/`91`/`0` prefixes; email is optional but validated if present; course-of-interest is required.
- [ ] 42. Validation errors only appear after the first submit attempt, not on first blur/keystroke.
- [ ] 43. Error summary banner (`role="alert"`, `#FBEAE6`/`#E8B4A8`/`#8A2A16`) appears above the fields when submit fails, reading "Please fix N field(s) below."
- [ ] 44. Successful submission replaces the form with the thank-you state (check icon, name, course, "Send another enquiry") — and does **not** ship the literal "Prototype state — nothing was sent" sentence; it must reflect a real, working submission to the existing `/api/contact` backend (honeypot + 1.2s timer + rate limit preserved per repo-analysis).
- [ ] 45. Accordion components (FAQ, Curriculum modules) only allow one open item at a time per instance, with `+`/`−` sign toggling and correct `aria-expanded`/`aria-controls`.
- [ ] 46. Category tag pill = green tint (`#E3EEE7`/`#1E5A43`); warning/status pill = saffron tint (`#F6E7D6`/`#8A3F0E`); resource pills = green ("For students") vs orange ("Coming soon") exactly as specified.
- [ ] 47. Course/program cards show: image, category + number, title, description, Duration/Online meta row, View + Enquire button pair — in that order, on every card instance (home, courses grid, related-courses).
- [ ] 48. Image placeholders for non-catalogue photography carry meaningful `alt` text describing the required shot (not empty/generic alt).
- [ ] 49. The 15-course catalogue's Unsplash photo credits are either (a) replaced with licensed photography before launch, or (b) if temporarily kept, retain correct photographer attribution and link — per the design's own flag.
- [ ] 50. Chips/filter buttons use `aria-pressed` correctly reflecting active state.
- [ ] 51. `role="group"` with `aria-label` is present on every filter button cluster (category filters, level filters).
- [ ] 52. Breadcrumbs on detail pages use `aria-current="page"` on the final crumb and match the correct trail label per template (confirm §7.7 contradiction is resolved one way).
- [ ] 53. Sticky asides on detail pages (`top:96px`) don't overlap the sticky mobile action bar or get clipped on shorter viewports.
- [ ] 54. All icon-only glyphs (▾ dropdown caret, ✓ checklist marks, +/− accordion signs, → arrows) are `aria-hidden="true"` with real text alternatives available to screen readers.

### Home (55–74)
- [ ] 55. Hero eyebrow reads "ONLINE TECHNOLOGY ACADEMY · KOLKATA & MUMBAI"; H1 "Learn skills. Build confidence. Shape your future."
- [ ] 56. Hero CTAs are "Explore Courses" (navy) and "Enquire Now" (outline) — not both rust, not swapped.
- [ ] 57. Hero 3-item feature list (Online-first learning / Project-based programs / SRS Certificate of Completion) renders with green dot bullets.
- [ ] 58. Hero image has the lattice-pattern decorative backdrop and the floating "FEATURED PROGRAM" card overlapping its bottom-left corner.
- [ ] 59. "Explore Our Online Courses" section shows exactly 6 featured cards from the 15-item catalogue (digital-literacy, ai-dm-basic, data-entry-excel, spoken-english, bridal-makeup, mehendi) in the design — confirm this becomes a dynamic "featured" selection once courses are real data, not a hardcoded 6.
- [ ] 60. "Explore All N Courses" button label reflects the **real, dynamic** course count — never hardcodes "15".
- [ ] 61. Footnote "Proposed courses shown for review..." either updates to reflect real availability or is removed once courses are live.
- [ ] 62. "Three areas, one practical approach" shows exactly 3 clickable category cards with correct program counts per category.
- [ ] 63. Featured "Full Stack Web Development" card shows category + "Admissions open*" pills, 6 skill chips, and the footnote disclaimer.
- [ ] 64. The 4 "other programs" mini-cards show "Duration: to be confirmed" only while genuinely unconfirmed — not as permanent copy.
- [ ] 65. "Why SRS Academy" renders exactly 5 numbered items with the hairline-grid treatment.
- [ ] 66. About teaser section shows the mission pull-quote with "— Our mission" attribution styled as a `<footer>` inside the `<blockquote>`.
- [ ] 67. "How You Learn" section has `#16213A` background, `#E9A56E` eyebrow, white H2, and exactly 3 columns (Understand the why / Make real things / Keep growing).
- [ ] 68. Testimonials/"Student Stories" section is **hidden entirely** (not rendered with placeholder content) until real, consented testimonials exist — verify no bracketed placeholder text ships (overrides the design; see §6.4).
- [ ] 69. Global Enquiry section appears once at the bottom of Home.
- [ ] 70. Global FAQ section appears once at the bottom of Home, after Enquiry.
- [ ] 71. Section order top-to-bottom matches: Hero → Online courses → Course areas → Featured programs → Why SRS → About teaser → How You Learn → (Testimonials, if shown) → Enquiry → FAQ.
- [ ] 72. Mobile layout stacks every multi-column grid to 1 column in the order shown in `mobile-01` through `mobile-09`.
- [ ] 73. Mobile hero CTAs and feature list wrap correctly at 390px width without overflow (per `mobile-01`).
- [ ] 74. "Learn. Build. Advance." dark section background doesn't bleed/clip oddly at mobile widths (per `mobile-06`/`mobile-07`).

### About (75–85)
- [ ] 75. Hero H1 reads "Practical technology experience, turned into structured learning."; subcopy mentions "primarily online, with presence and support in Kolkata and Mumbai."
- [ ] 76. "Our story" fact `dl` shows Parent company / Chief Executive Officer ("S Roy") / Learning format / Presence — verify "S Roy" is current and correct against the authoritative source before shipping (business-sensitive fact, not a placeholder to alter casually).
- [ ] 77. Mission card uses `#8A5A2E` eyebrow; Vision card uses `#1E5A43` eyebrow — distinct colours, not identical.
- [ ] 78. Mission/Vision copy is Newsreader 23px, line-height 1.45, inside cream-bg cards.
- [ ] 79. "Our values" grid shows exactly 6 items with the exact titles/descriptions in §3.2.
- [ ] 80. CTA row shows "Explore what we teach" (navy) + "Contact us" (outline), in that order.
- [ ] 81. About-page portrait image is `aspect-ratio:4/5`, `max-height:560px`.
- [ ] 82. About teaser blockquote wording matches the Home page's mission quote exactly (no copy drift between the two instances).
- [ ] 83. Mobile stacking order for About matches screenshots (hero → story+photo → mission/vision → values → CTA).
- [ ] 84. All About-page image placeholders carry distinct, specific alt/placeholder text (office photo vs. team photo vs. hero photo — not interchangeable generic text).
- [ ] 85. No fee, price or accreditation claim appears anywhere on About (per repo README content rule, reiterated in repo-analysis §7.8).

### Courses page (86–104)
- [ ] 86. Hero shows eyebrow "ALL COURSES", H1 "Explore Our Online Courses", and the "Proposed online course demos..." badge — or updated copy once courses are live/dynamic.
- [ ] 87. Search input filters the course grid live (debounced or immediate per implementation choice), and the `aria-live="polite"` result count updates accordingly.
- [ ] 88. Category chip row includes "All Courses" plus every distinct category present in the **real, dynamic** dataset — not the 6 hardcoded demo categories once course data is live.
- [ ] 89. Empty state "No online courses match" / reset button appears when filters produce zero results.
- [ ] 90. A second, clearly labelled "Published SRS Programs" section exists below the main catalogue, OR a product decision has merged the two course concepts into one unified, dynamic catalogue (resolve per §6.2/§7.8 — do not ship two silently-different course lists without an explicit decision).
- [ ] 91. If the dual-list structure is kept, area filter chips and level filter chips are separate `role="group"`s with independent `aria-label`s.
- [ ] 92. "Published programs" empty state "No published programs match these filters." / "Clear filters" works correctly.
- [ ] 93. With 418 real courses, the catalogue has a working pagination, infinite-scroll, or virtualization strategy — the design shows none; this must be designed and implemented (see §7.9).
- [ ] 94. Course cards on this page use the identical component/markup as the Home page's course cards (no divergent styling).
- [ ] 95. Grid is `auto-fill, minmax(min(100%,300px),1fr)` with 24px gap — confirm no fixed 3-column lock-in that breaks at odd widths.
- [ ] 96. Mobile Courses page stacks filters above the grid, full width, with adequate tap targets (≥42px chip height).
- [ ] 97. Course count copy ("Showing X of Y") is accurate against the real dataset size, not hardcoded.
- [ ] 98. No course on this page displays a fee, price range, or "₹" anywhere, even as a placeholder ("To be announced" is acceptable **only** if the fee row isn't removed entirely per §6.3 — resolve and apply consistently).
- [ ] 99. Category and level chip active/inactive states use the exact colour pairs from §2.5.
- [ ] 100. The "Try 'Excel', 'mehendi', 'AI' or 'English'" search placeholder is either kept (if still representative) or updated to reflect real course names in the live 418-course catalogue.
- [ ] 101. Breadcrumb trail label for course items reached from this page says "Courses" (not "Online courses") if the two catalogues are merged — consistency check against §3.5.
- [ ] 102. Course cards' "View Course" / "View Course Details" button labels are consistent for a single, merged course concept (the source uses two different labels for its two different lists — resolve to one).
- [ ] 103. No orphaned "15" or "5" count ever appears in static copy anywhere on this page once the catalogue is dynamic.
- [ ] 104. Course grid images lazy-load below the fold (`loading="lazy"`), matching the design's own implementation note.

### Course / Program detail (105–125)
- [ ] 105. Breadcrumb reads Home / Courses / {Title} with `aria-current="page"` on the title.
- [ ] 106. Hero stat strip shows Duration / Mode / Level / Fee, and the **Fee row never shows a number** — it is either removed or shows "Contact us" / equivalent non-numeric copy per §6.3, never "To be announced" if that's deemed misleading, resolve per product decision.
- [ ] 107. "Admissions open based on current course availability." note appears next to the Enquire CTA on verified/open courses only.
- [ ] 108. Verified-course branch shows: What you will learn (checklist grid), Curriculum accordion, Who can apply — matching the Full Stack content model exactly when applied to Full Stack.
- [ ] 109. Curriculum accordion has exactly 7 modules for Full Stack, each with a description and a topic-chip row, single-expand behaviour.
- [ ] 110. TBC-course branch shows the single dashed "DETAILS TO BE CONFIRMED" box with the exact disclosure that this page reuses the Full Stack template — or, once real content exists for these programs, the TBC branch is retired for that course.
- [ ] 111. Certification section text and the `[Certificate verification process — to be confirmed]` line are either resolved (real process documented) or kept honestly marked as unconfirmed — never silently removed without resolution.
- [ ] 112. Sticky aside appears only ≥ the breakpoint where it fits without overlapping content, `top:96px`.
- [ ] 113. Related courses in the aside prioritize same-category items first, then fill with others, capped at 3.
- [ ] 114. "Enquire About This Course" / "Enquire Now" button pre-fills the course-of-interest field with this course's title when routing to the Enquiry form.
- [ ] 115. No course-detail page anywhere displays student counts, placement stats, accreditation claims, or testimonials not explicitly approved (per repo README content rule).
- [ ] 116. 8-item "What you will learn" checklist uses green ✓ marks (`aria-hidden`) consistently.
- [ ] 117. Mobile layout stacks: hero → learn checklist → curriculum accordion → who can apply → certification → (aside content relocated below, not hidden).
- [ ] 118. Programs with `level`/`duration`/`mode` = "To be confirmed" show that exact copy, not blank fields or "N/A".
- [ ] 119. Program detail page title (`document.title` / `<title>`) matches "{Program title} — SRS Academy" pattern.
- [ ] 120. Deep-linking directly to `/programs/[slug]` loads the correct program without requiring client-side navigation from Home first.
- [ ] 121. Unknown/invalid `[slug]` falls back gracefully (design has no defined 404 behaviour here — see §7.10) rather than crashing or showing blank content.
- [ ] 122. Skill chips on verified programs (e.g. "HTML & CSS", "React") render in a wrapping flex row, not a fixed-width overflow.
- [ ] 123. "Who can apply" copy for Full Stack states no prior professional experience is required and lists the practical prerequisites (device, internet, willingness to practise).
- [ ] 124. Hero section uses the lattice-pattern tinted background (`#F4EEE1` + repeating-linear-gradient), distinct from plain-white body sections below it.
- [ ] 125. Any program whose data later becomes "verified" (real curriculum published) correctly swaps out of the TBC branch into the full verified template without manual page rebuild.

### Online-course detail (126–140)
- [ ] 126. Breadcrumb reads Home / Online courses / {Title}.
- [ ] 127. Hero shows category pill + "Proposed online course" pill, 4-cell stat strip (Duration / Format: Online / Level: Beginner / Fee: resolved per §6.3), "Enquire Now" + "All {N} courses" (dynamic count) buttons.
- [ ] 128. Course overview paragraph is not a templated auto-generated sentence in production copy (the design literally concatenates `desc + duration` into a sentence) — real copy should be authored per course once content exists, or the auto-generation logic is accepted as an intentional, reviewed pattern.
- [ ] 129. "How online learning works" shows the 5-format grid with the "Proposed learning model" badge and the disclaimer sentence — or is updated once the actual delivery model is confirmed.
- [ ] 130. "Practical assignments" and "Device & internet" content is category-specific (6 distinct `CAT_INFO` entries) — verify no category silently falls back to the wrong set.
- [ ] 131. "Who this course is for" paragraph is category-specific, not generic boilerplate repeated across all 15/418 courses.
- [ ] 132. Sticky aside copy differs intentionally from the Programs-detail aside ("hear when enrolment opens, plus fees and batch timing" vs. "fee hasn't been announced yet") — confirm this distinction is deliberate or should be unified.
- [ ] 133. Related courses in this aside show thumbnail images (unlike the Programs-detail aside, which does not) — confirm this asymmetry is intentional.
- [ ] 134. Photo credit overlay ("Photo by X on Unsplash") is either removed (real photography) or correctly attributed and linked if stock photos are temporarily retained.
- [ ] 135. All 15 (→ up to 418) course detail pages are reachable via a working dynamic route, not individually hardcoded pages.
- [ ] 136. Course detail hero image uses `aspect-ratio:4/3` with the specified shadow treatment.
- [ ] 137. Mobile layout stacks hero → overview → learn checklist → format grid → assignments/device → who-for → (aside relocated below).
- [ ] 138. No price, fee range, or currency symbol appears anywhere on this template.
- [ ] 139. Duration values ("3 months", "1 month", "2 months") are real per-course data, not a single reused value.
- [ ] 140. Course title in the browser tab (`document.title`) matches "{Course title} — SRS Academy".

### Technical Training (141–147)
- [ ] 141. Hero H1 reads "Software, web and AI skills — taught the way they're used at work" with intro referencing SPRS Infotech's day-to-day work.
- [ ] 142. "Technical programs" shows exactly the 3 programs whose category is **not** "Digital & Business Skills" (Full Stack, AI, Technology Programs) — verify this filter logic, not a hardcoded 3-card list.
- [ ] 143. Each card shows category, title, description, "Duration · Level" meta, "View Course Details" button.
- [ ] 144. "Learn/Build/Advance" 3-cell grid here is text-only (eyebrow + paragraph, no images) — distinct from the Home page's image version of the same content.
- [ ] 145. Page is reachable at `/technical-training` and included in the sitemap per repo-analysis §7.2.
- [ ] 146. Mobile layout stacks hero → program cards → learn/build/advance grid, single column.
- [ ] 147. No fee or price information appears on this page.

### Admissions (148–155)
- [ ] 148. Hero H1 "Start with a conversation", intro mentions "Admissions open based on current course availability."
- [ ] 149. 4-step ordered list (Explore courses / Send an enquiry / Talk to the team / Enrol) renders as a semantic `<ol>`.
- [ ] 150. Steps 3 and 4 show their confirm-flagged copy, or are updated once the real admission process is documented — footnote disclaimer is removed only after that confirmation.
- [ ] 151. Global Enquiry section renders on this page.
- [ ] 152. Global FAQ section renders on this page, after Enquiry.
- [ ] 153. No fee or payment amount appears in any step description.
- [ ] 154. Mobile layout stacks the 4 steps to 1 column at narrow widths.
- [ ] 155. Admissions is reachable at `/admissions` and listed in the sitemap.

### Contact (156–160)
- [ ] 156. Hero H1 "We're here to help you choose", intro mentions fees/courses/eligibility questions.
- [ ] 157. Global Enquiry section renders; global FAQ section does **not** render on Contact (confirm this intentional asymmetry vs. Admissions/Home).
- [ ] 158. Contact details (address, phone, email) match exactly what's shown in the Enquiry section elsewhere — no divergent values on this page.
- [ ] 159. Contact page has no separate standalone contact form distinct from the shared Enquiry component (the design reuses one form globally).
- [ ] 160. Contact is reachable at `/contact` and listed in the sitemap.

### Legal pages (161–169)
- [ ] 161. Tab bar switches between Privacy/Terms/Refund/Accessibility using `role="tablist"`/`role="tab"`/`aria-selected`.
- [ ] 162. "Last updated: {date}" shows a real, current date per policy — not the literal placeholder string `[date from current page]`.
- [ ] 163. **Real legal copy** from the existing live site (per repo-analysis §4 — PR #23 content) is migrated in, replacing every `[Existing policy text]` placeholder — none should ship.
- [ ] 164. Section headings per policy match the existing site's actual structure (verify against the live repo rather than inventing new section names).
- [ ] 165. The dashed "migrate unchanged" implementation note is a build instruction, not production copy — confirm it does not leak into shipped pages.
- [ ] 166. All 4 legal routes (`/privacy`, `/terms`, `/refund-policy`, `/accessibility`) resolve correctly and match repo-analysis §7.2's required indexed URLs.
- [ ] 167. Legal container is narrower (820px) than the rest of the site's 1360px sections — verify this intentional narrower measure for readability.
- [ ] 168. Refund policy reflects the real 3-working-day notice, flagged in repo-analysis §7.9 as still needing Boss confirmation — do not invent a different number.
- [ ] 169. Accessibility page content reflects real commitments/standards, not placeholder claims.

### Resources (170–175)
- [ ] 170. Hero copy "Resources appear here once they're published." matches current reality (update once resources exist).
- [ ] 171. 4 resource cards show correct status pills: 3× "Coming soon", 1× "For students" with a working "Student Login" CTA.
- [ ] 172. Empty-state dashed panel ("No public resources published yet") shows only while genuinely empty, with working "Explore courses" / "Contact us" CTAs.
- [ ] 173. Resources page is reachable at `/resources` and included in the sitemap (per repo-analysis, it already exists with 5 sub-resources — confirm no regression).
- [ ] 174. No resource card implies downloadable content exists if it doesn't yet.
- [ ] 175. Mobile layout stacks the 4 cards to 1 column.

### Updates (176–181)
- [ ] 176. "No updates published yet" card shows only while genuinely empty.
- [ ] 177. The 3 placeholder update cards (bracketed date/category/title/summary) are clearly internal layout references and **do not ship** as visible content — either hidden entirely when there are 0 real updates, or replaced by real posts.
- [ ] 178. "UPDATE CARD LAYOUT · PLACEHOLDER" label text never appears in production.
- [ ] 179. Updates page is reachable at `/updates` and `/updates/[slug]` per repo-analysis (currently 0 published).
- [ ] 180. "Enquire Now" CTA on the empty-state card routes correctly to the Enquiry form.
- [ ] 181. Mobile layout matches the stacked single-column pattern of other list pages.

### Design audit / meta page (182–185)
- [ ] 182. A product decision has been made and documented on whether `/design-audit` ships to production at all (default recommendation: **do not ship**).
- [ ] 183. If it does not ship, the footer "Design audit" link is removed from the production footer.
- [ ] 184. If it does ship (e.g. behind auth, or as internal documentation), it is `noindex` and not linked from public navigation.
- [ ] 185. Competitor-audit content (naming other training academies) is reviewed for any legal/competitive-sensitivity concern before any public exposure.

### Constraint-driven items — theme, dynamic courses, fees, testimonials, Pinterest tag (186–196)
- [ ] 186. A Light/Dark/System theme toggle exists within a **single** layout — there is no separate `/light` route tree (the current repo's `src/app/light/*` must be retired or redirected per repo-analysis §7.2/§8.2).
- [ ] 187. Dark-mode token equivalents are defined for every colour in §1.1 (the design source defines none) — background, text, borders, cards, button states, and focus ring all have reviewed dark values with sufficient contrast.
- [ ] 188. Theme preference persists across navigation and respects OS `prefers-color-scheme` for first-time visitors, consistent with the "System" option.
- [ ] 189. A visible, accessible theme-toggle control exists in the header and/or footer (the design shows no such UI element at all — it must be designed, not just implemented).
- [ ] 190. The course catalogue is backed by the real 418-course dataset (from `itdb_courses.xlsx`) via dynamic rendering — no hardcoded 15-item or 5-item arrays ship to production.
- [ ] 191. All static copy referencing "15 courses" / "five programs" / "All 15 courses" / "catalogue of 15 proposed online courses" is replaced with dynamic, accurate counts.
- [ ] 192. **No fee, price, or currency amount appears anywhere on the site**, including the "Fee: To be announced" stat rows — resolve whether that row is removed entirely or kept with non-committal copy, and apply the decision consistently across all course/program templates.
- [ ] 193. The Testimonials/"Student Stories" section is conditionally **hidden** (component not rendered) site-wide until real, consented testimonials are supplied — it must not render with bracketed placeholder content as the design shows.
- [ ] 194. `<meta name="p:domain_verify" content="793089aaf6d1e8ff5623e5867761095f">` is present in the production `<head>` on every page — confirmed via view-source on the deployed preview, not assumed.
- [ ] 195. The Pinterest tag survives any `<head>`/metadata refactor done as part of this redesign (it's easy to drop accidentally when rewriting `layout.tsx`/`metadata.ts`).
- [ ] 196. A reviewer has explicitly verified items 190–195 against the **live preview deployment**, not just the source code, since several of these are easy to regress silently (e.g. a stray hardcoded "15" left in one FAQ answer, or the meta tag dropped during a layout rewrite).

---

## 5. Placeholder / do-not-ship content

| Content | Where it appears |
|---|---|
| "[Approved student quote — 2–3 sentences about their learning experience]", "[Student name]", "[Program · batch]", circle photo placeholder, badge "Placeholder — replace with real, consented testimonials" | Home page, Student Stories section (desktop + mobile) |
| All 15 online-course cards: titles, durations, descriptions, categories, and Unsplash stock photos with photographer credits (e.g. "Digital Literacy Siksha", "AI with Digital Marketing Basic Siksha", "Certificate in Data Entry & Advanced Excel"...) | Home ("Explore Our Online Courses"), `/courses`, `/courses/[slug]` — flagged in the design's own `toConfirm` list as needing real course offerings and licensed photography |
| "Fee" row = "To be announced" | `/programs/[slug]` hero stat strip, `/courses/[slug]` hero stat strip |
| "Admissions open*" badge + footnote "*Admissions open based on current course availability." | Home, Full Stack featured card |
| "Duration: to be confirmed" + `level`/`duration`/`mode` = "To be confirmed" | Home "other programs" mini-cards; AI, Technology Programs, Business & Entrepreneurship, Digital Skills program data |
| "Details to be confirmed" dashed box + "This page uses the same template as Full Stack Web Development." | `/programs/[slug]` for the 4 unverified programs |
| "[Certificate verification process — to be confirmed]" | `/programs/[slug]` Certification section |
| "The fee hasn't been announced yet. Send an enquiry for current fee and enrolment information." | `/programs/[slug]` sticky aside |
| "Send an enquiry to hear when enrolment opens, plus fees and batch timing." | `/courses/[slug]` sticky aside |
| "[Counselling call — confirm]" and "[Enrolment & payment steps — confirm with SRS]" + footnote "Steps 3–4 are a proposed flow — confirm the actual admission process before launch." | Admissions page, steps 3–4 |
| "[Academy email — confirm; obscured on current site]" | Enquiry section contact `dl` |
| "+91-900007799" with inline "[verify — appears to be 9 digits]" | Enquiry section (unflagged elsewhere in footer — inconsistent, see §7.4) |
| "Last updated: [date from current page]" | All 4 legal pages |
| Dashed box: "Migrate the existing wording from {path} unchanged. This template only restyles it — legal text was not rewritten in this prototype." + every section's "[Existing policy text]" | All 4 legal pages |
| "Coming soon" status pills (3 of 4 cards) | Resources page |
| "No public resources published yet" | Resources page (real state, but confirm it's accurate at ship time) |
| "No updates published yet" + the 3 "UPDATE CARD LAYOUT · PLACEHOLDER" bracketed cards (`[Date] · [Category]`, `[Update title]`, `[Short summary, 1–2 lines]`) | Updates page |
| "Prototype state — nothing was sent. Connect a form service or the site's API before launch." | Enquiry form success state |
| Every `<image-slot>` placeholder description (e.g. "Hero photo: Indian learners working on laptops — approved SRS photography", "Photo: SRS / SPRS Infotech team or studio — approved image") | Home hero/about/testimonials, About page, Technical Training hero, "How You Learn" section — none are final assets |
| Entire "Design audit" page (`/design-audit`): competitor audit, swatches, SEO table, QA status notes | Linked from the public footer — internal documentation, not site content |
| "15 courses" / "five programs" hardcoded in FAQ answers and CTA labels | Home, Courses page, FAQ copy |

---

## 6. Constraints that override the design

1. **Theme toggle (Light/Dark/System), one layout.** The design shows exactly one visual theme (the cream/navy/rust palette throughout) and has no theme-switch UI anywhere. Per constraint, implementation must add Light/Dark/System support within a single route tree — the repo's existing separate `/light` theme (a *different* concept: an alternate static design, not a dark mode) must be retired or redirected, not treated as satisfying this requirement. Dark-mode token equivalents must be defined from scratch (§1.1 has no dark values to reuse) — checklist items 186–189.
2. **Dynamic courses (418 from `itdb_courses.xlsx`), not hardcoded cards.** The design hardcodes exactly 20 courses total (15 "proposed catalogue" + 5 "published programs") across two separate, differently-structured lists on one `/courses` route, with no pagination/search-at-scale pattern suited to hundreds of items. This is the single biggest structural gap between design and requirement — see §7.8/§7.9 for the open questions it raises. Checklist items 59–61, 86–104, 190–191.
3. **Never show fees anywhere.** The design already avoids showing actual numbers (consistently "To be announced" / "To be confirmed"), which is a good baseline, but it still renders a labelled "Fee" row and references to "fees" throughout copy (Enquiry section, FAQ, Admissions). Decide and apply consistently whether the "Fee" row/label is removed outright or kept as a non-committal row — checklist item 192.
4. **Testimonials hidden, not placeholder-shown.** The design explicitly renders a bracketed-placeholder testimonials section with a "replace before ship" badge. The real requirement is stricter: the section must not render at all until real, consented testimonials exist. Checklist items 68, 193.
5. **Pinterest `p:domain_verify` meta tag must remain.** Not present anywhere in this design file (the file has no `<head>` metadata beyond fonts/preconnect) — this is an orthogonal requirement from the existing repo (`repo-analysis.md` §5) that a visual redesign must not regress. Checklist items 194–196.

---

## 7. Gaps, contradictions and open questions

1. **Nav-collapse breakpoint conflict.** The prototype's interactive logic collapses the header at `width < 1180px`, but the prototype's own "Design system" documentation page states "nav collapses `<920px`" (line 771 of the source). These are two different numbers for the same behaviour, written by the same design file. Implementation needs a single source of truth — recommend treating the **functional 1180px** as authoritative since it's the actual interactive logic, and correcting the documentation page (if it ships at all, see item 5 below).
2. **Breakpoint set mismatch with the existing repo.** `repo-analysis.md` records the current repo's design tokens as 480/768/1024/1280/1440px breakpoints. This design file uses no discrete breakpoint set at all — purely fluid `clamp()` and `auto-fit` grids plus the two JS-driven thresholds (1180, 600). Reconcile which breakpoint philosophy the implementation should standardize on.
3. **Address wording inconsistency.** The design's Enquiry/footer sections say "5C, Webel More, **Salt Lake City, Sector V**, Kolkata"; `repo-analysis.md` §7.6/7.7 records the current site's address as "5C, Webel More, **Salt Lake Sector V**, Kolkata" (no "City"). Minor but should be reconciled to one canonical string before launch.
4. **Phone-number warning applied inconsistently.** "+91-900007799" carries an inline "[verify — appears to be 9 digits]" warning in the Enquiry section's contact `dl`, but the identical number appears unflagged in the footer (and in the About-page style/no-warning context). If the number is genuinely unverified, the warning (or the fix) should apply everywhere it's shown, not just once.
5. **Design-audit page's own future is unresolved.** The page documents itself, including an admission that "No lint, type check or build was run, because there is no codebase here" and recommends building these pages as React components "inside the existing Next.js repo." It is simultaneously linked from the public production footer. A decision is needed: internal-only artifact (excluded from the shipped site) vs. retained as a real page (then it needs real content review, `noindex`, and removal from public nav).
6. **Student Portal / Admin Panel are referenced but not specified here.** Header "Student Login", footer "Admin / Staff Login", and the Resources "Student Login" CTA all route to `/student-portal/login` and `/admin/login`, but those areas are declared as `dc-import` references to separate prototype files ("SRS-Student-Portal", "SRS-Admin-Panel") not included among the inputs reviewed. Fidelity against those two areas cannot be verified from this design file — flag to the reviewer that a separate spec/review is needed if those prototypes exist and matter for this engagement.
7. **Two different breadcrumb trail labels for what may become one course concept.** `/programs/[slug]` breadcrumb says "... / **Courses** / {title}"; `/courses/[slug]` breadcrumb says "... / **Online courses** / {title}". If the dynamic 418-course implementation merges these two course concepts (recommended, given the constraint), this labeling inconsistency needs a single resolution.
8. **The `/courses` page's dual-catalogue structure is fundamentally at odds with "418 dynamic courses."** The design presents *two* separate, differently-filterable, differently-styled course lists (a 15-item "proposed catalogue" with category+search, and a 5-item "published programs" list with area+level filters and full curriculum detail) stacked on one route. A real catalogue of 418 courses needs a product decision: are all 418 "published programs" (deep detail, curriculum, eligibility) or all "proposed catalogue" (lighter cards), or a hybrid where some subset gets deep pages? The design offers no template for this scale.
9. **No pagination/infinite-scroll/virtualization pattern exists anywhere in the design** for any grid, despite it needing to support 418 items. This needs to be designed net-new, not just "implemented from the file."
10. **No 404, loading, or skeleton states are shown anywhere.** Program/course detail pages have a `parse()` fallback that silently redirects unknown slugs back to the Courses list rather than showing a true 404 — confirm whether that's the desired behaviour for the real site (repo-analysis confirms a real custom `not-found.tsx` already exists in the live repo; don't regress it).
11. **No disabled-button state is defined** anywhere in the source (e.g., submit button while a request is in-flight, "View details" on a course with no detail page yet). Needs new design.
12. **Accessibility/contrast review needed but not performed here** (no browser rendering tool was available in this task) — flag `#8A5A2E` (eyebrow text) and `#5A6477`/`#9AA3B5` (meta/footer-muted text) against their respective backgrounds for WCAG AA contrast, and specifically check `#C9CEDA` body text on `#16213A` footer background and `#E9A56E` accent-dot on dark backgrounds. These are plausible contrast risks based on the hex values alone and should be measured, not assumed.
13. **Mobile vs. desktop course-dropdown parity.** Both the desktop header dropdown and the mobile menu's "COURSES" list only ever show the 5 "published programs" — never any of the 15/418-item catalogue directly. With a real 418-course dataset, a flat 5-item list in the nav won't communicate the catalogue's breadth; the design provides no mega-menu, category-grouped nav, or search-in-nav pattern to replace it.
14. **Auto-generated vs. authored copy.** Several body paragraphs are literally templated string concatenations in the prototype's JS (e.g., the online-course "Course overview" paragraph appends `desc + duration` into one sentence; FAQ answers hardcode "five programs" and "15 proposed online courses"). None of this should be mistaken for final, authored copy — every dynamic-data-driven sentence needs a real content/microcopy pass once the 418-course dataset is wired in.
