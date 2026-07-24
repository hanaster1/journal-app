-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "JOURNAL_MAIN" (
    "id" INTEGER NOT NULL,
    "journal_title" TEXT NOT NULL,
    "publisher" TEXT,

    CONSTRAINT "JOURNAL_MAIN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABDC_DB" (
    "id" INTEGER NOT NULL,
    "issn_print" TEXT,
    "issn_online" TEXT,
    "year_inception" INTEGER,
    "for_code" INTEGER,
    "abdc_area" TEXT,
    "rating_2025" TEXT,
    "notes" TEXT,

    CONSTRAINT "ABDC_DB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AJG_DB" (
    "id" INTEGER NOT NULL,
    "ajg_match_key" TEXT,
    "ajg_issn" TEXT,
    "ajg_title" TEXT,
    "ajg_subject_area" TEXT,
    "ajg_2024_rating" TEXT,

    CONSTRAINT "AJG_DB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCIMAGO_DB" (
    "id" INTEGER NOT NULL,
    "scimago_issn" TEXT,
    "scimago_eissn" TEXT,
    "scimago_title" TEXT,
    "sjr_best_quartile" TEXT,
    "scimago_categories" TEXT,
    "scimago_match_key" TEXT,
    "scimago_areas" TEXT,

    CONSTRAINT "SCIMAGO_DB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCOPUS_DB" (
    "id" INTEGER NOT NULL,
    "scopus_match_key" TEXT,
    "scopus_issn" TEXT,
    "scopus_eissn" TEXT,
    "scopus_title" TEXT,
    "active_status" TEXT,
    "coverage_years" TEXT,
    "discontinued" TEXT,
    "source_type" TEXT,
    "top_level_life_sciences" TEXT,
    "top_level_social_sciences" TEXT,
    "top_level_physical_sciences" TEXT,
    "top_level_health_sciences" TEXT,
    "asjc_1000_general" TEXT,
    "asjc_1100_agricultural_and_biological_sciences" TEXT,
    "asjc_1200_arts_and_humanities" TEXT,
    "asjc_1300_biochemistry_genetics_molecular_biology" TEXT,
    "asjc_1400_business_management_accounting" TEXT,
    "asjc_1500_chemical_engineering" TEXT,
    "asjc_1600_chemistry" TEXT,
    "asjc_1700_computer_science" TEXT,
    "asjc_1800_decision_sciences" TEXT,
    "asjc_1900_earth_and_planetary_sciences" TEXT,
    "asjc_2000_economics_econometrics_finance" TEXT,
    "asjc_2100_energy" TEXT,
    "asjc_2200_engineering" TEXT,
    "asjc_2300_environmental_science" TEXT,
    "asjc_2400_immunology_and_microbiology" TEXT,
    "asjc_2500_materials_science" TEXT,
    "asjc_2600_mathematics" TEXT,
    "asjc_2700_medicine" TEXT,
    "asjc_2800_neuroscience" TEXT,
    "asjc_2900_nursing" TEXT,
    "asjc_3000_pharmacology_toxicology_pharmaceutics" TEXT,
    "asjc_3100_physics_and_astronomy" TEXT,
    "asjc_3200_psychology" TEXT,
    "asjc_3300_social_sciences" TEXT,
    "asjc_3400_veterinary" TEXT,
    "asjc_3500_dentistry" TEXT,
    "asjc_3600_health_professions" TEXT,

    CONSTRAINT "SCOPUS_DB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NOTE_DB" (
    "id" INTEGER NOT NULL,
    "note_primary" TEXT,
    "note_secondary_1" TEXT,
    "note_secondary_2" TEXT,
    "note_secondary_3" TEXT,
    "adjustment_reason" TEXT,

    CONSTRAINT "NOTE_DB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_area" (
    "id" SERIAL NOT NULL,
    "journal_title" TEXT NOT NULL,
    "issn_print" TEXT,
    "issn_online" TEXT,
    "source" TEXT NOT NULL,
    "area" TEXT,
    "rank" TEXT,
    "active_status" TEXT,
    "source_type" TEXT,
    "best_rank" TEXT,
    "area_group" TEXT,
    "major_group" TEXT NOT NULL,

    CONSTRAINT "journal_area_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ABDC_DB" ADD CONSTRAINT "ABDC_DB_id_fkey" FOREIGN KEY ("id") REFERENCES "JOURNAL_MAIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AJG_DB" ADD CONSTRAINT "AJG_DB_id_fkey" FOREIGN KEY ("id") REFERENCES "JOURNAL_MAIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCIMAGO_DB" ADD CONSTRAINT "SCIMAGO_DB_id_fkey" FOREIGN KEY ("id") REFERENCES "JOURNAL_MAIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCOPUS_DB" ADD CONSTRAINT "SCOPUS_DB_id_fkey" FOREIGN KEY ("id") REFERENCES "JOURNAL_MAIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NOTE_DB" ADD CONSTRAINT "NOTE_DB_id_fkey" FOREIGN KEY ("id") REFERENCES "JOURNAL_MAIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

