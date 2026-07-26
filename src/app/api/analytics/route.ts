import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDbCoverageByMajorGroup } from "@/app/analytics/lib/db-coverage-query";
import { getSourceDistribution } from "@/app/analytics/lib/source-distribution-query";

export async function GET() {
  const [
    totalJournals,
    totalAreas,
    majorGroups,
    areaGroups,
    topAreas,
    sourceDistribution,
    abdcRatings,
    ajgRatings,
    scimagoQuartiles,
    scopusStatus,
    scopusSourceType,
    dbCoverageByMajorGroup,
  ] = await Promise.all([
    prisma.jOURNAL_MAIN.count(),

    prisma.aREA.count(),

    prisma.mAJOR_GROUP.findMany({
      include: { _count: { select: { journalMajorGroupDetails: true } } },
      orderBy: { journalMajorGroupDetails: { _count: "desc" } },
    }),

    prisma.aREA_GROUP.findMany({
      include: { _count: { select: { journalAreaGroupDetails: true } } },
      orderBy: { journalAreaGroupDetails: { _count: "desc" } },
    }),

    prisma.aREA.findMany({
      include: { _count: { select: { journalAreaDetails: true } } },
      orderBy: { journalAreaDetails: { _count: "desc" } },
      take: 10,
    }),

    getSourceDistribution(),

    prisma.aBDC_DB.groupBy({
      by: ["rating_2025"],
      where: { rating_2025: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.aJG_DB.groupBy({
      by: ["ajg_2024_rating"],
      where: { ajg_2024_rating: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.sCIMAGO_DB.groupBy({
      by: ["sjr_best_quartile"],
      where: { sjr_best_quartile: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.sCOPUS_DB.groupBy({
      by: ["active_status"],
      where: { active_status: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.sCOPUS_DB.groupBy({
      by: ["source_type"],
      where: { source_type: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    getDbCoverageByMajorGroup(),
  ]);

  const majorGroupData = majorGroups.map((mg) => ({
    name: mg.major_group_name,
    count: mg._count.journalMajorGroupDetails,
  }));

  const areaGroupData = areaGroups.map((ag) => ({
    name: ag.area_group_name,
    count: ag._count.journalAreaGroupDetails,
  }));

  const topAreaData = topAreas.map((a) => ({
    name: a.area_name,
    count: a._count.journalAreaDetails,
  }));

  const sourceData = sourceDistribution;

  const abdcRankData = abdcRatings
    .filter((r) => r.rating_2025)
    .map((r) => ({ rating: r.rating_2025!, count: r._count.id }));

  const ajgRankData = ajgRatings
    .filter((r) => r.ajg_2024_rating)
    .map((r) => ({ rating: r.ajg_2024_rating!, count: r._count.id }));

  const scimagoRankData = scimagoQuartiles
    .filter((r) => r.sjr_best_quartile)
    .map((r) => ({ rating: r.sjr_best_quartile!, count: r._count.id }));

  const scopusStatusData = scopusStatus
    .filter((r) => r.active_status)
    .map((r) => ({ status: r.active_status!, count: r._count.id }));

  const scopusSourceTypeData = scopusSourceType
    .filter((r) => r.source_type)
    .map((r) => ({ type: r.source_type!, count: r._count.id }));

  const dbCoverageData = dbCoverageByMajorGroup;

  const activeScopusCount = scopusStatus
    .filter((r) => r.active_status?.toLowerCase() === "active")
    .reduce((sum, r) => sum + r._count.id, 0);

  const topMajorGroup = majorGroupData.length > 0 ? majorGroupData[0].name : "—";

  return NextResponse.json({
    kpi: {
      totalJournals,
      totalAreas,
      activeScopus: activeScopusCount,
      topMajorGroup,
    },
    majorGroups: majorGroupData,
    areaGroups: areaGroupData,
    topAreas: topAreaData,
    sources: sourceData,
    rankDistribution: {
      ABDC: abdcRankData,
      AJG: ajgRankData,
      Scimago: scimagoRankData,
    },
    scopusStatus: {
      byStatus: scopusStatusData,
      bySourceType: scopusSourceTypeData,
    },
    dbCoverage: dbCoverageData,
  });
}
