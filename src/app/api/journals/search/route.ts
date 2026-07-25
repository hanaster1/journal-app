import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { journalsSearchSchema } from "@/lib/validations/journals";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = journalsSearchSchema.parse(Object.fromEntries(searchParams));

  const conditions: Prisma.JOURNAL_MAINWhereInput[] = [];

  if (params.q) {
    conditions.push({
      OR: [
        { journal_title: { contains: params.q, mode: "insensitive" } },
        { publisher: { contains: params.q, mode: "insensitive" } },
        { abdc: { issn_print: { contains: params.q } } },
        { abdc: { issn_online: { contains: params.q } } },
        { ajg: { ajg_title: { contains: params.q, mode: "insensitive" } } },
        { ajg: { ajg_issn: { contains: params.q } } },
        { scimago: { scimago_title: { contains: params.q, mode: "insensitive" } } },
        { scimago: { scimago_issn: { contains: params.q } } },
        { scimago: { scimago_eissn: { contains: params.q } } },
        { scopus: { scopus_title: { contains: params.q, mode: "insensitive" } } },
        { scopus: { scopus_issn: { contains: params.q } } },
        { scopus: { scopus_eissn: { contains: params.q } } },
      ],
    });
  }

  if (params.source) {
    const sources = params.source.split(",").filter(Boolean);
    if (sources.length > 0) {
      const sourceConditions: Prisma.JOURNAL_MAINWhereInput[] = [];
      for (const s of sources) {
        switch (s) {
          case "ABDC":
            sourceConditions.push({ abdc: { isNot: null } });
            break;
          case "AJG":
            sourceConditions.push({ ajg: { isNot: null } });
            break;
          case "Scimago":
            sourceConditions.push({ scimago: { isNot: null } });
            break;
          case "Scopus":
            sourceConditions.push({ scopus: { isNot: null } });
            break;
        }
      }
      if (sourceConditions.length > 0) {
        conditions.push({ OR: sourceConditions });
      }
    }
  }

  if (params.abdc_rating) {
    const ratings = params.abdc_rating.split(",").filter(Boolean);
    if (ratings.length > 0) {
      conditions.push({ abdc: { rating_2025: { in: ratings } } });
    }
  }

  if (params.ajg_rating) {
    const ratings = params.ajg_rating.split(",").filter(Boolean);
    if (ratings.length > 0) {
      conditions.push({ ajg: { ajg_2024_rating: { in: ratings } } });
    }
  }

  if (params.sjr_quartile) {
    const quartiles = params.sjr_quartile.split(",").filter(Boolean);
    if (quartiles.length > 0) {
      conditions.push({ scimago: { sjr_best_quartile: { in: quartiles } } });
    }
  }

  if (params.area) {
    conditions.push({ abdc: { abdc_area: params.area } });
  }

  if (params.ajg_subject_area) {
    conditions.push({ ajg: { ajg_subject_area: params.ajg_subject_area } });
  }

  if (params.scimago_areas) {
    conditions.push({ scimago: { scimago_areas: { contains: params.scimago_areas, mode: "insensitive" } } });
  }

  if (params.scopus_area_id) {
    conditions.push({
      journalScopusAreaDetails: { some: { scopus_area_id: params.scopus_area_id } },
    });
  }

  if (params.scopus_area_group_id) {
    conditions.push({
      journalScopusAreaGroupDetails: { some: { scopus_area_group_id: params.scopus_area_group_id } },
    });
  }

  if (params.major_group_id) {
    conditions.push({
      journalMajorGroupDetails: { some: { major_group_id: params.major_group_id } },
    });
  }

  if (params.area_group_id) {
    conditions.push({
      journalAreaGroupDetails: { some: { area_group_id: params.area_group_id } },
    });
  }

  if (params.publisher) {
    conditions.push({ publisher: { equals: params.publisher } });
  }

  if (params.active_status) {
    const statuses = params.active_status.split(",").filter(Boolean);
    if (statuses.length > 0) {
      conditions.push({ scopus: { active_status: { in: statuses } } });
    }
  }

  if (params.source_type) {
    const types = params.source_type.split(",").filter(Boolean);
    if (types.length > 0) {
      conditions.push({ scopus: { source_type: { in: types } } });
    }
  }

  if (params.year_from != null && params.year_to != null) {
    conditions.push({ abdc: { year_inception: { gte: params.year_from, lte: params.year_to } } });
  } else if (params.year_from != null) {
    conditions.push({ abdc: { year_inception: { gte: params.year_from } } });
  } else if (params.year_to != null) {
    conditions.push({ abdc: { year_inception: { lte: params.year_to } } });
  }

  const where: Prisma.JOURNAL_MAINWhereInput = conditions.length > 0 ? { AND: conditions } : {};

  let orderBy: Prisma.JOURNAL_MAINOrderByWithRelationInput;
  switch (params.sort) {
    case "title":
      orderBy = { journal_title: params.order };
      break;
    case "publisher":
      orderBy = { publisher: params.order };
      break;
    case "year":
      orderBy = { abdc: { year_inception: params.order } };
      break;
    default:
      orderBy = { journal_title: "asc" };
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
            year_inception: true,
          },
        },
        ajg: {
          select: {
            ajg_2024_rating: true,
            ajg_subject_area: true,
          },
        },
        scimago: {
          select: {
            sjr_best_quartile: true,
            scimago_categories: true,
            scimago_areas: true,
          },
        },
        scopus: {
          select: {
            active_status: true,
            source_type: true,
            coverage_years: true,
          },
        },
        journalAreaDetails: {
          select: {
            area: { select: { area_name: true } },
          },
        },
        journalMajorGroupDetails: {
          select: {
            majorGroup: { select: { major_group_name: true } },
          },
        },
        journalAreaGroupDetails: {
          select: {
            areaGroup: { select: { area_group_name: true } },
          },
        },
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy,
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
      year_inception: j.abdc?.year_inception ?? null,
      ajg: j.ajg,
      scimago: j.scimago,
      scopus: j.scopus,
      areas: j.journalAreaDetails.map((d) => d.area.area_name),
      major_groups: j.journalMajorGroupDetails.map((d) => d.majorGroup.major_group_name),
      area_groups: j.journalAreaGroupDetails.map((d) => d.areaGroup.area_group_name),
    })),
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  });
}
