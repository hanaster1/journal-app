# CHANGE REQUEST 002 — Journal Search Page Redesign

> **Status:** Draft  
> **Author:** UX & Engineering Design  
> **Date:** 2026-07-25  
> **Scope:** `/journal-search` page, search API, filter infrastructure

---

## 1. Problem Statement

The current journal search page has several UX limitations:

- **Search requires 2+ characters** before any query fires — users get no feedback while typing short queries or ISSNs
- **Only 3 filter dimensions** (Source, Rating, Area) — users cannot filter by publisher, major group, area group, active status, Scopus area, year, etc.
- **Filters live in a Sheet (drawer) on desktop** — DESIGN.md specifies a collapsible filter sidebar on desktop, not a drawer
- **No sort options** — results are always alphabetical by title
- **No view toggle** — card view only, no table view option
- **No URL state** — searches are not shareable or bookmarkable
- **Rating display is inconsistent** — plain `<span>` badges instead of the tiered badge system defined in DESIGN.md
- **No filter counts** — users don't know how many results each filter option would yield
- **No search within results** — secondary refinement is not possible
- **Empty initial state** requires user to type before seeing anything — should show recent/browsable content

---

## 2. Goals

| # | Goal |
|---|------|
| G1 | Enable users to find any journal within 3 interactions (search, filter, browse) |
| G2 | Support filtering across all meaningful dimensions from the database schema |
| G3 | Provide shareable, bookmarkable search URLs |
| G4 | Follow DESIGN.md layout: desktop sidebar filters, mobile drawer filters |
| G5 | Use the tiered rating badge system from DESIGN.md |
| G6 | Performant — debounced search, paginated results, cached filter options |

---

## 3. UX Design

### 3.1 Page Layout

#### Desktop (> 1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│  Journal Search                                                  │
│  Find journals by title, ISSN, publisher, or subject area        │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐  ┌───────────┐ │
│  │ 🔍 Search journals...              [Search] │  │ Filters   │ │
│  └─────────────────────────────────────────────┘  │           │ │
│                                                    │ ▸ Source  │ │
│  Sort: [Relevance ▾]   View: [Cards ≡] [Table ≡] │ ▸ Rating  │ │
│                                                    │ ▸ Area    │ │
│  ┌─ Active Filters ─────────────────────────────┐  │ ▸ Publisher│
│  │ [ABDC ×] [Q1 ×] [Finance ×]   Clear all     │  │ ▸ Major   │ │
│  └──────────────────────────────────────────────┘  │   Group   │ │
│                                                    │ ▸ Area    │ │
│  247 results                          Page 1 of 13│ │   Group   │ │
│                                                    │ ▸ Status  │ │
│  ┌──────────────────────────────────────────────┐  │ ▸ Year    │ │
│  │ Journal of Finance                           │  │           │ │
│  │ Wiley · Finance · ISSN: 0022-1082            │  │ [Apply]   │ │
│  │ [ABDC A*] [AJG 4*] [SJR Q1]                │  │ [Reset]   │ │
│  └──────────────────────────────────────────────┘  └───────────┘ │
│  ┌──────────────────────────────────────────────┐                │
│  │ ...                                          │                │
│  └──────────────────────────────────────────────┘                │
│                                                    Pagination    │
└──────────────────────────────────────────────────────────────────┘
```

#### Mobile (< 768px)

```
┌──────────────────────┐
│  Journal Search      │
│  ┌────────────────┐  │
│  │ 🔍 Search...   │  │
│  └────────────────┘  │
│  [≡ Filters (3)]     │
│  [Sort: Relevance ▾] │
│                      │
│  [ABDC ×] [Q1 ×]    │
│                      │
│  ┌─ Journal Card ──┐ │
│  │ Journal of...   │ │
│  │ [A*] [4*] [Q1] │ │
│  └────────────────┘ │
│  ┌─ Journal Card ──┐ │
│  │ ...             │ │
│  └────────────────┘ │
│                      │
│  « 1 2 3 ... 13 »   │
└──────────────────────┘
```

### 3.2 Search Behavior

| Behavior | Detail |
|----------|--------|
| **Debounced input** | 300ms debounce — no "Search" button needed for text; results update as user types |
| **Minimum 1 character** | Lowered from 2 to 1 to support partial ISSN lookups |
| **Search scope** | Journal title, ISSN (print + online), publisher, AJG title, Scimago title, Scopus title |
| **Search within results** | After initial search, typing further refines within current filter set |
| **Empty state** | Show "Start typing to search..." with a few example popular journals below |
| **URL sync** | Query param `?q=` reflects current search — shareable links |

### 3.3 Filter System

#### Filter Dimensions

| Filter | Source Table | Type | Multi-select? |
|--------|-------------|------|---------------|
| **Database Source** | `journal_area.source` | Checkbox group | Yes (ABDC, AJG, Scimago, Scopus) |
| **ABDC Rating** | `ABDC_DB.rating_2025` | Checkbox group | Yes (A*, A, B, C) |
| **AJG Rating** | `AJG_DB.ajg_2024_rating` | Checkbox group | Yes (4*, 4, 3, 2, 1) |
| **SJR Quartile** | `SCIMAGO_DB.sjr_best_quartile` | Checkbox group | Yes (Q1, Q2, Q3, Q4) |
| **ABDC Area** | `ABDC_DB.abdc_area` | Searchable dropdown | No (single select) |
| **AJG Subject Area** | `AJG_DB.ajg_subject_area` | Searchable dropdown | No |
| **Scimago Areas** | `SCIMAGO_DB.scimago_areas` | Searchable dropdown | No |
| **Scopus Area** | `SCOPUS_AREA` (normalized) | Searchable dropdown | No |
| **Scopus Area Group** | `SCOPUS_AREA_GROUP` (normalized) | Searchable dropdown | No |
| **Major Group** | `MAJOR_GROUP` (normalized) | Searchable dropdown | No |
| **Area Group** | `AREA_GROUP` (normalized) | Searchable dropdown | No |
| **Publisher** | `JOURNAL_MAIN.publisher` | Searchable dropdown | No |
| **Active Status** | `SCOPUS_DB.active_status` | Checkbox group | Yes (Active, Inactive, Discontinued) |
| **Source Type** | `SCOPUS_DB.source_type` | Checkbox group | Yes (Journal, Book, Conference, etc.) |
| **Year Inception** | `ABDC_DB.year_inception` | Range slider | No (min–max year) |

#### Filter UX Patterns

- **Collapsible accordion sections** in sidebar — each filter group can expand/collapse
- **Multi-select checkboxes** for categorical filters (ratings, sources, status)
- **Searchable combobox** for long lists (areas, publishers) — use existing `combobox.tsx` component
- **Active filter count badge** on each collapsed section (e.g., "Rating (3)")
- **"Apply" button** at bottom of filter panel — per DESIGN.md, no live filtering
- **"Reset" button** clears all filters
- **Active filter chips** shown above results with individual remove (×) buttons
- **"Clear all" link** next to filter chips

#### Filter Sidebar Behavior

| Device | Behavior |
|--------|----------|
| Desktop | Persistent collapsible sidebar on left (280px wide), toggleable via filter icon |
| Tablet | Same as desktop but narrower (240px) |
| Mobile | Full-screen drawer triggered by "Filters" button with count badge |

### 3.4 Sort Options

| Option | Description |
|--------|-------------|
| **Relevance** | Default when searching — ranks by title match quality |
| **Title (A–Z)** | Alphabetical ascending |
| **Title (Z–A)** | Alphabetical descending |
| **ABDC Rating** | Highest rating first (A* > A > B > C) |
| **AJG Rating** | Highest rating first (4* > 4 > 3 > 2 > 1) |
| **SJR Quartile** | Best quartile first (Q1 > Q2 > Q3 > Q4) |
| **Publisher** | Alphabetical by publisher name |
| **Year Inception** | Newest first |

### 3.5 Results Display

#### Card View (default on mobile)

Each card shows:
- **Journal title** (bold, primary text)
- **Publisher** + **ABDC Area** (muted text, secondary)
- **Rating badges** using DESIGN.md tiered badge colors:
  - ABDC rating badge (A*, A, B, C)
  - AJG rating badge (4*, 4, 3, 2, 1)
  - SJR quartile badge (Q1, Q2, Q3, Q4)
- **ISSN** (print + online, compact display)
- **Active status indicator** (green dot = active, gray = inactive)
- Click → navigate to journal detail page (future)

#### Table View (default on desktop)

| Column | Content |
|--------|---------|
| Journal Title | Title + publisher below in muted text |
| Publisher | Publisher name |
| Area | ABDC area |
| ABDC | Rating badge |
| AJG | Rating badge |
| SJR | Quartile badge |
| ISSN | Print ISSN |
| eISSN | Online ISSN |
| Status | Active/Inactive indicator |

#### Pagination

- **Page size selector**: 20 / 50 / 100 results per page
- **Page navigation**: Previous / Next + page number buttons (1, 2, 3, ... N)
- **Result summary**: "Showing 1–20 of 247 results"

### 3.6 Empty & Loading States

| State | Display |
|-------|---------|
| **Initial (no search)** | Centered icon + "Search academic journals" + 5 example popular journals as quick-start links |
| **Loading** | Skeleton placeholders matching card/table layout (per DESIGN.md) |
| **No results** | Centered icon + "No journals found" + suggestions: "Try broadening your filters" + "Clear all filters" button |
| **Error** | Centered icon + "Something went wrong" + "Try again" button |

---

## 4. Technical Design

### 4.1 URL State Management

Use `useSearchParams` / `useRouter` from Next.js to sync all state to URL:

```
/journal-search?q=fina&source=ABDC&abdc_rating=A*,A&area=Finance&sort=abdc_rating&page=2&limit=50
```

Benefits:
- Shareable links
- Browser back/forward works correctly
- State persists on refresh

### 4.2 API Changes

#### `GET /api/journals/search` — Enhanced

New query parameters:

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (min 1 char) |
| `source` | string (comma-sep) | Database sources filter |
| `abdc_rating` | string (comma-sep) | ABDC ratings filter |
| `ajg_rating` | string (comma-sep) | AJG ratings filter |
| `sjr_quartile` | string (comma-sep) | SJR quartiles filter |
| `area` | string | ABDC area filter |
| `ajg_subject_area` | string | AJG subject area filter |
| `scimago_areas` | string | Scimago areas filter |
| `scopus_area_id` | int | Scopus area (normalized) |
| `scopus_area_group_id` | int | Scopus area group |
| `major_group_id` | int | Major group (normalized) |
| `area_group_id` | int | Area group (normalized) |
| `publisher` | string | Publisher name filter |
| `active_status` | string (comma-sep) | Active status filter |
| `source_type` | string (comma-sep) | Source type filter |
| `year_from` | int | Year inception range start |
| `year_to` | int | Year inception range end |
| `sort` | string | Sort field |
| `order` | string | `asc` or `desc` |
| `page` | int | Page number |
| `limit` | int | Results per page |

#### `GET /api/filters/options` — New endpoint

Returns all available filter options with counts:

```json
{
  "sources": [{ "value": "ABDC", "count": 2700 }],
  "abdc_ratings": [{ "value": "A*", "count": 120 }],
  "ajg_ratings": [{ "value": "4*", "count": 55 }],
  "sjr_quartiles": [{ "value": "Q1", "count": 800 }],
  "areas": [{ "value": "Finance", "count": 340 }],
  "majorGroups": [{ "value": "Business & Management", "count": 1200 }],
  "areaGroups": [{ "value": "Accounting", "count": 450 }],
  "publishers": [{ "value": "Elsevier", "count": 900 }],
  "activeStatuses": [{ "value": "Active", "count": 2500 }],
  "sourceTypes": [{ "value": "Journal", "count": 2200 }],
  "yearRange": { "min": 1880, "max": 2025 }
}
```

### 4.3 Component Architecture

```
src/app/journal-search/
├── page.tsx                      # Page shell, layout
├── components/
│   ├── search-bar.tsx            # Debounced search input
│   ├── filter-sidebar.tsx        # Desktop collapsible sidebar
│   ├── filter-drawer.tsx         # Mobile drawer wrapper
│   ├── filter-section.tsx        # Accordion filter group
│   ├── filter-checkbox-group.tsx # Multi-select checkboxes
│   ├── filter-searchable.tsx     # Combobox for long lists
│   ├── filter-year-range.tsx     # Year range slider
│   ├── active-filters.tsx        # Filter chips bar
│   ├── sort-controls.tsx         # Sort dropdown
│   ├── view-toggle.tsx           # Card/Table toggle
│   ├── results-table.tsx         # Table view
│   ├── results-cards.tsx         # Card view
│   ├── rating-badge.tsx          # Tiered badge per DESIGN.md
│   ├── pagination-controls.tsx   # Page nav + size selector
│   └── empty-state.tsx           # Initial / no-results state
├── hooks/
│   ├── use-search-params.ts      # URL state ↔ component state
│   ├── use-journal-search.ts     # Enhanced search query
│   └── use-filter-options.ts     # Filter options query
└── lib/
    └── search-utils.ts           # Sort comparators, param parsing
```

### 4.4 State Management

```typescript
interface SearchState {
  query: string;
  filters: {
    sources: string[];
    abdcRatings: string[];
    ajgRatings: string[];
    sjrQuartiles: string[];
    area: string | null;
    ajgSubjectArea: string | null;
    scimagoAreas: string | null;
    scopusAreaId: number | null;
    scopusAreaGroupId: number | null;
    majorGroupId: number | null;
    areaGroupId: number | null;
    publisher: string | null;
    activeStatuses: string[];
    sourceTypes: string[];
    yearFrom: number | null;
    yearTo: number | null;
  };
  sort: string;
  order: "asc" | "desc";
  page: number;
  limit: number;
  view: "cards" | "table";
}
```

All state synced to URL via `useSearchParams` + `router.push` with `shallow: true`.

### 4.5 Performance Considerations

| Concern | Solution |
|---------|----------|
| Debounced search | 300ms debounce on input, cancel previous requests |
| Filter options caching | TanStack Query with `staleTime: 5 * 60 * 1000` (5 min) |
| Large publisher list | Server-side searchable combobox (not loaded all at once) |
| Pagination | Server-side cursor/offset pagination (already implemented) |
| Prisma query optimization | Use `include` selectively, avoid N+1 with batch includes |
| URL state sync | Debounce URL updates to avoid excessive router pushes |

---

## 5. Rating Badge Mapping

Per DESIGN.md tiered badge system:

| Tier | ABDC | AJG | SJR | bg | text | border |
|------|------|-----|-----|----|------|--------|
| 1 | 4* | — | — | `bg-primary/10` | `text-primary` | `border-primary/20` |
| 2 | A* | 4* | Q1 | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` |
| 3 | A | 4, A | Q2 | `bg-slate-50` | `text-slate-600` | `border-slate-200` |
| 4 | B | 3, B | Q3 | `bg-stone-50` | `text-stone-500` | `border-stone-200` |
| 5 | C | 2, 1, C | Q4 | `bg-zinc-50` | `text-zinc-400` | `border-zinc-200` |

The `RatingBadge` component takes a `system` prop (`"abdc" | "ajg" | "sjr"`) and a `value` prop, then applies the correct tier styling.

---

## 6. Migration Plan

| Phase | Work | Effort |
|-------|------|--------|
| **Phase 1** | URL state management + enhanced search API | M |
| **Phase 2** | Filter sidebar (desktop) + drawer (mobile) with all dimensions | L |
| **Phase 3** | Sort controls + view toggle (card/table) | S |
| **Phase 4** | Rating badge component using DESIGN.md tiers | S |
| **Phase 5** | Pagination controls with page size selector | S |
| **Phase 6** | Empty/loading/error states | S |
| **Phase 7** | Filter options API with counts | M |
| **Phase 8** | Searchable combobox filters for long lists (publishers, areas) | M |

**Total estimated effort:** ~3–4 days of focused work

---

## 7. Open Questions

| # | Question | Decision |
|---|----------|----------|
| Q1 | Should we support full-text search across all text fields (including notes)? | TBD |
| Q2 | Do we need saved/bookmarked searches? (Could be Phase 2) | TBD |
| Q3 | Should filter counts update dynamically as other filters are applied? (Faceted search) | TBD — nice-to-have but adds API complexity |
| Q4 | Export results to CSV — in scope? | TBD |
| Q5 | Journal detail page navigation on row click — implement now or wait for detail page? | TBD |

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Time to find a journal | < 10 seconds for known title |
| Filter usage rate | > 40% of searches use at least one filter |
| Zero-result rate | < 5% of searches |
| Page load (TTI) | < 2 seconds |
| Mobile usability | All features accessible on 375px width |
