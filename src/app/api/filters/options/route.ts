import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [
    abdcRatings,
    ajgRatings,
    sjrQuartiles,
    areas,
    ajgSubjectAreas,
    majorGroups,
    areaGroups,
    scopusAreas,
    scopusAreaGroups,
    publishers,
    activeStatuses,
    sourceTypes,
    yearRange,
    sources,
  ] = await Promise.all([
    prisma.aBDC_DB.findMany({
      where: { rating_2025: { not: null } },
      select: { rating_2025: true },
      distinct: ["rating_2025"],
      orderBy: { rating_2025: "asc" },
    }),
    prisma.aJG_DB.findMany({
      where: { ajg_2024_rating: { not: null } },
      select: { ajg_2024_rating: true },
      distinct: ["ajg_2024_rating"],
      orderBy: { ajg_2024_rating: "asc" },
    }),
    prisma.sCIMAGO_DB.findMany({
      where: { sjr_best_quartile: { not: null } },
      select: { sjr_best_quartile: true },
      distinct: ["sjr_best_quartile"],
      orderBy: { sjr_best_quartile: "asc" },
    }),
    prisma.aBDC_DB.findMany({
      where: { abdc_area: { not: null } },
      select: { abdc_area: true },
      distinct: ["abdc_area"],
      orderBy: { abdc_area: "asc" },
    }),
    prisma.aJG_DB.findMany({
      where: { ajg_subject_area: { not: null } },
      select: { ajg_subject_area: true },
      distinct: ["ajg_subject_area"],
      orderBy: { ajg_subject_area: "asc" },
    }),
    prisma.mAJOR_GROUP.findMany({
      orderBy: { major_group_name: "asc" },
    }),
    prisma.aREA_GROUP.findMany({
      orderBy: { area_group_name: "asc" },
    }),
    prisma.sCOPUS_AREA.findMany({
      orderBy: { scopus_area_name: "asc" },
    }),
    prisma.sCOPUS_AREA_GROUP.findMany({
      orderBy: { scopus_area_group_name: "asc" },
    }),
    prisma.jOURNAL_MAIN.findMany({
      where: { publisher: { not: null } },
      select: { publisher: true },
      distinct: ["publisher"],
      orderBy: { publisher: "asc" },
    }),
    prisma.sCOPUS_DB.findMany({
      where: { active_status: { not: null } },
      select: { active_status: true },
      distinct: ["active_status"],
      orderBy: { active_status: "asc" },
    }),
    prisma.sCOPUS_DB.findMany({
      where: { source_type: { not: null } },
      select: { source_type: true },
      distinct: ["source_type"],
      orderBy: { source_type: "asc" },
    }),
    prisma.aBDC_DB.aggregate({
      _min: { year_inception: true },
      _max: { year_inception: true },
    }),
    prisma.journal_area.findMany({
      select: { source: true },
      distinct: ["source"],
      orderBy: { source: "asc" },
    }),
  ]);

  return NextResponse.json({
    abdcRatings: abdcRatings.map((r) => r.rating_2025).filter((v): v is string => v !== null),
    ajgRatings: ajgRatings.map((r) => r.ajg_2024_rating).filter((v): v is string => v !== null),
    sjrQuartiles: sjrQuartiles.map((r) => r.sjr_best_quartile).filter((v): v is string => v !== null),
    areas: areas.map((a) => a.abdc_area).filter((v): v is string => v !== null),
    ajgSubjectAreas: ajgSubjectAreas.map((a) => a.ajg_subject_area).filter((v): v is string => v !== null),
    majorGroups: majorGroups.map((m) => ({ id: m.major_group_id, name: m.major_group_name })),
    areaGroups: areaGroups.map((a) => ({ id: a.area_group_id, name: a.area_group_name })),
    scopusAreas: scopusAreas.map((a) => ({ id: a.scopus_area_id, name: a.scopus_area_name })),
    scopusAreaGroups: scopusAreaGroups.map((a) => ({ id: a.scopus_area_group_id, name: a.scopus_area_group_name })),
    publishers: publishers.map((p) => p.publisher).filter((v): v is string => v !== null),
    activeStatuses: activeStatuses.map((s) => s.active_status).filter((v): v is string => v !== null),
    sourceTypes: sourceTypes.map((s) => s.source_type).filter((v): v is string => v !== null),
    yearRange: {
      min: yearRange._min.year_inception,
      max: yearRange._max.year_inception,
    },
    sources: sources.map((s) => s.source).filter((v): v is string => v !== null),
  });
}
