import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { journalsFilterSchema } from "@/lib/validations/journals";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = journalsFilterSchema.parse(Object.fromEntries(searchParams));

  const where: Record<string, unknown> = {};

  if (params.area) {
    where.abdc_area = params.area;
  }

  if (params.search) {
    where.journal_title = {
      contains: params.search,
    };
  }

  const [journals, total] = await Promise.all([
    prisma.aBDC_DB.findMany({
      where,
      include: {
        ajg: { select: { ajg_2024_rating: true } },
        scimago: { select: { sjr_best_quartile: true } },
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
