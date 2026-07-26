import { prisma } from "@/lib/db";
import { SOURCE_ORDER, type SourceName } from "./source-distribution-query";

export type DbCoverageRow = {
  name: string;
  ABDC: number;
  AJG: number;
  Scimago: number;
  Scopus: number;
};

type CoverageCountRow = {
  major_group: string;
  source: string;
  count: number;
};

function emptyCoverageRow(name: string): DbCoverageRow {
  return { name, ABDC: 0, AJG: 0, Scimago: 0, Scopus: 0 };
}

export async function getDbCoverageByMajorGroup(): Promise<DbCoverageRow[]> {
  const rows = await prisma.$queryRaw<CoverageCountRow[]>`
    SELECT sub.major_group, sub.source, COUNT(*)::int AS count
    FROM (
      SELECT DISTINCT ON (JA.journal_title, JA.major_group, JA.source)
        JM.id, JA.journal_title, JA.source, JA.major_group
      FROM journal_area JA
      INNER JOIN "JOURNAL_MAIN" JM ON JM.journal_title = JA.journal_title
      WHERE JA.source IN ('ABDC', 'AJG', 'Scimago', 'Scopus')
      ORDER BY JA.journal_title, JA.major_group, JA.source, JM.id
    ) sub
    GROUP BY sub.major_group, sub.source
  `;

  const byMajorGroup = new Map<string, DbCoverageRow>();

  for (const row of rows) {
    const source = row.source as SourceName;
    if (!SOURCE_ORDER.includes(source)) continue;

    const entry =
      byMajorGroup.get(row.major_group) ??
      emptyCoverageRow(row.major_group);

    entry[source] = row.count;
    byMajorGroup.set(row.major_group, entry);
  }

  return [...byMajorGroup.values()].sort(
    (a, b) =>
      b.ABDC + b.AJG + b.Scimago + b.Scopus -
      (a.ABDC + a.AJG + a.Scimago + a.Scopus)
  );
}
