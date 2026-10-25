Session (e). Read .design-ref/RULES.md first, then HANDOFF.md items 9–12.
- Retire /light: delete src/app/light, src/components/light, src/content/light, src/proxy.ts, THEME_PREFERENCE_SCRIPT in src/app/layout.tsx, src/lib/theme-preference.ts and theme-route-map.ts once nothing imports them. Keep the Pinterest meta tag.
- Wire legacyRedirects from src/content/courses/index.ts into redirects() in next.config.ts (permanent: true), then fallbacks /light/:path* -> / and /programs/:slug -> /courses after the specific ones. Verify every destination route exists. Any other old URL from the old site must keep working or redirect.
- Sitemap: every course URL plus static routes (/courses, /technical-training, and the routes that remain), using site.url.
- Update ONLY the Privacy "Cookies and local storage" sentence in legal.ts so it describes the srs-theme localStorage value instead of the old theme cookie / light-theme accent.
- Remove the old Knowledge OS presentation now superseded (src/components/home, knowledge-os, programs, program, and leftover (main) pages). Keep /api/contact, src/lib/contact/*, legal.ts, resources.ts, updates.ts, faq.ts. Remove unused old fonts only if nothing uses them.
- Update HANDOFF.md: move done items to DONE, list remaining placeholders.
pnpm lint && pnpm typecheck && pnpm build must pass, then commit "Redesign: retire /light, legacy redirects, sitemap, remove Knowledge OS". Short summary.
