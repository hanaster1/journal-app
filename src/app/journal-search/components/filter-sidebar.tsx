"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterSection } from "./filter-section";
import { FilterCheckboxGroup } from "./filter-checkbox-group";
import { FilterSearchable, FilterSearchableId } from "./filter-searchable";
import { FilterYearRange } from "./filter-year-range";
import type { SearchFilters } from "../hooks/use-search-state";
import type { FilterOptions } from "../hooks/use-filter-options";

interface FilterSidebarProps {
  filters: SearchFilters;
  options: FilterOptions;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  options,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="space-y-1 px-4">
          <FilterSection
            title="Database Source"
            count={filters.sources.length}
            defaultValue={true}
          >
            <FilterCheckboxGroup
              label=""
              options={options.sources}
              selected={filters.sources}
              onChange={(sources) => onFilterChange({ sources })}
            />
          </FilterSection>

          <FilterSection
            title="ABDC Rating"
            count={filters.abdcRatings.length}
          >
            <FilterCheckboxGroup
              label=""
              options={options.abdcRatings}
              selected={filters.abdcRatings}
              onChange={(abdcRatings) => onFilterChange({ abdcRatings })}
            />
          </FilterSection>

          <FilterSection
            title="AJG Rating"
            count={filters.ajgRatings.length}
          >
            <FilterCheckboxGroup
              label=""
              options={options.ajgRatings}
              selected={filters.ajgRatings}
              onChange={(ajgRatings) => onFilterChange({ ajgRatings })}
            />
          </FilterSection>

          <FilterSection
            title="SJR Quartile"
            count={filters.sjrQuartiles.length}
          >
            <FilterCheckboxGroup
              label=""
              options={options.sjrQuartiles}
              selected={filters.sjrQuartiles}
              onChange={(sjrQuartiles) => onFilterChange({ sjrQuartiles })}
            />
          </FilterSection>

          <FilterSection title="ABDC Area" count={filters.area ? 1 : 0}>
            <FilterSearchable
              label=""
              options={options.areas}
              value={filters.area}
              onChange={(area) => onFilterChange({ area })}
              placeholder="Select area..."
            />
          </FilterSection>

          <FilterSection
            title="AJG Subject Area"
            count={filters.ajgSubjectArea ? 1 : 0}
          >
            <FilterSearchable
              label=""
              options={options.ajgSubjectAreas}
              value={filters.ajgSubjectArea}
              onChange={(ajgSubjectArea) => onFilterChange({ ajgSubjectArea })}
              placeholder="Select subject area..."
            />
          </FilterSection>

          <FilterSection
            title="Major Group"
            count={filters.majorGroupId ? 1 : 0}
          >
            <FilterSearchableId
              label=""
              options={options.majorGroups}
              value={filters.majorGroupId}
              onChange={(majorGroupId) => onFilterChange({ majorGroupId })}
              placeholder="Select major group..."
            />
          </FilterSection>

          <FilterSection
            title="Area Group"
            count={filters.areaGroupId ? 1 : 0}
          >
            <FilterSearchableId
              label=""
              options={options.areaGroups}
              value={filters.areaGroupId}
              onChange={(areaGroupId) => onFilterChange({ areaGroupId })}
              placeholder="Select area group..."
            />
          </FilterSection>

          <FilterSection
            title="Scopus Area"
            count={filters.scopusAreaId ? 1 : 0}
          >
            <FilterSearchableId
              label=""
              options={options.scopusAreas}
              value={filters.scopusAreaId}
              onChange={(scopusAreaId) => onFilterChange({ scopusAreaId })}
              placeholder="Select Scopus area..."
            />
          </FilterSection>

          <FilterSection
            title="Scopus Area Group"
            count={filters.scopusAreaGroupId ? 1 : 0}
          >
            <FilterSearchableId
              label=""
              options={options.scopusAreaGroups}
              value={filters.scopusAreaGroupId}
              onChange={(scopusAreaGroupId) =>
                onFilterChange({ scopusAreaGroupId })
              }
              placeholder="Select Scopus area group..."
            />
          </FilterSection>

          <FilterSection
            title="Publisher"
            count={filters.publisher ? 1 : 0}
          >
            <FilterSearchable
              label=""
              options={options.publishers}
              value={filters.publisher}
              onChange={(publisher) => onFilterChange({ publisher })}
              placeholder="Select publisher..."
            />
          </FilterSection>

          <FilterSection
            title="Active Status"
            count={filters.activeStatuses.length}
          >
            <FilterCheckboxGroup
              label=""
              options={options.activeStatuses}
              selected={filters.activeStatuses}
              onChange={(activeStatuses) =>
                onFilterChange({ activeStatuses })
              }
            />
          </FilterSection>

          <FilterSection
            title="Source Type"
            count={filters.sourceTypes.length}
          >
            <FilterCheckboxGroup
              label=""
              options={options.sourceTypes}
              selected={filters.sourceTypes}
              onChange={(sourceTypes) => onFilterChange({ sourceTypes })}
            />
          </FilterSection>

          <FilterSection
            title="Year Inception"
            count={filters.yearFrom || filters.yearTo ? 1 : 0}
          >
            <FilterYearRange
              min={options.yearRange.min ?? 1800}
              max={options.yearRange.max ?? 2025}
              yearFrom={filters.yearFrom}
              yearTo={filters.yearTo}
              onChange={(yearFrom, yearTo) => onFilterChange({ yearFrom, yearTo })}
            />
          </FilterSection>
        </div>
      </CardContent>
      <CardFooter className="shrink-0">
        <Button variant="outline" onClick={onReset} className="w-full">
          Reset Filters
        </Button>
      </CardFooter>
    </Card>
  );
}
