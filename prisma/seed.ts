import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

const adapter = new PrismaLibSql({
  url: "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const CSV_DIR = path.join(__dirname, "..", "database");

type CsvRow = Record<string, string>;

function readCsv(filename: string): CsvRow[] {
  const content = readFileSync(path.join(CSV_DIR, filename), "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true, relaxColumnCount: true });
}

function emptyToNull(val: string | undefined): string | null {
  if (val === undefined || val === null) return null;
  const trimmed = val.trim();
  return trimmed === "" ? null : trimmed;
}

function toInt(val: string | undefined): number | null {
  const v = emptyToNull(val);
  if (v === null) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

async function seedAbdc() {
  const rows = readCsv("ABDC_DB.csv");
  for (const row of rows) {
    await prisma.aBDC_DB.upsert({
      where: { id: parseInt(row.id, 10) },
      update: {
        journal_title: row.journal_title.trim(),
        publisher: emptyToNull(row.publisher),
        issn_print: emptyToNull(row.issn_print),
        issn_online: emptyToNull(row.issn_online),
        year_inception: toInt(row.year_inception),
        for_code: toInt(row.for_code),
        abdc_area: emptyToNull(row.abdc_area),
        rating_2025: emptyToNull(row.rating_2025),
        notes: emptyToNull(row.notes),
      },
      create: {
        id: parseInt(row.id, 10),
        journal_title: row.journal_title.trim(),
        publisher: emptyToNull(row.publisher),
        issn_print: emptyToNull(row.issn_print),
        issn_online: emptyToNull(row.issn_online),
        year_inception: toInt(row.year_inception),
        for_code: toInt(row.for_code),
        abdc_area: emptyToNull(row.abdc_area),
        rating_2025: emptyToNull(row.rating_2025),
        notes: emptyToNull(row.notes),
      },
    });
  }
  console.log(`Seeded ${rows.length} ABDC_DB rows`);
}

async function seedAjg() {
  const rows = readCsv("AJG_DB.csv");
  for (const row of rows) {
    const id = parseInt(row.id, 10);
    await prisma.aJG_DB.upsert({
      where: { id },
      update: {
        ajg_match_key: emptyToNull(row.ajg_match_key),
        ajg_issn: emptyToNull(row.ajg_issn),
        ajg_title: emptyToNull(row.ajg_title),
        ajg_subject_area: emptyToNull(row.ajg_subject_area),
        ajg_2024_rating: emptyToNull(row.ajg_2024_rating),
      },
      create: {
        id,
        ajg_match_key: emptyToNull(row.ajg_match_key),
        ajg_issn: emptyToNull(row.ajg_issn),
        ajg_title: emptyToNull(row.ajg_title),
        ajg_subject_area: emptyToNull(row.ajg_subject_area),
        ajg_2024_rating: emptyToNull(row.ajg_2024_rating),
      },
    });
  }
  console.log(`Seeded ${rows.length} AJG_DB rows`);
}

async function seedScimago() {
  const rows = readCsv("SCIMAGO_DB.csv");
  for (const row of rows) {
    const id = parseInt(row.id, 10);
    await prisma.sCIMAGO_DB.upsert({
      where: { id },
      update: {
        scimago_match_key: emptyToNull(row.scimago_match_key),
        scimago_issn: emptyToNull(row.scimago_issn),
        scimago_eissn: emptyToNull(row.scimago_eissn),
        scimago_title: emptyToNull(row.Scimago_Title),
        sjr_best_quartile: emptyToNull(row.SJR_Best_Quartile),
        scimago_categories: emptyToNull(row.Scimago_Categories),
        scimago_areas: emptyToNull(row.Scimago_Areas),
      },
      create: {
        id,
        scimago_match_key: emptyToNull(row.scimago_match_key),
        scimago_issn: emptyToNull(row.scimago_issn),
        scimago_eissn: emptyToNull(row.scimago_eissn),
        scimago_title: emptyToNull(row.Scimago_Title),
        sjr_best_quartile: emptyToNull(row.SJR_Best_Quartile),
        scimago_categories: emptyToNull(row.Scimago_Categories),
        scimago_areas: emptyToNull(row.Scimago_Areas),
      },
    });
  }
  console.log(`Seeded ${rows.length} SCIMAGO_DB rows`);
}

async function seedScopus() {
  const rows = readCsv("SCOPUS_DB.csv");

  const asjcFields = [
    "asjc_1000_general", "asjc_1100_agricultural_and_biological_sciences",
    "asjc_1200_arts_and_humanities", "asjc_1300_biochemistry_genetics_molecular_biology",
    "asjc_1400_business_management_accounting", "asjc_1500_chemical_engineering",
    "asjc_1600_chemistry", "asjc_1700_computer_science", "asjc_1800_decision_sciences",
    "asjc_1900_earth_and_planetary_sciences", "asjc_2000_economics_econometrics_finance",
    "asjc_2100_energy", "asjc_2200_engineering", "asjc_2300_environmental_science",
    "asjc_2400_immunology_and_microbiology", "asjc_2500_materials_science",
    "asjc_2600_mathematics", "asjc_2700_medicine", "asjc_2800_neuroscience",
    "asjc_2900_nursing", "asjc_3000_pharmacology_toxicology_pharmaceutics",
    "asjc_3100_physics_and_astronomy", "asjc_3200_psychology",
    "asjc_3300_social_sciences", "asjc_3400_veterinary", "asjc_3500_dentistry",
    "asjc_3600_health_professions",
  ];

  for (const row of rows) {
    const id = parseInt(row.id, 10);
    const asjcData: Record<string, string | null> = {};
    for (const field of asjcFields) {
      asjcData[field] = emptyToNull(row[field]);
    }

    await prisma.sCOPUS_DB.upsert({
      where: { id },
      update: {
        scopus_match_key: emptyToNull(row.scopus_match_key),
        scopus_issn: emptyToNull(row.scopus_issn),
        scopus_eissn: emptyToNull(row.scopus_eissn),
        scopus_title: emptyToNull(row.scopus_title),
        active_status: emptyToNull(row.active_status),
        coverage_years: emptyToNull(row.coverage_years),
        discontinued: emptyToNull(row.discontinued),
        source_type: emptyToNull(row.source_type),
        top_level_life_sciences: emptyToNull(row.top_level_life_sciences),
        top_level_social_sciences: emptyToNull(row.top_level_social_sciences),
        top_level_physical_sciences: emptyToNull(row.top_level_physical_sciences),
        top_level_health_sciences: emptyToNull(row.top_level_health_sciences),
        ...asjcData,
      },
      create: {
        id,
        scopus_match_key: emptyToNull(row.scopus_match_key),
        scopus_issn: emptyToNull(row.scopus_issn),
        scopus_eissn: emptyToNull(row.scopus_eissn),
        scopus_title: emptyToNull(row.scopus_title),
        active_status: emptyToNull(row.active_status),
        coverage_years: emptyToNull(row.coverage_years),
        discontinued: emptyToNull(row.discontinued),
        source_type: emptyToNull(row.source_type),
        top_level_life_sciences: emptyToNull(row.top_level_life_sciences),
        top_level_social_sciences: emptyToNull(row.top_level_social_sciences),
        top_level_physical_sciences: emptyToNull(row.top_level_physical_sciences),
        top_level_health_sciences: emptyToNull(row.top_level_health_sciences),
        ...asjcData,
      },
    });
  }
  console.log(`Seeded ${rows.length} SCOPUS_DB rows`);
}

async function seedNote() {
  const rows = readCsv("NOTE_DB.csv");
  for (const row of rows) {
    const id = parseInt(row.id, 10);
    await prisma.nOTE_DB.upsert({
      where: { id },
      update: {
        note_primary: emptyToNull(row.note_primary),
        note_secondary_1: emptyToNull(row.note_secondary_1),
        note_secondary_2: emptyToNull(row.note_secondary_2),
        note_secondary_3: emptyToNull(row.note_secondary_3),
        adjustment_reason: emptyToNull(row.adjustment_reason),
      },
      create: {
        id,
        note_primary: emptyToNull(row.note_primary),
        note_secondary_1: emptyToNull(row.note_secondary_1),
        note_secondary_2: emptyToNull(row.note_secondary_2),
        note_secondary_3: emptyToNull(row.note_secondary_3),
        adjustment_reason: emptyToNull(row.adjustment_reason),
      },
    });
  }
  console.log(`Seeded ${rows.length} NOTE_DB rows`);
}

async function seedJournalArea() {
  const rows = readCsv("journal_area.csv");
  for (const row of rows) {
    await prisma.journal_area.create({
      data: {
        journal_title: row.journal_title.trim(),
        issn_print: emptyToNull(row.issn_print),
        issn_online: emptyToNull(row.issn_online),
        source: row.source.trim(),
        area: emptyToNull(row.area),
        rank: emptyToNull(row.rank),
        active_status: emptyToNull(row.active_status),
        source_type: emptyToNull(row.source_type),
        best_rank: emptyToNull(row.best_rank),
        area_group: emptyToNull(row.area_group),
        major_group: row.major_group.trim(),
      },
    });
  }
  console.log(`Seeded ${rows.length} journal_area rows`);
}

async function main() {
  console.log("Seeding database...");
  await seedAbdc();
  await seedAjg();
  await seedScimago();
  await seedScopus();
  await seedNote();
  await seedJournalArea();
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
