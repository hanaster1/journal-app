import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { journalsSearchSchema } from "@/lib/validations/journals";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = journalsSearchSchema.parse(Object.fromEntries(searchParams));

  const where: Record<string, unknown> = {
    OR: [
      { journal_title: { contains: params.q } },
      { abdc: { issn_print: { contains: params.q } } },
      { abdc: { issn_online: { contains: params.q } } },
    ],
  };

  if (params.area) {
    where.abdc = { abdc_area: params.area };
  }

  const [journals, total] = await Promise.all([
    prisma.jOURNAL_MAIN.findMany({
      where,
      include: {
        abdc: { select: { issn_print: true, issn_online: true, rating_2025: true, abdc_area: true } },
        ajg: { select: { ajg_2024_rating: true, ajg_subject_area: true } },
        scimago: { select: { sjr_best_quartile: true, scimago_categories: true } },
        scopus: { select: { active_status: true, source_type: true } },
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { journal_title: "asc" },
    }),
    prisma.jOURNAL_MAIN.count({ where }),
  ]);

  return NextResponse.json({
    journals: journals.map((j) => ({
      id: j.id,
      journal_title: j.journal_title,
      publisher: j.publisher,
      issn_print: j.abdc?.issn_print ?? null,
      issn_online: j.abdc?.issn_online ?? null,
      rating_2025: j.abdc?.rating_2025 ?? null,
      abdc_area: j.abdc?.abdc_area ?? null,
      ajg: j.ajg,
      scimago: j.scimago,
      scopus: j.scopus,
    })),
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  });
}
