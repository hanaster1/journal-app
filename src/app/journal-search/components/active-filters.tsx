"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { SearchFilters } from "../hooks/use-search-state";

interface ActiveFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
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
      label: `Area: ${filters.area}`,
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
      label: `Major Group: ${filters.majorGroupId}`,
      onRemove: () => onFilterChange({ majorGroupId: "" }),
    });
  }

  if (filters.areaGroupId) {
    activeFilters.push({
      key: "area-group",
      label: `Area Group: ${filters.areaGroupId}`,
      onRemove: () => onFilterChange({ areaGroupId: "" }),
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

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1">
          {filter.label}
          <X className="h-3 w-3 cursor-pointer" onClick={filter.onRemove} />
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 px-2 text-xs">
        Clear all
      </Button>
    </div>
  );
}
