"use client";

import { Button } from "@/components/ui/button";
import { Search, FileX } from "lucide-react";

interface EmptyStateProps {
  type: "initial" | "no-results" | "error";
  onClearFilters?: () => void;
  onRetry?: () => void;
}

export function EmptyState({ type, onClearFilters, onRetry }: EmptyStateProps) {
  if (type === "initial") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h3 className="font-heading text-lg font-medium text-foreground">
          Search academic journals
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Enter a journal title, ISSN, or publisher above to begin searching. Use filters to narrow
          results by rating, area, source, and more.
        </p>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileX className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h3 className="font-heading text-lg font-medium text-foreground">
          No journals found
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Try adjusting your search terms or broadening your filters to find more results.
        </p>
        {onClearFilters && (
          <Button variant="outline" className="mt-4" onClick={onClearFilters}>
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileX className="mb-4 h-12 w-12 text-destructive/40" />
        <h3 className="font-heading text-lg font-medium text-foreground">
          Something went wrong
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t load the search results. Please try again.
        </p>
        {onRetry && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  return null;
}
