"use client";

import { useState } from "react";
import { useJournalSearch } from "@/hooks/useJournalSearch";
import { useAreas } from "@/hooks/useAreas";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function FiltersPanel({
  sourceFilter,
  ratingFilter,
  areaFilter,
  onSourceChange,
  onRatingChange,
  onAreaChange,
  onClear,
  areas,
  hasFilters,
}: {
  sourceFilter: string;
  ratingFilter: string;
  areaFilter: string;
  onSourceChange: (v: string) => void;
  onRatingChange: (v: string) => void;
  onAreaChange: (v: string) => void;
  onClear: () => void;
  areas: string[];
  hasFilters: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Source</label>
        <Select value={sourceFilter} onValueChange={(v) => onSourceChange(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="ABDC">ABDC</SelectItem>
            <SelectItem value="AJG">AJG</SelectItem>
            <SelectItem value="Scimago">Scimago</SelectItem>
            <SelectItem value="Scopus">Scopus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <Select value={ratingFilter} onValueChange={(v) => onRatingChange(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="A*">A*</SelectItem>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="Q1">Q1</SelectItem>
            <SelectItem value="Q2">Q2</SelectItem>
            <SelectItem value="Q3">Q3</SelectItem>
            <SelectItem value="Q4">Q4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Area</label>
        <Select value={areaFilter} onValueChange={(v) => onAreaChange(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="All areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {areas?.map((area: string) => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear} className="w-full">
          <X className="mr-1 h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}

export default function JournalSearch() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useJournalSearch({
    q: searchQuery,
    source: sourceFilter || undefined,
    rating: ratingFilter || undefined,
    area: areaFilter || undefined,
    page,
    limit: 20,
  });
  const { data: areas } = useAreas();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    setPage(1);
  };

  const clearFilters = () => {
    setSourceFilter("");
    setRatingFilter("");
    setAreaFilter("");
    setPage(1);
  };

  const handleSourceChange = (v: string) => { setSourceFilter(v); setPage(1); };
  const handleRatingChange = (v: string) => { setRatingFilter(v); setPage(1); };
  const handleAreaChange = (v: string) => { setAreaFilter(v); setPage(1); };

  const hasFilters = sourceFilter || ratingFilter || areaFilter;

  const filterProps = {
    sourceFilter,
    ratingFilter,
    areaFilter,
    onSourceChange: handleSourceChange,
    onRatingChange: handleRatingChange,
    onAreaChange: handleAreaChange,
    onClear: clearFilters,
    areas: (areas as string[]) ?? [],
    hasFilters: !!hasFilters,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Journal Search
        </h1>
        <p className="mt-1 text-muted-foreground">
          Full-text search across journal titles and ISSNs
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search journal titles, ISSN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
        <div className="hidden md:block">
          <Sheet>
            <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-transparent transition-colors hover:bg-muted">
                <Filter className="h-4 w-4" />
              </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FiltersPanel {...filterProps} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </form>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {sourceFilter && (
            <Badge variant="secondary" className="gap-1">
              Source: {sourceFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleSourceChange("")} />
            </Badge>
          )}
          {ratingFilter && (
            <Badge variant="secondary" className="gap-1">
              Rating: {ratingFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleRatingChange("")} />
            </Badge>
          )}
          {areaFilter && (
            <Badge variant="secondary" className="gap-1">
              Area: {areaFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleAreaChange("")} />
            </Badge>
          )}
        </div>
      )}

      <div className="md:hidden">
        <FiltersPanel {...filterProps} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : searchQuery ? (
        <>
          <p className="text-sm text-muted-foreground">
            {data?.total ?? 0} result{data?.total !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
          </p>
          <div className="space-y-3">
            {data?.journals?.map((journal: {
              id: number;
              journal_title: string;
              publisher: string | null;
              issn_print: string | null;
              issn_online: string | null;
              rating_2025: string | null;
              abdc_area: string | null;
              ajg: { ajg_2024_rating: string | null } | null;
              scimago: { sjr_best_quartile: string | null } | null;
              scopus: { active_status: string | null } | null;
            }) => (
              <div
                key={journal.id}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-foreground">{journal.journal_title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {journal.publisher ?? "Unknown publisher"}
                      {journal.abdc_area && ` · ${journal.abdc_area}`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {journal.rating_2025 && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                          ABDC: {journal.rating_2025}
                        </span>
                      )}
                      {journal.ajg?.ajg_2024_rating && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                          AJG: {journal.ajg.ajg_2024_rating}
                        </span>
                      )}
                      {journal.scimago?.sjr_best_quartile && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                          SJR: {journal.scimago.sjr_best_quartile}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden text-right text-xs text-muted-foreground sm:block">
                    {journal.issn_print && <div>ISSN: {journal.issn_print}</div>}
                    {journal.issn_online && <div>eISSN: {journal.issn_online}</div>}
                  </div>
                </div>
              </div>
            ))}
            {data?.journals?.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No journals found matching your search.
              </p>
            )}
          </div>
          {(data?.totalPages ?? 1) > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data?.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (data?.totalPages ?? 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-heading text-lg font-medium text-foreground">
            Search academic journals
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter a journal title or ISSN above to begin searching.
          </p>
        </div>
      )}
    </div>
  );
}
