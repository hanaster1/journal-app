"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { SearchFilters } from "../hooks/use-search-state";
import type { FilterOptions } from "../hooks/use-filter-options";

interface ActiveFiltersProps {
  filters: SearchFilters;
  options?: FilterOptions;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onClearAll: () => void;
}

function getIdOptionName(
  options: { id: number; name: string }[],
  id: string
): string {
  return options.find((option) => option.id.toString() === id)?.name ?? id;
}

export function ActiveFilters({
  filters,
  options,
  onFilterChange,
  onClearAll,
}: ActiveFiltersProps) {
  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.sources.length > 0) {
    filters.sources.forEach((source) => {
      activeFilters.push({
        key: `source-${source}`,
        label: `Source: ${source}`,
        onRemove: () =>
          onFilterChange({ sources: filters.sources.filter((s) => s !== source) }),
      });
    });
  }

  if (filters.abdcRatings.length > 0) {
    filters.abdcRatings.forEach((rating) => {
      activeFilters.push({
        key: `abdc-${rating}`,
        label: `ABDC: ${rating}`,
        onRemove: () =>
          onFilterChange({
            abdcRatings: filters.abdcRatings.filter((r) => r !== rating),
          }),
      });
    });
  }

  if (filters.ajgRatings.length > 0) {
    filters.ajgRatings.forEach((rating) => {
      activeFilters.push({
        key: `ajg-${rating}`,
        label: `AJG: ${rating}`,
        onRemove: () =>
          onFilterChange({
            ajgRatings: filters.ajgRatings.filter((r) => r !== rating),
          }),
      });
    });
  }

  if (filters.sjrQuartiles.length > 0) {
    filters.sjrQuartiles.forEach((quartile) => {
      activeFilters.push({
        key: `sjr-${quartile}`,
        label: `SJR: ${quartile}`,
        onRemove: () =>
          onFilterChange({
            sjrQuartiles: filters.sjrQuartiles.filter((q) => q !== quartile),
          }),
      });
    });
  }

  if (filters.area) {
    activeFilters.push({
      key: "area",
      label: `ABDC Area: ${filters.area}`,
      onRemove: () => onFilterChange({ area: "" }),
    });
  }

  if (filters.ajgSubjectArea) {
    activeFilters.push({
      key: "ajg-subject",
      label: `AJG Subject: ${filters.ajgSubjectArea}`,
      onRemove: () => onFilterChange({ ajgSubjectArea: "" }),
    });
  }

  if (filters.publisher) {
    activeFilters.push({
      key: "publisher",
      label: `Publisher: ${filters.publisher}`,
      onRemove: () => onFilterChange({ publisher: "" }),
    });
  }

  if (filters.majorGroupId) {
    activeFilters.push({
      key: "major-group",
      label: `Major Group: ${
        options
          ? getIdOptionName(options.majorGroups, filters.majorGroupId)
          : filters.majorGroupId
      }`,
      onRemove: () => onFilterChange({ majorGroupId: "" }),
    });
  }

  if (filters.areaGroupId) {
    activeFilters.push({
      key: "area-group",
      label: `Area Group: ${
        options
          ? getIdOptionName(options.areaGroups, filters.areaGroupId)
          : filters.areaGroupId
      }`,
      onRemove: () => onFilterChange({ areaGroupId: "" }),
    });
  }

  if (filters.scopusAreaId) {
    activeFilters.push({
      key: "scopus-area",
      label: `Scopus Area: ${
        options
          ? getIdOptionName(options.scopusAreas, filters.scopusAreaId)
          : filters.scopusAreaId
      }`,
      onRemove: () => onFilterChange({ scopusAreaId: "" }),
    });
  }

  if (filters.scopusAreaGroupId) {
    activeFilters.push({
      key: "scopus-area-group",
      label: `Scopus Area Group: ${
        options
          ? getIdOptionName(options.scopusAreaGroups, filters.scopusAreaGroupId)
          : filters.scopusAreaGroupId
      }`,
      onRemove: () => onFilterChange({ scopusAreaGroupId: "" }),
    });
  }

  if (filters.activeStatuses.length > 0) {
    filters.activeStatuses.forEach((status) => {
      activeFilters.push({
        key: `status-${status}`,
        label: `Status: ${status}`,
        onRemove: () =>
          onFilterChange({
            activeStatuses: filters.activeStatuses.filter((s) => s !== status),
          }),
      });
    });
  }

  if (filters.sourceTypes.length > 0) {
    filters.sourceTypes.forEach((sourceType) => {
      activeFilters.push({
        key: `source-type-${sourceType}`,
        label: `Source Type: ${sourceType}`,
        onRemove: () =>
          onFilterChange({
            sourceTypes: filters.sourceTypes.filter((type) => type !== sourceType),
          }),
      });
    });
  }

  if (filters.yearFrom || filters.yearTo) {
    const from = filters.yearFrom || "…";
    const to = filters.yearTo || "…";
    activeFilters.push({
      key: "year-range",
      label: `Year: ${from}–${to}`,
      onRemove: () => onFilterChange({ yearFrom: "", yearTo: "" }),
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
          {filter.label}
          <button
            type="button"
            aria-label={`Remove ${filter.label}`}
            onClick={filter.onRemove}
            className="rounded-sm p-0.5 hover:bg-secondary-foreground/10"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 px-2 text-xs">
        Clear all
      </Button>
    </div>
  );
}
