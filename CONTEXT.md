# Area Explorer Page — Context

Captured from conversation (2026-07-24).

## Page goal

Browse journals in a table. Status counters below the table. Instruction text above.

## Table columns

| Column | Data source |
|--------|-------------|
| Journal Title | `ABDC_DB.journal_title` |
| Publisher | `ABDC_DB.publisher` |
| Rank Quality | Combined: `ABDC_DB.rating_2025`, `AJG_DB.ajg_2024_rating`, `SCIMAGO_DB.sjr_best_quartile` — show all non-null values per row (no dedup needed) |
| ISSN | `ABDC_DB.issn_print` |
| ISSN Online | `ABDC_DB.issn_online` |

## Row interaction

Clicking a journal row will eventually redirect to a detail page (route TBD — implement placeholder/mock for now).

## Status counters (placed **below** the table)

- **Journal** – total journal count
- **Publisher** – count of unique publishers
- **Area** – count of unique ABDC areas
- **Database** – 4 (ABDC, AJG, Scimago, Scopus)

## Instruction text

Text: "Click on a journal to view details." Placed above the table.

## Layout & responsive

Follow DESIGN.md:
- Desktop: three-column progressive disclosure (areas list | groups | journals)
- Mobile: stacked accordion panels
- The journal table is always visible and the counters sit below it
