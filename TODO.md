# TODO

> Project: Journal App — Academic journal ratings explorer
> Generated from AGENTS.md + CONTEXT.md (2026-07-24)

## 1. Project Scaffolding

- [ ] Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
- [ ] Run `npx shadcn@latest init`
- [ ] Install runtime deps: `npm install @prisma/client @tanstack/react-query zod`
- [ ] Install dev deps: `npm install -D prisma`
- [ ] Run `npx prisma init`

## 2. Prisma Schema & Seed

- [ ] Define models in `prisma/schema.prisma`: `ABDC_DB`, `AJG_DB`, `SCIMAGO_DB`, `SCOPUS_DB`, `NOTE_DB`, `journal_area`
- [ ] Configure relations (1:0..1 from ABDC_DB to AJG/SCIMAGO/SCOPUS/NOTE)
- [ ] Create Prisma client singleton in `src/lib/db.ts`
- [ ] Create seed script `prisma/seed.ts` reading CSVs from `database/` with upsert by `id`
- [ ] Add `"prisma": { "seed": "tsx prisma/seed.ts" }` to `package.json`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (or migrate dev)
- [ ] Run `npx prisma db seed`

## 3. TanStack Query Setup

- [ ] Create provider wrapper in `src/app/providers.tsx` (or in layout)
- [ ] Wrap root layout with QueryClientProvider

## 4. API / Server Actions

- [ ] Create API routes (or server actions) for:
  - Journals list with filters (area, group, source, rating)
  - Journal search (full-text by title/ISSN)
  - Status counters (total journals, unique publishers, unique areas, database count)

## 5. Pages

### 5.1 Overview (`/`)
- [ ] Summary stats, top journals, key metrics

### 5.2 Area Explorer (`/area-explorer`)
- [ ] Table columns: Journal Title, Publisher, Rank Quality, ISSN, ISSN Online
- [ ] Row click → placeholder (detail page TBD)
- [ ] Instruction text "Click on a journal to view details" above table
- [ ] Status counters below table: Journal, Publisher, Area, Database
- [ ] Desktop: three-column progressive disclosure (areas | groups | journals)
- [ ] Mobile: stacked accordion panels
- [ ] Follow DESIGN.md layout, color, typography

### 5.3 Journal Search (`/journal-search`)
- [ ] Full-text search across journal titles and ISSNs
- [ ] Filters by source, rating, area

## 6. Data Validation (Zod)

- [ ] Create Zod schemas in `src/lib/validations/` for API input validation

## 7. Custom Hooks

- [ ] Create TanStack Query hooks in `src/hooks/` for each API endpoint

## 8. Components

- [ ] Set up shadcn/ui components as needed (accordion, table, input, etc.)
- [ ] Build custom components in `src/components/`

## 9. Polish

- [ ] TypeScript strict mode (already enabled via Next.js default)
- [ ] Ensure prettier formatting works
- [ ] Responsive layout verification
