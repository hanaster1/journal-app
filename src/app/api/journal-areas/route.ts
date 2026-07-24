import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const area = searchParams.get("area");
  const areaGroup = searchParams.get("areaGroup");
  const majorGroup = searchParams.get("majorGroup");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const where: Record<string, unknown> = {};

  if (area) {
    where.journalAreaDetails = {
      some: {
        area: {
          area_name: area,
        },
      },
    };
  }

  if (areaGroup) {
    where.journalAreaGroupDetails = {
      some: {
        areaGroup: {
          area_group_name: areaGroup,
        },
      },
    };
  }

  if (majorGroup) {
    where.journalMajorGroupDetails = {
      some: {
        majorGroup: {
          major_group_name: majorGroup,
        },
      },
    };
  }

  const [journals, total] = await Promise.all([
    prisma.jOURNAL_MAIN.findMany({
      where,
      include: {
        abdc: {
          select: {
            issn_print: true,
            issn_online: true,
            rating_2025: true,
            abdc_area: true,
          },
        },
        ajg: { select: { ajg_2024_rating: true } },
        scimago: { select: { sjr_best_quartile: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
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
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
