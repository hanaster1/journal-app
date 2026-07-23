import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [journalCount, publisherCount, areaCount] = await Promise.all([
    prisma.aBDC_DB.count(),
    prisma.aBDC_DB.findMany({
      where: { publisher: { not: null } },
      select: { publisher: true },
      distinct: ["publisher"],
    }),
    prisma.aBDC_DB.findMany({
      where: { abdc_area: { not: null } },
      select: { abdc_area: true },
      distinct: ["abdc_area"],
    }),
  ]);

  return NextResponse.json({
    journals: journalCount,
    publishers: publisherCount.length,
    areas: areaCount.length,
    databases: 4,
  });
}
