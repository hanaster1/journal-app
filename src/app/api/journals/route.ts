import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { journalsFilterSchema } from "@/lib/validations/journals";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = journalsFilterSchema.parse(Object.fromEntries(searchParams));

  const where: Record<string, unknown> = {};

  if (params.area) {
    where.abdc = { abdc_area: params.area };
  }

  if (params.search) {
    where.journal_title = {
      contains: params.search,
    };
  }

  const [journals, total] = await Promise.all([
    prisma.jOURNAL_MAIN.findMany({
      where,
      include: {
        abdc: { select: { issn_print: true, issn_online: true, rating_2025: true, abdc_area: true } },
        ajg: { select: { ajg_2024_rating: true } },
        scimago: { select: { sjr_best_quartile: true } },
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
    })),
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  });
}
