"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FilterSidebar } from "./filter-sidebar";
import type { SearchFilters } from "../hooks/use-search-state";
import type { FilterOptions } from "../hooks/use-filter-options";

interface FilterDrawerProps {
  filters: SearchFilters;
  options: FilterOptions;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function FilterDrawer({
  filters,
  options,
  onFilterChange,
  onReset,
  activeFilterCount,
}: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <FilterSidebar
          filters={filters}
          options={options}
          onFilterChange={onFilterChange}
          onReset={onReset}
          activeFilterCount={activeFilterCount}
        />
      </SheetContent>
    </Sheet>
  );
}
