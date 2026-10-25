# Hard rules for every session (SRS Tech Academy redesign, Phase 1 public site)

Read HANDOFF.md (repo root), CLAUDE.md and AGENTS.md first. HANDOFF.md is the contract.

Design references (gitignored, read-only):
- .design-ref/SRS Tech Academy Redesign.dc.html  (Claude Design source, 141 KB — grep/read the relevant section, don't load all at once)
- .design-ref/desktop-01..06.png and .design-ref/mobile-01..11.png (screenshots; view them with Read)
- /workspace/srs-redesign/design-spec-checklist.md — use it if it exists.

Rules:
1. Follow HANDOFF.md conventions: App Router, Server Components by default; "use client" only for menu, theme, catalogue filters, enquiry form.
2. Colours/fonts only via tokens in src/styles/redesign.css (rd-* utilities, font-rd-display, font-rd-sans). No second palette or font.
3. Copy and facts only from src/content/site.ts, src/content/*.ts and course helpers in src/content/courses/index.ts. Never hard-code email, address, hours, socials.
4. One layout with Light / Dark / System toggle (existing ThemeProvider/ThemeToggle, localStorage key srs-theme).
5. NO fees/prices anywhere (no "fee to be announced"). Legal text in legal.ts is the only exception.
6. Never invent testimonials, stats/student counts, accreditation, batch dates, street address, Mumbai campus or phone number. Testimonials block hidden while site.features.showTestimonials is false. Phone/WhatsApp hidden while empty.
7. Keep Pinterest meta p:domain_verify in src/app/layout.tsx. Keep /api/contact and its behaviour unchanged. Canonicals use site.url (www).
8. Old URLs must keep working or 301/308-redirect.
9. No copied itdb.in prose and no itdb source URLs or branding.
10. CEO is credited as "S Roy" ("Chief Executive Officer: S Roy" on About).
11. Do not build Student Portal, Admin Panel or Design audit page.
12. Do not push, do not touch main, do not change Vercel settings. Commit locally on branch claude/redesign-pages only.
13. Before committing, run `pnpm lint` and `pnpm typecheck` and fix errors. Commit with a clear message.
14. Accessibility: focus-visible:outline-3 accent, icon buttons with accessible names, decorative images alt="".

## Design spec checklist
Use .design-ref/design-spec-checklist.md (196 items) — tick off what your session covers.

## CEO / coordinator decisions (25 Oct 2026) — binding
- Mobile menu breakpoint is 1180px (the `nav:` breakpoint).
- Address wording exactly as in src/content/site.ts (Saltlake, Kolkata, West Bengal 700091). Never "Sector V" or "Salt Lake City".
- Drop the prototype's Design-audit page and its footer link.
- Accessibility page only if it has no invented claims; otherwise skip it.
- All 418 courses get a detail page from ONE data-driven template — no generated marketing prose, only fields from the data. The 5 SRS programs are featured separately.
- /courses needs search + category filter that scales to 418 courses.
- No hard-coded counts like "15 courses" or "five programs" — derive counts from data or omit.
- One breadcrumb label: "Courses".
- Add a simple branded 404 page (src/app/not-found.tsx).
- Check WCAG AA contrast in both light and dark themes.
- Phone/WhatsApp: CEO confirmed +91 8008138008. It is already set in site.ts (phone, phoneDigits, telHref(), whatsappHref()). Surface it via those helpers in header/footer/contact/mobile bar. Never use 8240765589 or +91-900007799.
