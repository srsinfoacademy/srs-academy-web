Session (c). Read .design-ref/RULES.md first, then HANDOFF.md items 4–6.
Build:
- /courses catalogue: category chips from getCategories(), search, query contract ?q= and ?category= (display category, e.g. Computer). Must scale to all 418 courses (client filter fed a slim list from a Server Component; consider pagination or "show more"). Photo cards only for getHomeFeaturedCourses(); everything else text cards (name, category, code, duration, module count). The 5 SRS programs featured separately. No fees. No hard-coded counts.
- /courses/[slug] with generateStaticParams for every getAllCourses() entry: ONE data-driven template — name, category, code, duration, modules; Full Stack may use curriculum and outcomes; empty modules => "Topic list not published yet". No generated marketing prose, no source URL, no itdb branding, no fees. Breadcrumb label "Courses". Enquire CTA linking to /contact?course=<slug or code>. Related courses via relatedCourses().
- /technical-training using technicalProgramSlugs from featured-programs.ts.
Replace any superseded (main) routes that conflict (e.g. old /programs pages stay until session (e) wires redirects — do not delete them yet unless they conflict).
pnpm lint && pnpm typecheck must pass, then commit "Redesign: courses catalogue, course detail, technical training". Short summary.
