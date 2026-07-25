# AGENTS.md

> **Mandatory reading for all LLM agents:** Always read this file first when working on this project. Before making any UX/UI changes or adding a new page, read `DESIGN.md` — it defines the design system, color palette, typography, layout, and responsive behavior that must be followed.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Database ORM | Prisma |
| Database | PostgreSQL (Vercel Postgres or Neon) |
| Styling | Tailwind CSS + shadcn/ui |
| Data fetching | TanStack Query |
| Validation | Zod |
| Auth | None |
| Deployment | Vercel (single repo) |

## Project structure

Root is a single Next.js app (no monorepo). Expected layout:

```
.
├── prisma/
│   ├── schema.prisma          # Prisma schema (mirror DB below)
│   ├── seed.ts                # Seed from CSVs
│   └── migrations/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Overview (homepage)
│   │   ├── area-explorer/
│   │   ├── journal-search/
│   │   │   ├── page.tsx
│   │   │   ├── components/    # Page-specific components
│   │   │   ├── hooks/         # Page-specific hooks
│   │   │   └── lib/           # Page-specific utilities
│   │   ├── journal/[id]/      # Journal detail page
│   │   └── layout.tsx
│   ├── components/            # shadcn/ui components + shared custom
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   └── validations/       # Zod schemas
│   ├── hooks/                 # Shared TanStack Query hooks
│   └── types/
├── database/                  # Source CSVs (read-only reference)
├── change-request/            # Change request documents and plans
├── er-diagram.md
├── DESIGN.md                  # Design system, colors, typography, layout
└── AGENTS.md
```

### Page-level organization

Complex pages (like `journal-search`) use a co-located structure:
- `components/` — Components used only by this page
- `hooks/` — Hooks used only by this page (e.g., `use-search-state.ts`, `use-journal-search.ts`)
- `lib/` — Utilities and constants for this page (e.g., `search-utils.ts`)

Shared components and hooks go in `src/components/` and `src/hooks/`.

## Database schema (Prisma models)

Hub table `JOURNAL_MAIN` with satellite tables and normalized many-to-many relations:

### `JOURNAL_MAIN` (hub table)
- `id` Int PK
- `journal_title` String
- `publisher` String?

### `ABDC_DB`
- `id` Int PK (FK → JOURNAL_MAIN.id)
- `issn_print` String?
- `issn_online` String?
- `year_inception` Int?
- `for_code` Int?
- `abdc_area` String?
- `rating_2025` String?
- `notes` String?

### `AJG_DB`
- `id` Int PK (FK → JOURNAL_MAIN.id)
- `ajg_match_key` String?
- `ajg_issn` String?
- `ajg_title` String?
- `ajg_subject_area` String?
- `ajg_2024_rating` String?

### `SCIMAGO_DB`
- `id` Int PK (FK → JOURNAL_MAIN.id)
- `scimago_issn` String?
- `scimago_eissn` String?
- `scimago_title` String?
- `sjr_best_quartile` String?
- `scimago_categories` String?
- `scimago_match_key` String?
- `scimago_areas` String?

### `SCOPUS_DB`
- `id` Int PK (FK → JOURNAL_MAIN.id)
- `scopus_match_key` String?
- `scopus_issn` String?
- `scopus_eissn` String?
- `scopus_title` String?
- `active_status` String?
- `coverage_years` String?
- `discontinued` String?
- `source_type` String?

### `NOTE_DB`
- `id` Int PK (FK → JOURNAL_MAIN.id)
- `note_primary` String?
- `note_secondary_1` String?
- `note_secondary_2` String?
- `note_secondary_3` String?
- `adjustment_reason` String?

### `journal_area` (standalone denormalized table)
- `id` Int PK (auto-increment)
- `journal_title` String
- `issn_print` String?
- `issn_online` String?
- `source` String (ABDC/AJG/Scimago/Scopus)
- `area` String?
- `rank` String?
- `active_status` String?
- `source_type` String?
- `best_rank` String?
- `area_group` String?
- `major_group` String

### `AREA` (normalized area lookup)
- `area_id` Int PK (auto-increment)
- `area_name` String @unique

### `JOURNAL_AREA_DETAIL` (journal ↔ area many-to-many)
- `journal_id` Int (FK → JOURNAL_MAIN.id)
- `area_id` Int (FK → AREA.area_id)
- Composite PK (`journal_id`, `area_id`)

### `AREA_GROUP` (normalized area group lookup)
- `area_group_id` Int PK (auto-increment)
- `area_group_name` String @unique

### `JOURNAL_AREA_GROUP_DETAIL` (journal ↔ area_group many-to-many)
- `journal_id` Int (FK → JOURNAL_MAIN.id)
- `area_group_id` Int (FK → AREA_GROUP.area_group_id)
- Composite PK (`journal_id`, `area_group_id`)

### `MAJOR_GROUP` (normalized major group lookup)
- `major_group_id` Int PK (auto-increment)
- `major_group_name` String @unique

### `JOURNAL_MAJOR_GROUP_DETAIL` (journal ↔ major_group many-to-many)
- `journal_id` Int (FK → JOURNAL_MAIN.id)
- `major_group_id` Int (FK → MAJOR_GROUP.major_group_id)
- Composite PK (`journal_id`, `major_group_id`)

### `SCOPUS_AREA` (Scopus ASJC area lookup)
- `scopus_area_id` Int PK (auto-increment)
- `scopus_area_name` String @unique

### `JOURNAL_SCOPUS_AREA_DETAIL` (journal ↔ scopus_area many-to-many)
- `journal_id` Int (FK → JOURNAL_MAIN.id)
- `scopus_area_id` Int (FK → SCOPUS_AREA.scopus_area_id)
- Composite PK (`journal_id`, `scopus_area_id`)

### `SCOPUS_AREA_GROUP` (Scopus top-level area group lookup)
- `scopus_area_group_id` Int PK (auto-increment)
- `scopus_area_group_name` String @unique

### `JOURNAL_SCOPUS_AREA_GROUP_DETAIL` (journal ↔ scopus_area_group many-to-many)
- `journal_id` Int (FK → JOURNAL_MAIN.id)
- `scopus_area_group_id` Int (FK → SCOPUS_AREA_GROUP.scopus_area_group_id)
- Composite PK (`journal_id`, `scopus_area_group_id`)

### `SCOPUS_MAJOR_GROUP` (Scopus major group lookup)
- `scopus_major_group_id` Int PK (auto-increment)
- `scopus_major_group_name` String @unique

### `JOURNAL_SCOPUS_MAJOR_GROUP_DETAIL` (journal ↔ scopus_major_group many-to-many)
- `journal_id` Int (FK → JOURNAL_MAIN.id)
- `scopus_major_group_id` Int (FK → SCOPUS_MAJOR_GROUP.scopus_major_group_id)
- Composite PK (`journal_id`, `scopus_major_group_id`)

JOURNAL_MAIN is the hub; ABDC/AJG/SCIMAGO/SCOPUS/NOTE each have a 1:0..1 relation keyed on `id`. AREA, AREA_GROUP, and MAJOR_GROUP are linked to journals through their respective detail (join) tables. SCOPUS_AREA, SCOPUS_AREA_GROUP, and SCOPUS_MAJOR_GROUP are Scopus-specific normalized tables linked through their own join tables.

## Seed data

Source CSVs in `database/`:
- `ABDC_DB.csv` — 2700+ rows (ABDC journal ratings)
- `AJG_DB.csv` — matched by id
- `SCIMAGO_DB.csv` — matched by id
- `SCOPUS_DB.csv` — matched by id
- `NOTE_DB.csv` — adjustment notes
- `journal_area.csv` — denormalized cross-source view (~12K rows)

Prisma seed script should read CSVs and upsert by `id`. Some AJG/Scimago/Scopus rows are empty (no match).

## Pages

Four pages in App Router:

| Route | Purpose |
|-------|---------|
| `/` | Overview — summary stats, top journals, key metrics |
| `/area-explorer` | Browse journals by ABDC area / major group / area group |
| `/journal-search` | Full-text search with advanced filtering, sorting, and pagination |
| `/journal/[id]` | Journal detail page — displays full information for a single journal |

### Journal Search specifics

- **Search**: Debounced input (300ms) searches across journal title, ISSN, publisher, and all title variants
- **Filters**: 15 filter dimensions accessible via Sheet drawer (all screen sizes):
  - Database Source, ABDC Rating, AJG Rating, SJR Quartile (checkbox groups)
  - ABDC Area, AJG Subject Area, Major Group, Area Group, Scopus Area, Scopus Area Group, Publisher (searchable comboboxes)
  - Active Status, Source Type (checkbox groups)
  - Year Inception (range inputs)
- **Sort**: Title (A-Z, Z-A), Publisher, Year — via Combobox component
- **View toggle**: Table view (default on desktop) or Card view (default on mobile)
- **Pagination**: Page size selector (20/50/100), page navigation with ellipsis
- **URL state**: All search/filter/sort state synced to URL params for shareable links
- **Row/card click**: Navigates to `/journal/{id}`
- **Rating badges**: Tiered badge system per DESIGN.md (5 tiers based on rating value)

### Journal Detail specifics

- **Route**: `/journal/[id]` where `id` is `JOURNAL_MAIN.id`
- **Navigation**: Accessed by clicking a journal row/card in search results or area explorer
- **Content**: Displays full journal information including all ratings, ISSNs, areas, and metadata

### Area Explorer specifics

- **Table columns**: Journal Title, Publisher, Rank Quality (combined `ABDC_DB.rating_2025`, `AJG_DB.ajg_2024_rating`, `SCIMAGO_DB.sjr_best_quartile` — show all non-null values per cell, no dedup), ISSN (`issn_print`), ISSN Online (`issn_online`)
- **Row click**: placeholder — eventually navigates to journal detail page (route TBD)
- **Instruction text**: "Click on a journal to view details" — placed above the table
- **Status counters** (placed **below** the table): Journal (total count), Publisher (unique count), Area (unique ABDC areas), Database (4 — ABDC, AJG, Scimago, Scopus)
- **Layout**: follows DESIGN.md — desktop uses three-column progressive disclosure; mobile uses stacked accordion panels; the table is always visible

All use TanStack Query for client-side data fetching from Next.js API routes or server actions.

## Setup commands (expected)

```sh
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
npx shadcn@latest init
npm install @prisma/client @tanstack/react-query zod
npm install -D prisma
npx prisma init
```

## Conventions

- Validate all API inputs with Zod before Prisma queries.
- Prisma client singleton in `src/lib/db.ts`.
- shadcn/ui components in `src/components/ui/`.
- Custom components in `src/components/`.
- TanStack Query hooks in `src/hooks/`.
- Run `npx prisma generate` after schema changes.
- Run `npx prisma db push` or `npx prisma migrate dev` for schema sync.
- Seed: `npx prisma db seed` (configure seed script in `package.json`).
- Formatting: `prettier` (via Next.js default).
- TypeScript strict mode.
