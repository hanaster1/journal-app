"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RatingBadge } from "./rating-badge";
import type { JournalSearchResult } from "../hooks/use-journal-search";

interface ResultsCardsProps {
  journals: JournalSearchResult[];
}

export function ResultsCards({ journals }: ResultsCardsProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {journals.map((journal) => (
        <Card
          key={journal.id}
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => router.push(`/journal/${journal.id}`)}
        >
          <CardHeader>
            <CardTitle className="text-base">{journal.journal_title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {journal.publisher ?? "Unknown publisher"}
                  {journal.abdc_area && ` · ${journal.abdc_area}`}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {journal.rating_2025 && (
                    <RatingBadge system="abdc" value={journal.rating_2025} />
                  )}
                  {journal.ajg?.ajg_2024_rating && (
                    <RatingBadge system="ajg" value={journal.ajg.ajg_2024_rating} />
                  )}
                  {journal.scimago?.sjr_best_quartile && (
                    <RatingBadge system="sjr" value={journal.scimago.sjr_best_quartile} />
                  )}
                </div>
              </div>
              <div className="hidden text-right text-xs text-muted-foreground sm:block">
                {journal.issn_print && <div>ISSN: {journal.issn_print}</div>}
                {journal.issn_online && <div>eISSN: {journal.issn_online}</div>}
                {journal.scopus?.active_status && (
                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        journal.scopus.active_status === "Active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span>{journal.scopus.active_status}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
