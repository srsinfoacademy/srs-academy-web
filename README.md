# SRS Academy — Public Website

Public marketing and information website for **SRS Academy**, served at
[srstechacademy.com](https://srstechacademy.com).

This repository contains the public site only. The Student Portal, Admin
Portal, LMS, authentication and payments are separate projects and are
referenced here as external links.

## Design system

The site implements the approved **SRS Academy — Knowledge OS** visual
system: a deep graphite environment, warm white typography, an electric lime
primary accent, a restrained violet secondary accent, and a node/network
visual language rendered in SVG and CSS.

The design is locked. Changes to colour, type or motion belong in
`src/styles/tokens.css` and `src/styles/typography.css`, never in components.

## Stack

- Next.js (App Router) with React and TypeScript
- Tailwind CSS v4, driven entirely by CSS custom properties
- Motion for React, for component-level transitions
- pnpm, ESLint

## Getting started

```bash
pnpm install
pnpm dev
```

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |

## Structure

```
src/
  app/          Routes, layout, metadata, sitemap and robots
  components/
    layout/     Header, mobile navigation, footer, skip link
    ui/         Button, TextLink, IndexLabel, Breadcrumb, Container, Section
    page/       Page hero architecture
    knowledge-os/  Grid, node, line and network primitives
  content/      Structured local content (site, navigation)
  lib/          Routes, metadata helpers, utilities
  styles/       Tokens, typography, base layer, utilities
  types/        Shared types
```

## Content rules

Business facts are never invented. Anything unresolved appears as an explicit
placeholder in `SQUARE BRACKETS` — for example `[OFFICIAL ADDRESS]` or
`[SPRS INFOTECH RELATIONSHIP WORDING]` — and must be replaced with approved
copy before launch. Accreditation, affiliations, rankings, student counts,
testimonials, awards, partners and placement claims must not be added without
written confirmation.

## Environment

No environment variables are required to build or run the public site.
Portal URLs are optional; see `.env.example`. The admin panel needs the
variables below.

## Admin panel

A basic admin panel lives at `/admin` (sign in at `/admin/login`). It manages
courses, categories, website enquiries and the contact details, and its
changes appear on the public site within seconds. The footer has a small
"Admin / Staff Login" link to `/admin/login`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `ADMIN_EMAIL` | Admin sign-in email (compared case-insensitively). |
| `ADMIN_PASSWORD` | Admin password, **at least 6 characters**. Change it in Vercel and redeploy; there is no in-app password change yet (Settings explains this). |
| `AUTH_SECRET` | Random string of 16+ characters used to sign the session cookie, e.g. `openssl rand -base64 32`. Changing it signs everyone out. |
| `BLOB_READ_WRITE_TOKEN` | Read/write token of the private Vercel Blob store (`srs-academy-admin-data`). Vercel adds it automatically when the store is connected to the project. |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Existing contact-form email settings (unchanged). |

If `ADMIN_EMAIL`, `ADMIN_PASSWORD` or `AUTH_SECRET` is missing (or the
password is shorter than 6 characters) sign-in is refused with a
"not configured" message.

### How data is stored

`src/lib/data/` is the one data module used by both the public site and the
admin. It stores JSON documents in the private Blob store:

| Document | Contents |
| --- | --- |
| `data/courses.json` | All courses (catalogue rows and the SRS programs), including published state, SEO fields and image URL. |
| `data/categories.json` | Categories in website order, with slug and show/hide flag. |
| `data/contact.json` | Phone, WhatsApp, emails, address, office hours, social links, map embed URL, enquiry notification email. |
| `enquiries/<id>.json` | One document per website enquiry, with status and internal notes. |

- **Before the first save** a document doesn't exist, so the site and the
  admin read the bundled seed: `src/content/courses/courses.json` plus
  `src/content/courses/featured-programs.ts`, and the contact facts in
  `src/content/site.ts`. The site therefore works before any save, without
  Blob, and in local development.
- **Local development without a token** saves to a gitignored `.admin-data/`
  folder, so every admin screen works on your machine.
- **Production without a token** shows the bundled data and refuses saves.
- **Caching:** public pages read through `unstable_cache` with the tags
  `courses`, `categories` and `contact` and stay statically generated. Every
  admin save expires the tag and revalidates the layout and sitemap, so the
  header course menu, course pages, footer and contact block update on the
  next request. Unpublished courses and hidden categories (with their
  courses) disappear from the site and the sitemap.
- **Enquiries:** `/api/contact` keeps its spam checks and Resend email, and
  also saves each enquiry to Blob. Notification email goes to the address set
  on the admin Contact Page screen.

### Security

- Signed (HS256, `jose`) httpOnly session cookie, `SameSite=Lax`, `Secure`
  in production, 12-hour lifetime.
- `src/proxy.ts` protects `/admin/*` and `/api/admin/*` (except the login
  page and login API); every page and API route checks the session again.
- Timing-safe credential comparison; 5 login attempts per 15 minutes per IP.
- Every admin mutation runs on the server, validates its body with `zod`,
  and rejects requests whose `Origin` isn't this site (CSRF).
- `/admin` is `noindex` (meta and `X-Robots-Tag`), disallowed in
  `robots.txt` and never in the sitemap.
