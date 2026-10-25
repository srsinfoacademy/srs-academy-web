Continue session (a). Re-read .design-ref/RULES.md (it now has binding CEO decisions and the design checklist). Commit bd9b58c already contains your RdHeader, RdCoursesMenu, RdLogo, RdMobileMenu and src/content/redesign-nav.ts (the setState-in-effect lint error in RdMobileMenu was fixed by a render-time pathname check — keep that). Finish the rest of item (a):
- Footer (no Design audit link; Admin link only when site.portals.admin.href is set; facts via contactFacts()/hoursSummary()/socials; phone via publicPhone()/telHref()/whatsappHref()).
- Fixed bottom bar "Courses / Enquire Now" below the nav breakpoint, with body padding so content isn't hidden.
- A shared route-group layout for the new public pages (e.g. src/app/(site)/layout.tsx) using this chrome, without breaking the existing (main) pages yet.
- A simple branded 404 page.
Then pnpm lint && pnpm typecheck, git add, git commit "Redesign: footer, mobile bottom bar, site layout, 404". End with a short summary.
