# Entity-Relationship Diagram

```mermaid
erDiagram
    ABDC_DB ||--o| AJG_DB : "id"
    ABDC_DB ||--o| SCIMAGO_DB : "id"
    ABDC_DB ||--o| SCOPUS_DB : "id"
    ABDC_DB ||--o| NOTE_DB : "id"

    ABDC_DB {
        int id "PK SERIAL PRIMARY KEY"
        varchar journal_title "Journal Title"
        varchar publisher "Publisher"
        varchar issn_print "Print ISSN"
        varchar issn_online "Online ISSN"
        int year_inception "Year Inception"
        int for_code "FoR Code"
        varchar abdc_area "ABDC Area"
        varchar rating_2025 "2025 Rating (A*, A, B, C)"
        text notes "Additional Notes"
    }

    AJG_DB {
        int id "PK FK SERIAL PRIMARY KEY"
        varchar ajg_match_key "AJG Match Key"
        varchar ajg_issn "AJG ISSN"
        varchar ajg_title "AJG Title"
        varchar ajg_subject_area "Subject Area"
        varchar ajg_2024_rating "2024 Rating (1-4*)"
    }

    SCIMAGO_DB {
        int id "PK FK SERIAL PRIMARY KEY"
        varchar scimago_issn "Scimago ISSN"
        varchar scimago_eissn "Scimago EISSN"
        varchar scimago_title "Scimago Title"
        varchar sjr_best_quartile "SJR Best Quartile"
        varchar scimago_categories "Categories"
        varchar scimago_match_key "Scimago Match Key"
        varchar scimago_areas "Areas"
    }

    SCOPUS_DB {
        int id "PK FK SERIAL PRIMARY KEY"
        varchar scopus_match_key "Scopus Match Key"
        varchar scopus_issn "Scopus ISSN"
        varchar scopus_eissn "Scopus EISSN"
        varchar scopus_title "Scopus Title"
        varchar active_status "Active or Inactive"
        varchar coverage_years "Coverage Years"
        varchar discontinued "Discontinued"
        varchar source_type "Source Type (Journal, etc.)"
        varchar top_level_life_sciences "Life Sciences"
        varchar top_level_social_sciences "Social Sciences"
        varchar top_level_physical_sciences "Physical Sciences"
        varchar top_level_health_sciences "Health Sciences"
        varchar asjc_1000_general "ASJC General"
        varchar asjc_1400_business "Business, Management..."
        varchar asjc_1700_computer_science "Computer Science"
        varchar asjc_2000_economics "Economics..."
        varchar asjc_2700_medicine "Medicine"
        varchar asjc_3200_psychology "Psychology"
        varchar asjc_3300_social_sciences "Social Sciences"
    }

    NOTE_DB {
        int id "PK FK SERIAL PRIMARY KEY"
        text note_primary "Primary Note"
        text note_secondary_1 "Secondary Detail 1"
        text note_secondary_2 "Secondary Detail 2"
        text note_secondary_3 "Secondary Detail 3"
        text adjustment_reason "Adjustment Reason"
    }

    journal_area {
        varchar journal_title "Journal Title"
        varchar issn_print "Print ISSN"
        varchar issn_online "Online ISSN"
        varchar source "Source (ABDC/AJG/Scimago/Scopus)"
        varchar area "Subject Area"
        varchar rank "Quality Rating"
        varchar active_status "Active/Inactive"
        varchar source_type "Source Type"
        varchar best_rank "Best Rank"
        varchar area_group "Area Group"
        varchar major_group "Major Group"
    }
```

## Relationships

| Parent | Child | Type | Description |
|--------|-------|------|-------------|
| `ABDC_DB` | `AJG_DB` | One-to-Zero-or-One | Each ABDC journal may have an AJG record (matched by `id`) |
| `ABDC_DB` | `SCIMAGO_DB` | One-to-Zero-or-One | Each ABDC journal may have a Scimago record (matched by `id`) |
| `ABDC_DB` | `SCOPUS_DB` | One-to-Zero-or-One | Each ABDC journal may have a Scopus record (matched by `id`) |
| `ABDC_DB` | `NOTE_DB` | One-to-Zero-or-One | Each ABDC journal may have adjustment notes (matched by `id`) |
| — | `journal_area` | Standalone | A denormalized/aggregated view combining data from all source databases |
```
