# TODO

> Project: Journal App — Academic journal ratings explorer
> Generated from AGENTS.md + CONTEXT.md (2026-07-24)

## 1. Project Scaffolding

- [x] Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
- [x] Run `npx shadcn@latest init`
- [x] Install runtime deps: `npm install @prisma/client @tanstack/react-query zod`
- [x] Install dev deps: `npm install -D prisma tsx csv-parse`
- [x] Run `npx prisma init`

## 2. Prisma Schema & Seed

- [x] Define models in `prisma/schema.prisma`: `ABDC_DB`, `AJG_DB`, `SCIMAGO_DB`, `SCOPUS_DB`, `NOTE_DB`, `journal_area`
- [x] Configure relations (1:0..1 from ABDC_DB to AJG/SCIMAGO/SCOPUS/NOTE)
- [x] Create Prisma client singleton in `src/lib/db.ts`
- [x] Create seed script `prisma/seed.ts` reading CSVs from `database/` with upsert by `id`
- [x] Add `"prisma": { "seed": "tsx prisma/seed.ts" }` to `package.json` + `prisma.config.ts`
- [x] Run `npx prisma generate`
- [x] Run `npx prisma db push` (SQLite via libsql adapter)
- [x] Run `npx prisma db seed`

## 3. TanStack Query Setup

- [x] Create provider wrapper in `src/app/providers.tsx`
- [x] Wrap root layout with QueryClientProvider

## 4. API / Server Actions

- [x] Create API routes for:
  - Journals list with filters (area, page, limit)
  - Journal search (full-text by title/ISSN)
  - Status counters (total journals, unique publishers, unique areas, database count)
  - Areas list

## 5. Pages

### 5.1 Overview (`/`)
- [x] Summary stats cards (4 stat cards in responsive grid)
- [x] Top journals table with ratings

### 5.2 Area Explorer (`/area-explorer`)
- [x] Table columns: Journal Title, Publisher, Rank Quality, ISSN, ISSN Online
- [x] Row click → placeholder alert (detail page TBD)
- [x] Instruction text "Click on a journal to view details" above table
- [x] Status counters below table: Journal, Publisher, Area, Database
- [x] Desktop: three-column progressive disclosure (areas list | journals)
- [x] Mobile: stacked accordion panels
- [x] Follow DESIGN.md layout, color, typography

### 5.3 Journal Search (`/journal-search`)
- [x] Full-text search across journal titles and ISSNs
- [x] Filters by source, rating, area (desktop: sheet drawer, mobile: inline)
- [x] Pagination
- [x] Empty/loading states

## 6. Data Validation (Zod)

- [x] Create Zod schemas in `src/lib/validations/` for API input validation

## 7. Custom Hooks

- [x] Create TanStack Query hooks in `src/hooks/` for each API endpoint

## 8. Components

- [x] Set up shadcn/ui components: table, accordion, input, select, card, badge, skeleton, tabs, sheet, button
- [x] Build custom components: `Nav`, `FiltersPanel`

## 9. Polish

- [x] TypeScript strict mode (already enabled via Next.js default)
- [x] Ensure prettier / lint works
- [x] Responsive layout verification (sidebar on desktop, bottom tabs on mobile)
- [x] DESIGN.md color palette applied
