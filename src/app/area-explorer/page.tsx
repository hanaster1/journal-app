"use client";

import { useState } from "react";
import { useJournals } from "@/hooks/useJournals";
import { useAreas } from "@/hooks/useAreas";
import { useCounters } from "@/hooks/useCounters";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const RATING_COLORS: Record<string, string> = {
  "A*": "bg-purple-100 text-purple-800",
  A: "bg-emerald-100 text-emerald-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-red-100 text-red-800",
  Q1: "bg-green-100 text-green-800",
  Q2: "bg-yellow-100 text-yellow-800",
  Q3: "bg-orange-100 text-orange-800",
  Q4: "bg-red-100 text-red-800",
};

const TIER_MAP: Record<string, number> = {
  "4*": 1,
  "A*": 2, "4": 2, "Q1": 2,
  "A": 3, "3": 3, "Q2": 3,
  "B": 4, "2": 4, "Q3": 4,
  "C": 5, "1": 5, "Q4": 5,
};

function getTopRanks(journal: {
  rating_2025: string | null;
  ajg: { ajg_2024_rating: string | null } | null;
  scimago: { sjr_best_quartile: string | null } | null;
}): string[] {
  const ranks: { value: string; tier: number }[] = [];
  const push = (v: string | null) => {
    const trimmed = v?.trim();
    if (trimmed && TIER_MAP[trimmed]) ranks.push({ value: trimmed, tier: TIER_MAP[trimmed] });
  };
  push(journal.rating_2025);
  push(journal.ajg?.ajg_2024_rating ?? null);
  push(journal.scimago?.sjr_best_quartile ?? null);
  if (ranks.length === 0) return [];
  const bestTier = Math.min(...ranks.map((r) => r.tier));
  return ranks.filter((r) => r.tier === bestTier).map((r) => r.value);
}

function RatingBadge({ label, value }: { label: string; value: string }) {
  const color = RATING_COLORS[value] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${color}`}>
      {label}: {value}
    </span>
  );
}

export default function AreaExplorer() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const { data: areas, isLoading: areasLoading } = useAreas();
  const { data: journalsData, isLoading: journalsLoading } = useJournals({
    area: selectedArea ?? undefined,
    limit: 500,
  });
  const { data: counters, isLoading: countersLoading } = useCounters();

  const journals = journalsData?.journals ?? [];
  const publisherSet = new Set<string>();
  journals.forEach((j: { publisher: string | null }) => {
    if (j.publisher) publisherSet.add(j.publisher);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Area Explorer
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse journals by ABDC area
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="hidden lg:block">
            <h2 className="mb-3 font-heading text-lg font-semibold">Areas</h2>
            {areasLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedArea(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    selectedArea === null
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  All Areas
                </button>
                {(areas as string[])?.map((area: string) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      selectedArea === area
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Accordion defaultValue={[]}>
              <AccordionItem value="areas">
                <AccordionTrigger className="font-heading text-lg font-semibold">
                  Areas
                </AccordionTrigger>
                <AccordionContent>
                  {areasLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedArea(null)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                          selectedArea === null
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        All Areas
                      </button>
                      {(areas as string[])?.map((area: string) => (
                        <button
                          key={area}
                          onClick={() => setSelectedArea(area)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                            selectedArea === area
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-3 text-sm text-muted-foreground">
            Click on a journal to view details.
            {selectedArea && (
              <span className="ml-2">
                Showing: <span className="font-medium text-foreground">{selectedArea}</span>
              </span>
            )}
          </p>

          {journalsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="sticky top-0 px-4 py-3 text-left font-medium text-foreground">
                        Journal Title
                      </th>
                      <th className="sticky top-0 px-4 py-3 text-left font-medium text-foreground">
                        Publisher
                      </th>
                      <th className="sticky top-0 px-4 py-3 text-left font-medium text-foreground">
                        Rank Quality
                      </th>
                      <th className="sticky top-0 px-4 py-3 text-left font-medium text-foreground">
                        ISSN
                      </th>
                      <th className="sticky top-0 px-4 py-3 text-left font-medium text-foreground">
                        ISSN Online
                      </th>
                      <th className="sticky top-0 px-4 py-3 text-left font-medium text-foreground">
                        Top Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {journals.map((journal: {
                      id: number;
                      journal_title: string;
                      publisher: string | null;
                      rating_2025: string | null;
                      issn_print: string | null;
                      issn_online: string | null;
                      ajg: { ajg_2024_rating: string | null } | null;
                      scimago: { sjr_best_quartile: string | null } | null;
                    }) => (
                      <tr
                        key={journal.id}
                        onClick={() => alert(`Journal detail page TBD for: ${journal.journal_title}`)}
                        className="cursor-pointer border-b border-border transition-colors hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 font-medium">{journal.journal_title}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {journal.publisher ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {journal.rating_2025 && (
                              <RatingBadge label="ABDC" value={journal.rating_2025.trim()} />
                            )}
                            {journal.ajg?.ajg_2024_rating && (
                              <RatingBadge label="AJG" value={journal.ajg.ajg_2024_rating.trim()} />
                            )}
                            {journal.scimago?.sjr_best_quartile && (
                              <RatingBadge label="SJR" value={journal.scimago.sjr_best_quartile.trim()} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {journal.issn_print ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {journal.issn_online ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {getTopRanks(journal).map((rank) => (
                              <span
                                key={rank}
                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${RATING_COLORS[rank] ?? "bg-muted text-muted-foreground"}`}
                              >
                                {rank}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {journals.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No journals found for this area.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold">
                    {countersLoading ? "..." : counters?.journals?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Journals</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold">
                    {countersLoading ? "..." : counters?.publishers?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Publishers</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold">
                    {countersLoading ? "..." : counters?.areas?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Areas</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold">{counters?.databases ?? 4}</p>
                  <p className="text-sm text-muted-foreground">Databases</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
