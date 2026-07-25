import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  abdcRatings: string[];
  ajgRatings: string[];
  sjrQuartiles: string[];
  areas: string[];
  ajgSubjectAreas: string[];
  majorGroups: { id: number; name: string }[];
  areaGroups: { id: number; name: string }[];
  scopusAreas: { id: number; name: string }[];
  scopusAreaGroups: { id: number; name: string }[];
  publishers: string[];
  activeStatuses: string[];
  sourceTypes: string[];
  yearRange: { min: number | null; max: number | null };
  sources: string[];
}

export function useFilterOptions() {
  return useQuery<FilterOptions>({
    queryKey: ["filterOptions"],
    queryFn: () => fetch("/api/filters/options").then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });
}

export type { FilterOptions };
