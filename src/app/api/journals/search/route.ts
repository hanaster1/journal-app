import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { journalsSearchSchema } from "@/lib/validations/journals";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = journalsSearchSchema.parse(Object.fromEntries(searchParams));

  const where: Record<string, unknown> = {
    OR: [
      { journal_title: { contains: params.q } },
      { issn_print: { contains: params.q } },
      { issn_online: { contains: params.q } },
    ],
  };

  if (params.area) {
    where.abdc_area = params.area;
  }

  const [journals, total] = await Promise.all([
    prisma.aBDC_DB.findMany({
      where,
      include: {
        ajg: { select: { ajg_2024_rating: true, ajg_subject_area: true } },
        scimago: { select: { sjr_best_quartile: true, scimago_categories: true } },
        scopus: { select: { active_status: true, source_type: true } },
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { journal_title: "asc" },
    }),
    prisma.aBDC_DB.count({ where }),
  ]);

  return NextResponse.json({
    journals,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  });
}
