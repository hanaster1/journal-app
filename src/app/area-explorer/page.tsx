"use client";

import { useState } from "react";
import { useJournalAreas } from "@/hooks/useJournalAreas";
import { useFilters } from "@/hooks/useFilters";
import { useCounters } from "@/hooks/useCounters";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const TIER_COLORS: Record<number, string> = {
  1: "bg-primary/10 text-primary border-primary/20",
  2: "bg-indigo-50 text-indigo-700 border-indigo-200",
  3: "bg-slate-50 text-slate-600 border-slate-200",
  4: "bg-stone-50 text-stone-500 border-stone-200",
  5: "bg-zinc-50 text-zinc-400 border-zinc-200",
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
  const tier = TIER_MAP[value] ?? 5;
  const color = TIER_COLORS[tier] ?? TIER_COLORS[5];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${color}`}>
      {label}: {value}
    </Badge>
  );
}

function ComboboxFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: string[];
}) {
  const allOptions = [null, ...options];

  return (
    <Combobox
      items={allOptions}
      value={value}
      onValueChange={onChange}
      itemToStringValue={(item) => item ?? `All ${label}`}
    >
      <ComboboxInput placeholder={value ?? label} className="w-[180px]" />
      <ComboboxContent>
        <ComboboxEmpty>No {label.toLowerCase()} found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item ?? "all"} value={item}>
              {item ?? `All ${label}`}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default function AreaExplorer() {
  const [majorGroup, setMajorGroup] = useState<string | null>(null);
  const [areaGroup, setAreaGroup] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [rank, setRank] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: filters, isLoading: filtersLoading } = useFilters();
  const { data: journalAreasData, isLoading: journalAreasLoading } = useJournalAreas({
    majorGroup: majorGroup ?? undefined,
    areaGroup: areaGroup ?? undefined,
    area: area ?? undefined,
    source: source ?? undefined,
    rank: rank ?? undefined,
    page: currentPage,
    limit: pageSize,
  });
  const { data: counters, isLoading: countersLoading } = useCounters();

  const journals = journalAreasData?.journals ?? [];
  const totalPages = journalAreasData?.totalPages ?? 1;

  const handleFilterChange = (setter: (value: string | null) => void) => (value: string | null) => {
    setter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(Number(value));
      setCurrentPage(1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Area Explorer
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse journals by major group, area group, area, source, and rank.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          {filtersLoading ? (
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-[180px]" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <ComboboxFilter
                label="Major Group"
                value={majorGroup}
                onChange={handleFilterChange(setMajorGroup)}
                options={filters?.majorGroups ?? []}
              />
              <ComboboxFilter
                label="Area Group"
                value={areaGroup}
                onChange={handleFilterChange(setAreaGroup)}
                options={filters?.areaGroups ?? []}
              />
              <ComboboxFilter
                label="Area"
                value={area}
                onChange={handleFilterChange(setArea)}
                options={filters?.areas ?? []}
              />
              <ComboboxFilter
                label="Source"
                value={source}
                onChange={handleFilterChange(setSource)}
                options={filters?.sources ?? []}
              />
              <ComboboxFilter
                label="Rank"
                value={rank}
                onChange={handleFilterChange(setRank)}
                options={filters?.ranks ?? []}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl">Journals</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {journalAreasLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Journal Title</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Rank Quality</TableHead>
                    <TableHead>ISSN</TableHead>
                    <TableHead>ISSN Online</TableHead>
                    <TableHead>Top Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                    <TableRow
                      key={journal.id}
                      onClick={() => alert(`Journal detail page TBD for: ${journal.journal_title}`)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div className="line-clamp-3" title={journal.journal_title}>
                          {journal.journal_title}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="line-clamp-2" title={journal.publisher ?? ""}>
                          {journal.publisher ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {journal.issn_print ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {journal.issn_online ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getTopRanks(journal).map((rank) => {
                            const tier = TIER_MAP[rank] ?? 5;
                            const color = TIER_COLORS[tier] ?? TIER_COLORS[5];
                            return (
                              <Badge key={rank} variant="outline" className={`text-xs font-medium ${color}`}>
                                {rank}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {journals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No journals found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
    </div>
  );
}
