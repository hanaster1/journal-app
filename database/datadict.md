# Journal Database — Data Dictionary

## JOURNAL_MAIN (Hub Table)

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY` | Unique journal identifier (shared as FK by all satellite tables) |
| 2 | Journal Title | `journal_title` | `VARCHAR(500)` | Full title of the journal |
| 3 | Publisher | `publisher` | `VARCHAR(300)` | Publisher / organization that publishes the journal |

## ABDC Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | ISSN | `issn_print` | `VARCHAR(20)` | Print ISSN (International Standard Serial Number) |
| 3 | ISSNOnline | `issn_online` | `VARCHAR(20)` | Online ISSN (may be empty for print-only journals) |
| 4 | Year Inception | `year_inception` | `INTEGER` | Year the journal was first published |
| 5 | FoR | `for_code` | `INTEGER` | Australian Field of Research (FoR) code (e.g. 3501) |
| 6 | ABDC Area | `abdc_area` | `VARCHAR(200)` | ABDC subject area classification |
| 7 | 2025 rating | `rating_2025` | `VARCHAR(5)` | ABDC journal quality rating: A*, A, B, or C |
| 8 | หมายเหตุ | `notes` | `TEXT` | Additional notes / remarks (e.g. ISSN mismatches) |

## AJG Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | ASG_Match_Key | `ajg_match_key` | `VARCHAR(20)` | AJG matching key (usually ISSN) — original column had `ASG` typo |
| 3 | ASG_ISSN | `ajg_issn` | `VARCHAR(20)` | ISSN used for AJG matching — original column had `ASG` typo |
| 4 | ASG_Title | `ajg_title` | `VARCHAR(500)` | Journal title from AJG — original column had `ASG` typo |
| 5 | Subject area AJG2024 lowest] | `ajg_subject_area` | `VARCHAR(200)` | AJG 2024 subject area classification |
| 6 | AJG 2024 | `ajg_2024_rating` | `VARCHAR(5)` | AJG 2024 quality rating (1, 2, 3, 4, 4*) |

## Scimago Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | Scimago_Match_Key | `scimago_match_key` | `VARCHAR(20)` | Scimago matching key (usually ISSN) |
| 3 | Scimago_ISSN | `scimago_issn` | `VARCHAR(20)` | Print ISSN from Scimago |
| 4 | Scimago_EISSN | `scimago_eissn` | `VARCHAR(20)` | Online ISSN from Scimago |
| 5 | Scimago_Title | `scimago_title` | `VARCHAR(500)` | Journal title from Scimago |
| 6 | SJR_Best_Quartile | `sjr_best_quartile` | `VARCHAR(5)` | Best SJR quartile (Q1, Q2, Q3, Q4) |
| 7 | Scimago_Categories | `scimago_categories` | `VARCHAR(500)` | Scimago subject categories |
| 8 | Scimago_Areas | `scimago_areas` | `VARCHAR(500)` | Scimago subject areas |

## Scopus Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | Scopus_Match_Key | `scopus_match_key` | `VARCHAR(20)` | Scopus matching key (usually ISSN; occasional data-quality issues where title appears here) |
| 3 | Scopus_ISSN | `scopus_issn` | `VARCHAR(20)` | Print ISSN from Scopus |
| 4 | Scopus_EISSN | `scopus_eissn` | `VARCHAR(20)` | Online ISSN from Scopus |
| 5 | Scopus_Title | `scopus_title` | `VARCHAR(500)` | Journal title from Scopus |
| 6 | Active or Inactive | `active_status` | `VARCHAR(10)` | `Active` or `Inactive` — whether Scopus currently indexes the journal |
| 7 | Coverage | `coverage_years` | `VARCHAR(100)` | Year ranges of Scopus coverage (e.g. `2003-2026`) |
| 8 | Titles Discontinued by Scopus | `discontinued` | `VARCHAR(50)` | Non-null if the journal was discontinued by Scopus |
| 9 | Source Type | `source_type` | `VARCHAR(30)` | Publication type: `Journal`, `Book Series`, `Trade Journal`, etc. |

*Note: Scopus area data (ASJC codes and top-level categories) have been normalized into separate tables: `SCOPUS_AREA`, `SCOPUS_AREA_GROUP`, and `SCOPUS_MAJOR_GROUP` with their respective join tables.*

## Journal Area Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | — | `id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier |
| 2 | Journal Title | `journal_title` | `VARCHAR(500)` | Full title of the journal |
| 3 | ISSN | `issn_print` | `VARCHAR(20)` | Print ISSN |
| 4 | ISSNOnline | `issn_online` | `VARCHAR(20)` | Online ISSN |
| 5 | Source | `source` | `VARCHAR(10)` | Source database: `ABDC`, `AJG`, `Scimago`, or `Scopus` |
| 6 | Area | `area` | `VARCHAR(200)` | Subject area classification from the source database |
| 7 | Rank | `rank` | `VARCHAR(5)` | Quality rating from source — ABDC: A\*, A, B, C; Scimago: Q1–Q4 |
| 8 | Active or Inactive | `active_status` | `VARCHAR(10)` | `Active` or `Inactive` (only populated for Scopus rows) |
| 9 | Source Type | `source_type` | `VARCHAR(30)` | Publication type (only populated for Scopus rows) |
| 10 | Best Rank | `best_rank` | `VARCHAR(5)` | Best rank across all areas for the journal within the same source |
| 11 | Area Group | `area_group` | `VARCHAR(100)` | Grouped subject area (e.g. Business, Computer Science, Medicine) |
| 12 | Major Group | `major_group` | `VARCHAR(100)` | Higher-level grouping: Arts & Humanities, Business & Economics, Engineering & Technology, Environmental & Interdisciplinary, Health & Life Sciences, Social Sciences |

## NOTE Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | หมายเหตุหลัก | `note_primary` | `TEXT` | Primary note describing the issue or adjustment made when cross-referencing journals |
| 3 | หมายเหตุรอง1 | `note_secondary_1` | `TEXT` | Secondary detail, typically ISSN-L / ISSN-H cluster references |
| 4 | หมายเหตุรอง2 | `note_secondary_2` | `TEXT` | Secondary detail, typically ISSN / EISSN values from source databases |
| 5 | หมายเหตุรอง3 | `note_secondary_3` | `TEXT` | Secondary detail with additional context (mostly null) |
| 6 | หมายเหตุที่ทำให้ปรับ | `adjustment_reason` | `TEXT` | Reason or trigger for the adjustment (e.g. ISSN mismatch between databases) |

## AREA (Normalized Area Lookup)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `area_id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier for each area |
| 2 | `area_name` | `VARCHAR(200) UNIQUE` | Subject area name (e.g. "Computer Science", "Medicine", "Business, Management and Accounting") |

## JOURNAL_AREA_DETAIL (Journal-Area Many-to-Many)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `journal_id` | `INTEGER`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | `area_id` | `INTEGER`, FK → `AREA.area_id` | References the area in `AREA` |
| — | Composite PK | `(journal_id, area_id)` | A journal can have multiple areas; each (journal, area) pair is unique |

## AREA_GROUP (Normalized Area Group Lookup)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `area_group_id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier for each area group |
| 2 | `area_group_name` | `VARCHAR(100) UNIQUE` | Area group name (e.g. "Business", "Computer Science", "Medicine", "Engineering") |

## JOURNAL_AREA_GROUP_DETAIL (Journal-AreaGroup Many-to-Many)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `journal_id` | `INTEGER`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | `area_group_id` | `INTEGER`, FK → `AREA_GROUP.area_group_id` | References the area group in `AREA_GROUP` |
| — | Composite PK | `(journal_id, area_group_id)` | A journal can belong to multiple area groups; each (journal, area_group) pair is unique |

## MAJOR_GROUP (Normalized Major Group Lookup)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `major_group_id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier for each major group |
| 2 | `major_group_name` | `VARCHAR(100) UNIQUE` | Major group name (e.g. "Arts & Humanities", "Business & Economics", "Engineering & Technology") |

## JOURNAL_MAJOR_GROUP_DETAIL (Journal-MajorGroup Many-to-Many)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `journal_id` | `INTEGER`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | `major_group_id` | `INTEGER`, FK → `MAJOR_GROUP.major_group_id` | References the major group in `MAJOR_GROUP` |
| — | Composite PK | `(journal_id, major_group_id)` | A journal can belong to multiple major groups; each (journal, major_group) pair is unique |

## SCOPUS_AREA (Scopus ASJC Area Lookup)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `scopus_area_id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier for each Scopus ASJC area |
| 2 | `scopus_area_name` | `VARCHAR(200) UNIQUE` | ASJC area name (e.g. "1000 General", "1700 Computer Science", "2700 Medicine") |

## JOURNAL_SCOPUS_AREA_DETAIL (Journal-ScopusArea Many-to-Many)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `journal_id` | `INTEGER`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | `scopus_area_id` | `INTEGER`, FK → `SCOPUS_AREA.scopus_area_id` | References the Scopus ASJC area |
| — | Composite PK | `(journal_id, scopus_area_id)` | A journal can have multiple Scopus areas; each (journal, scopus_area) pair is unique |

## SCOPUS_AREA_GROUP (Scopus Top-Level Area Group Lookup)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `scopus_area_group_id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier for each Scopus top-level area group |
| 2 | `scopus_area_group_name` | `VARCHAR(100) UNIQUE` | Top-level area group name: "Life Sciences", "Social Sciences", "Physical Sciences", "Health Sciences" |

## JOURNAL_SCOPUS_AREA_GROUP_DETAIL (Journal-ScopusAreaGroup Many-to-Many)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `journal_id` | `INTEGER`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | `scopus_area_group_id` | `INTEGER`, FK → `SCOPUS_AREA_GROUP.scopus_area_group_id` | References the Scopus top-level area group |
| — | Composite PK | `(journal_id, scopus_area_group_id)` | A journal can belong to multiple Scopus area groups; each (journal, scopus_area_group) pair is unique |

## SCOPUS_MAJOR_GROUP (Scopus Major Group Lookup)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `scopus_major_group_id` | `SERIAL PRIMARY KEY` | Auto-incrementing unique identifier for each Scopus major group |
| 2 | `scopus_major_group_name` | `VARCHAR(100) UNIQUE` | Scopus major group name (e.g. "Arts & Humanities", "Business & Economics", "Engineering & Technology", "Health & Life Sciences", "Social Sciences", "Environmental & Interdisciplinary") |

## JOURNAL_SCOPUS_MAJOR_GROUP_DETAIL (Journal-ScopusMajorGroup Many-to-Many)

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `journal_id` | `INTEGER`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | `scopus_major_group_id` | `INTEGER`, FK → `SCOPUS_MAJOR_GROUP.scopus_major_group_id` | References the Scopus major group |
| — | Composite PK | `(journal_id, scopus_major_group_id)` | A journal can belong to multiple Scopus major groups; each (journal, scopus_major_group) pair is unique |