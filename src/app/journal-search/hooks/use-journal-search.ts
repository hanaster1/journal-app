import { useQuery } from "@tanstack/react-query";
import type { SearchState } from "../hooks/use-search-state";

interface JournalSearchResult {
  id: number;
  journal_title: string;
  publisher: string | null;
  issn_print: string | null;
  issn_online: string | null;
  rating_2025: string | null;
  abdc_area: string | null;
  year_inception: number | null;
  ajg: { ajg_2024_rating: string | null; ajg_subject_area: string | null } | null;
  scimago: { sjr_best_quartile: string | null; scimago_categories: string | null; scimago_areas: string | null } | null;
  scopus: { active_status: string | null; source_type: string | null; coverage_years: string | null } | null;
  areas: string[];
  major_groups: string[];
  area_groups: string[];
}

interface SearchResponse {
  journals: JournalSearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useJournalSearch(state: SearchState) {
  const searchParams = new URLSearchParams();

  if (state.query) searchParams.set("q", state.query);

  const { filters } = state;
  if (filters.sources.length > 0) searchParams.set("source", filters.sources.join(","));
  if (filters.abdcRatings.length > 0) searchParams.set("abdc_rating", filters.abdcRatings.join(","));
  if (filters.ajgRatings.length > 0) searchParams.set("ajg_rating", filters.ajgRatings.join(","));
  if (filters.sjrQuartiles.length > 0) searchParams.set("sjr_quartile", filters.sjrQuartiles.join(","));
  if (filters.area) searchParams.set("area", filters.area);
  if (filters.ajgSubjectArea) searchParams.set("ajg_subject_area", filters.ajgSubjectArea);
  if (filters.scimagoAreas) searchParams.set("scimago_areas", filters.scimagoAreas);
  if (filters.scopusAreaId) searchParams.set("scopus_area_id", filters.scopusAreaId);
  if (filters.scopusAreaGroupId) searchParams.set("scopus_area_group_id", filters.scopusAreaGroupId);
  if (filters.majorGroupId) searchParams.set("major_group_id", filters.majorGroupId);
  if (filters.areaGroupId) searchParams.set("area_group_id", filters.areaGroupId);
  if (filters.publisher) searchParams.set("publisher", filters.publisher);
  if (filters.activeStatuses.length > 0) searchParams.set("active_status", filters.activeStatuses.join(","));
  if (filters.sourceTypes.length > 0) searchParams.set("source_type", filters.sourceTypes.join(","));
  if (filters.yearFrom) searchParams.set("year_from", filters.yearFrom);
  if (filters.yearTo) searchParams.set("year_to", filters.yearTo);

  searchParams.set("sort", state.sort);
  searchParams.set("order", state.order);
  searchParams.set("page", String(state.page));
  searchParams.set("limit", String(state.limit));

  const hasQueryOrFilters =
    state.query.length >= 1 ||
    filters.sources.length > 0 ||
    filters.abdcRatings.length > 0 ||
    filters.ajgRatings.length > 0 ||
    filters.sjrQuartiles.length > 0 ||
    filters.area !== "" ||
    filters.publisher !== "" ||
    filters.majorGroupId !== "" ||
    filters.areaGroupId !== "" ||
    filters.activeStatuses.length > 0;

  return useQuery<SearchResponse>({
    queryKey: ["journalSearch", searchParams.toString()],
    queryFn: () =>
      fetch(`/api/journals/search?${searchParams.toString()}`).then((r) => {
        if (!r.ok) throw new Error("Search failed");
        return r.json();
      }),
    enabled: hasQueryOrFilters,
    staleTime: 30 * 1000,
  });
}

export type { JournalSearchResult, SearchResponse };
