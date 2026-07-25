# Change Request

| Field | Value |
|---|---|
| **CR ID** | CR-2026-001 |
| **Title** | Journal Detail Page — Cross-Source Comparison View |
| **Status** | Proposed |
| **Priority** | Medium |
| **Author** | Development Team |
| **Date** | 2026-07-25 |
| **Page** | Area Explorer (`/area-explorer`) → Journal Detail (`/journal/[id]`) |

---

## 1. Summary

Add a journal detail page accessible by clicking a journal row in the Area Explorer table. The page presents a comparison table showing each database source's (ABDC, AJG, Scimago, Scopus) values for **Area**, **Rank**, and **Active Status**, displaying `N/A` where a value does not exist.

---

## 2. Motivation

The Area Explorer lists journals with a summary "Rank Quality" column, but users cannot drill into individual journals to compare how each database rates or categorises them. A dedicated detail page enables side-by-side comparison across all four sources.

---

## 3. Scope

### 3.1 In Scope

- New journal detail page at `/journal/[id]`
- New API route to fetch a single journal with all related database records
- Replace the placeholder `alert()` in the Area Explorer row click handler with navigation to the detail page

### 3.2 Out of Scope

- Editing or updating journal data
- Adding notes or adjustment history (NOTE_DB)
- URL-based deep linking to specific comparison rows
- Mobile-specific layout variants (responsive table will suffice)

---

## 4. Detailed Specification

### 4.1 Navigation

| Item | Detail |
|---|---|
| **Trigger** | Click on any row in the Area Explorer journal table |
| **Destination** | `/journal/{id}` where `{id}` is the `JOURNAL_MAIN.id` of the clicked journal |
| **Mechanism** | `useRouter().push()` from `next/navigation` |
| **File to modify** | `src/app/area-explorer/page.tsx` (line 268 — replace `alert()`) |

### 4.2 API Route

**Path:** `src/app/api/journal/[id]/route.ts`

**Method:** `GET /api/journal/{id}`

**Query:** Fetch `JOURNAL_MAIN` by `id` with all four satellite relations:

```
JOURNAL_MAIN
├── ABDC_DB                          → select: abdc_area, rating_2025
├── AJG_DB                           → select: ajg_subject_area, ajg_2024_rating
├── SCIMAGO_DB                       → select: scimago_areas, sjr_best_quartile
├── SCOPUS_DB                        → select: active_status
├── journalScopusAreaDetails         → include: scopusArea (scopus_area_name)
├── journalScopusAreaGroupDetails    → include: scopusAreaGroup (scopus_area_group_name)
└── journalScopusMajorGroupDetails   → include: scopusMajorGroup (scopus_major_group_name)
```

**Validation:** Validate `id` param with Zod (`z.coerce.number().int().positive()`).

**Response shape:**

```jsonc
{
  "id": 1,
  "journal_title": "...",
  "publisher": "...",
  "abdc":    { "abdc_area": "...",      "rating_2025": "..." },
  "ajg":     { "ajg_subject_area": "...", "ajg_2024_rating": "..." },
  "scimago": { "scimago_areas": "...",  "sjr_best_quartile": "..." },
  "scopus":  {
    "active_status": "...",
    "areas":       ["1700 Computer Science", "1800 Decision Sciences"],
    "area_groups": ["Physical Sciences", "Social Sciences"],
    "major_groups": ["Engineering & Technology"]
  }
}
```

**Error handling:** Return `404` with `{ "error": "Journal not found" }` when no record matches.

### 4.3 Comparison Table

The page displays a comparison table with the following structure:

| | ABDC | AJG | Scimago | Scopus |
|---|---|---|---|---|
| **Area** | `abdc.abdc_area` | `ajg.ajg_subject_area` | `scimago.scimago_areas` | `scopus.areas[]` (from `SCOPUS_AREA` via `JOURNAL_SCOPUS_AREA_DETAIL`) |
| **Rank** | `abdc.rating_2025` | `ajg.ajg_2024_rating` | `scimago.sjr_best_quartile` | N/A |
| **Active Status** | N/A | N/A | N/A | `scopus.active_status` |

**Rules:**

- If a satellite relation is `null` (journal not present in that database), show `N/A`
- If a specific field within a present relation is `null`, show `N/A`
- Scopus Area is populated from the `SCOPUS_AREA` join table (ASJC codes); show all non-null values, or `N/A` if none exist
- Scopus has no single "Rank" field — this cell is always `N/A`
- ABDC, AJG, and Scimago have no "Active Status" field — these cells are always `N/A`

### 4.4 Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Back to Area Explorer                    │
│                                             │
│  Journal Title                              │
│  Publisher                                  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Comparison Table (see §4.3)        │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

- **Back link:** `router.back()` or link to `/area-explorer`
- **Header:** Journal title (`font-heading text-2xl`) + publisher (`text-muted-foreground`)
- **Table:** Use existing shadcn `Table` components; follow DESIGN.md conventions

---

## 5. Files to Create / Modify

| File | Action | Description |
|---|---|---|
| `src/app/journal/[id]/page.tsx` | **Create** | Journal detail page component |
| `src/app/api/journal/[id]/route.ts` | **Create** | API route for single journal lookup |
| `src/app/area-explorer/page.tsx` | **Modify** | Replace `alert()` with `router.push(\`/journal/${journal.id}\`)` |

---

## 6. Data Source Mapping

| Comparison Row | Database | Prisma Field | Notes |
|---|---|---|---|
| Area (ABDC) | `ABDC_DB` | `abdc_area` | Research area classification |
| Area (AJG) | `AJG_DB` | `ajg_subject_area` | Subject area classification |
| Area (Scimago) | `SCIMAGO_DB` | `scimago_areas` | May contain multiple categories |
| Area (Scopus) | `SCOPUS_AREA` via `JOURNAL_SCOPUS_AREA_DETAIL` | `scopus_area_name` | ASJC codes (e.g. "1700 Computer Science"); many-to-many relation |
| Rank (ABDC) | `ABDC_DB` | `rating_2025` | Values: A*, A, B, C |
| Rank (AJG) | `AJG_DB` | `ajg_2024_rating` | Values: 4*, 4, 3, 2, 1 |
| Rank (Scimago) | `SCIMAGO_DB` | `sjr_best_quartile` | Values: Q1, Q2, Q3, Q4 |
| Rank (Scopus) | — | — | No equivalent field; always `N/A` |
| Active Status (ABDC) | — | — | No equivalent field; always `N/A` |
| Active Status (AJG) | — | — | No equivalent field; always `N/A` |
| Active Status (Scimago) | — | — | No equivalent field; always `N/A` |
| Active Status (Scopus) | `SCOPUS_DB` | `active_status` | Active / Discontinued status |

---

## 7. Acceptance Criteria

- [ ] Clicking a journal row in Area Explorer navigates to `/journal/{id}`
- [ ] The detail page displays journal title and publisher
- [ ] The comparison table renders all 3 rows (Area, Rank, Active Status) x 4 columns (ABDC, AJG, Scimago, Scopus)
- [ ] Cells with no data display `N/A`
- [ ] A back navigation element returns the user to Area Explorer
- [ ] Invalid or non-existent journal ID returns a 404 state
- [ ] API input is validated with Zod
- [ ] Page follows DESIGN.md styling conventions
- [ ] No TypeScript errors (`tsc --noEmit` passes)
