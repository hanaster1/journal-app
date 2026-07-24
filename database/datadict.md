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
| 10 | Top level: Life Sciences | `top_level_life_sciences` | `VARCHAR(50)` | Non-null if journal belongs to this top-level ASJC division |
| 11 | Top level: Social Sciences | `top_level_social_sciences` | `VARCHAR(50)` | Non-null if journal belongs to this top-level ASJC division |
| 12 | Top level: Physical Sciences | `top_level_physical_sciences` | `VARCHAR(50)` | Non-null if journal belongs to this top-level ASJC division |
| 13 | Top level: Health Sciences | `top_level_health_sciences` | `VARCHAR(50)` | Non-null if journal belongs to this top-level ASJC division |
| 14 | 1000 General | `asjc_1000_general` | `VARCHAR(100)` | ASJC subject area classification |
| 15 | 1100 Agricultural and Biological Sciences | `asjc_1100_agricultural_and_biological_sciences` | `VARCHAR(100)` | ASJC subject area classification |
| 16 | 1200 Arts and Humanities | `asjc_1200_arts_and_humanities` | `VARCHAR(100)` | ASJC subject area classification |
| 17 | 1300 Biochemistry, Genetics and Molecular Biology | `asjc_1300_biochemistry_genetics_molecular_biology` | `VARCHAR(100)` | ASJC subject area classification |
| 18 | 1400 Business, Management and Accounting | `asjc_1400_business_management_accounting` | `VARCHAR(100)` | ASJC subject area classification |
| 19 | 1500 Chemical Engineering | `asjc_1500_chemical_engineering` | `VARCHAR(100)` | ASJC subject area classification |
| 20 | 1600 Chemistry | `asjc_1600_chemistry` | `VARCHAR(100)` | ASJC subject area classification |
| 21 | 1700 Computer Science | `asjc_1700_computer_science` | `VARCHAR(100)` | ASJC subject area classification |
| 22 | 1800 Decision Sciences | `asjc_1800_decision_sciences` | `VARCHAR(100)` | ASJC subject area classification |
| 23 | 1900 Earth and Planetary Sciences | `asjc_1900_earth_and_planetary_sciences` | `VARCHAR(100)` | ASJC subject area classification |
| 24 | 2000 Economics, Econometrics and Finance | `asjc_2000_economics_econometrics_finance` | `VARCHAR(100)` | ASJC subject area classification |
| 25 | 2100 Energy | `asjc_2100_energy` | `VARCHAR(100)` | ASJC subject area classification |
| 26 | 2200 Engineering | `asjc_2200_engineering` | `VARCHAR(100)` | ASJC subject area classification |
| 27 | 2300 Environmental Science | `asjc_2300_environmental_science` | `VARCHAR(100)` | ASJC subject area classification |
| 28 | 2400 Immunology and Microbiology | `asjc_2400_immunology_and_microbiology` | `VARCHAR(100)` | ASJC subject area classification |
| 29 | 2500 Materials Science | `asjc_2500_materials_science` | `VARCHAR(100)` | ASJC subject area classification |
| 30 | 2600 Mathematics | `asjc_2600_mathematics` | `VARCHAR(100)` | ASJC subject area classification |
| 31 | 2700 Medicine | `asjc_2700_medicine` | `VARCHAR(100)` | ASJC subject area classification |
| 32 | 2800 Neuroscience | `asjc_2800_neuroscience` | `VARCHAR(100)` | ASJC subject area classification |
| 33 | 2900 Nursing | `asjc_2900_nursing` | `VARCHAR(100)` | ASJC subject area classification |
| 34 | 3000 Pharmacology, Toxicology and Pharmaceutics | `asjc_3000_pharmacology_toxicology_pharmaceutics` | `VARCHAR(100)` | ASJC subject area classification |
| 35 | 3100 Physics and Astronomy | `asjc_3100_physics_and_astronomy` | `VARCHAR(100)` | ASJC subject area classification |
| 36 | 3200 Psychology | `asjc_3200_psychology` | `VARCHAR(100)` | ASJC subject area classification |
| 37 | 3300 Social Sciences | `asjc_3300_social_sciences` | `VARCHAR(100)` | ASJC subject area classification |
| 38 | 3400 Veterinary | `asjc_3400_veterinary` | `VARCHAR(100)` | ASJC subject area classification |
| 39 | 3500 Dentistry | `asjc_3500_dentistry` | `VARCHAR(100)` | ASJC subject area classification |
| 40 | 3600 Health Professions | `asjc_3600_health_professions` | `VARCHAR(100)` | ASJC subject area classification |

## Journal Area Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | Journal Title | `journal_title` | `VARCHAR(500)` | Full title of the journal |
| 2 | ISSN | `issn_print` | `VARCHAR(20)` | Print ISSN |
| 3 | ISSNOnline | `issn_online` | `VARCHAR(20)` | Online ISSN |
| 4 | Source | `source` | `VARCHAR(10)` | Source database: `ABDC`, `AJG`, `Scimago`, or `Scopus` |
| 5 | Area | `area` | `VARCHAR(200)` | Subject area classification from the source database |
| 6 | Rank | `rank` | `VARCHAR(5)` | Quality rating from source — ABDC: A\*, A, B, C; Scimago: Q1–Q4 |
| 7 | Active or Inactive | `active_status` | `VARCHAR(10)` | `Active` or `Inactive` (only populated for Scopus rows) |
| 8 | Source Type | `source_type` | `VARCHAR(30)` | Publication type (only populated for Scopus rows) |
| 9 | Best Rank | `best_rank` | `VARCHAR(5)` | Best rank across all areas for the journal within the same source |
| 10 | Area Group | `area_group` | `VARCHAR(100)` | Grouped subject area (e.g. Business, Computer Science, Medicine) |
| 11 | Major Group | `major_group` | `VARCHAR(100)` | Higher-level grouping: Arts & Humanities, Business & Economics, Engineering & Technology, Environmental & Interdisciplinary, Health & Life Sciences, Social Sciences |

## NOTE Database

| # | Original Column | New Column (snake_case) | Type | Description |
|---|----------------|------------------------|------|-------------|
| 1 | No | `id` | `PRIMARY KEY`, FK → `JOURNAL_MAIN.id` | References the journal in `JOURNAL_MAIN` |
| 2 | หมายเหตุหลัก | `note_primary` | `TEXT` | Primary note describing the issue or adjustment made when cross-referencing journals |
| 3 | หมายเหตุรอง1 | `note_secondary_1` | `TEXT` | Secondary detail, typically ISSN-L / ISSN-H cluster references |
| 4 | หมายเหตุรอง2 | `note_secondary_2` | `TEXT` | Secondary detail, typically ISSN / EISSN values from source databases |
| 5 | หมายเหตุรอง3 | `note_secondary_3` | `TEXT` | Secondary detail with additional context (mostly null) |
| 6 | หมายเหตุที่ทำให้ปรับ | `adjustment_reason` | `TEXT` | Reason or trigger for the adjustment (e.g. ISSN mismatch between databases) |