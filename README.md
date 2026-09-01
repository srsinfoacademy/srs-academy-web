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

No environment variables are required to build or run the site. Portal URLs
are optional; see `.env.example`.
