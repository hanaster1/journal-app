import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [majorGroups, areaGroups, areas, sources, ranks] = await Promise.all([
    prisma.journal_area.findMany({
      select: { major_group: true },
      distinct: ["major_group"],
      orderBy: { major_group: "asc" },
    }),
    prisma.journal_area.findMany({
      where: { area_group: { not: null } },
      select: { area_group: true },
      distinct: ["area_group"],
      orderBy: { area_group: "asc" },
    }),
    prisma.journal_area.findMany({
      where: { area: { not: null } },
      select: { area: true },
      distinct: ["area"],
      orderBy: { area: "asc" },
    }),
    prisma.journal_area.findMany({
      select: { source: true },
      distinct: ["source"],
      orderBy: { source: "asc" },
    }),
    prisma.journal_area.findMany({
      where: { rank: { not: null } },
      select: { rank: true },
      distinct: ["rank"],
      orderBy: { rank: "asc" },
    }),
  ]);

  return NextResponse.json({
    majorGroups: majorGroups.map((m) => m.major_group).filter((v): v is string => v !== null),
    areaGroups: areaGroups.map((a) => a.area_group).filter((v): v is string => v !== null),
    areas: areas.map((a) => a.area).filter((v): v is string => v !== null),
    sources: sources.map((s) => s.source).filter((v): v is string => v !== null),
    ranks: ranks.map((r) => r.rank).filter((v): v is string => v !== null),
  });
}
