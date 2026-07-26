import { prisma } from "@/lib/db";

export const SOURCE_ORDER = ["ABDC", "AJG", "Scimago", "Scopus"] as const;

export type SourceName = (typeof SOURCE_ORDER)[number];

async function countJournalsByJournalAreaSource(
  source: SourceName
): Promise<number> {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM (
      SELECT DISTINCT ON (JA.journal_title)
        JM.id, JA.journal_title, JA.source
      FROM journal_area JA
      INNER JOIN "JOURNAL_MAIN" JM ON JM.journal_title = JA.journal_title
      WHERE JA.source LIKE ${source}
      ORDER BY JA.journal_title, JM.id
    ) AS subquery
  `;

  return rows[0]?.count ?? 0;
}

export async function getSourceDistribution(): Promise<
  { name: SourceName; count: number }[]
> {
  const counts = await Promise.all(
    SOURCE_ORDER.map((source) => countJournalsByJournalAreaSource(source))
  );

  return SOURCE_ORDER.map((name, index) => ({
    name,
    count: counts[index],
  }));
}
