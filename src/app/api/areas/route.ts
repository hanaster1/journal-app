import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const areas = await prisma.aBDC_DB.findMany({
    where: { abdc_area: { not: null } },
    select: { abdc_area: true },
    distinct: ["abdc_area"],
    orderBy: { abdc_area: "asc" },
  });

  return NextResponse.json(
    areas.map((a) => a.abdc_area).filter(Boolean)
  );
}
