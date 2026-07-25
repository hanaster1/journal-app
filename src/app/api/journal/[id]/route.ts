import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { journalIdSchema } from "@/lib/validations/journals";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const { id } = journalIdSchema.parse({ id: rawId });

  const journal = await prisma.jOURNAL_MAIN.findUnique({
    where: { id },
    include: {
      abdc: { select: { abdc_area: true, rating_2025: true, issn_print: true, issn_online: true } },
      ajg: { select: { ajg_subject_area: true, ajg_2024_rating: true } },
      scimago: { select: { scimago_areas: true, sjr_best_quartile: true } },
      scopus: { select: { active_status: true, coverage_years: true, source_type: true, discontinued: true } },
      note: { select: { note_primary: true, note_secondary_1: true, note_secondary_2: true, note_secondary_3: true, adjustment_reason: true } },
      journalScopusAreaDetails: {
        select: { scopusArea: { select: { scopus_area_name: true } } },
      },
      journalScopusAreaGroupDetails: {
        select: { scopusAreaGroup: { select: { scopus_area_group_name: true } } },
      },
      journalScopusMajorGroupDetails: {
        select: { scopusMajorGroup: { select: { scopus_major_group_name: true } } },
      },
    },
  });

  if (!journal) {
    return NextResponse.json({ error: "Journal not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: journal.id,
    journal_title: journal.journal_title,
    publisher: journal.publisher,
    abdc: journal.abdc,
    ajg: journal.ajg,
    scimago: journal.scimago,
    scopus: {
      active_status: journal.scopus?.active_status ?? null,
      coverage_years: journal.scopus?.coverage_years ?? null,
      source_type: journal.scopus?.source_type ?? null,
      discontinued: journal.scopus?.discontinued ?? null,
      areas: journal.journalScopusAreaDetails.map((d) => d.scopusArea.scopus_area_name),
      area_groups: journal.journalScopusAreaGroupDetails.map(
        (d) => d.scopusAreaGroup.scopus_area_group_name
      ),
      major_groups: journal.journalScopusMajorGroupDetails.map(
        (d) => d.scopusMajorGroup.scopus_major_group_name
      ),
    },
    note: journal.note,
  });
}
