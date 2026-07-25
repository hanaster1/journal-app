"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface SearchFilters {
  sources: string[];
  abdcRatings: string[];
  ajgRatings: string[];
  sjrQuartiles: string[];
  area: string;
  ajgSubjectArea: string;
  scimagoAreas: string;
  scopusAreaId: string;
  scopusAreaGroupId: string;
  majorGroupId: string;
  areaGroupId: string;
  publisher: string;
  activeStatuses: string[];
  sourceTypes: string[];
  yearFrom: string;
  yearTo: string;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: string;
  order: string;
  page: number;
  limit: number;
  view: "cards" | "table";
}

const DEFAULT_FILTERS: SearchFilters = {
  sources: [],
  abdcRatings: [],
  ajgRatings: [],
  sjrQuartiles: [],
  area: "",
  ajgSubjectArea: "",
  scimagoAreas: "",
  scopusAreaId: "",
  scopusAreaGroupId: "",
  majorGroupId: "",
  areaGroupId: "",
  publisher: "",
  activeStatuses: [],
  sourceTypes: [],
  yearFrom: "",
  yearTo: "",
};

const DEFAULT_STATE: SearchState = {
  query: "",
  filters: DEFAULT_FILTERS,
  sort: "title",
  order: "asc",
  page: 1,
  limit: 20,
  view: "table",
};

function parseArrayParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseStateFromSearchParams(searchParams: URLSearchParams): SearchState {
  return {
    query: searchParams.get("q") ?? DEFAULT_STATE.query,
    filters: {
      sources: parseArrayParam(searchParams.get("source")),
      abdcRatings: parseArrayParam(searchParams.get("abdc_rating")),
      ajgRatings: parseArrayParam(searchParams.get("ajg_rating")),
      sjrQuartiles: parseArrayParam(searchParams.get("sjr_quartile")),
      area: searchParams.get("area") ?? "",
      ajgSubjectArea: searchParams.get("ajg_subject_area") ?? "",
      scimagoAreas: searchParams.get("scimago_areas") ?? "",
      scopusAreaId: searchParams.get("scopus_area_id") ?? "",
      scopusAreaGroupId: searchParams.get("scopus_area_group_id") ?? "",
      majorGroupId: searchParams.get("major_group_id") ?? "",
      areaGroupId: searchParams.get("area_group_id") ?? "",
      publisher: searchParams.get("publisher") ?? "",
      activeStatuses: parseArrayParam(searchParams.get("active_status")),
      sourceTypes: parseArrayParam(searchParams.get("source_type")),
      yearFrom: searchParams.get("year_from") ?? "",
      yearTo: searchParams.get("year_to") ?? "",
    },
    sort: searchParams.get("sort") ?? DEFAULT_STATE.sort,
    order: searchParams.get("order") ?? DEFAULT_STATE.order,
    page: Number(searchParams.get("page")) || DEFAULT_STATE.page,
    limit: Number(searchParams.get("limit")) || DEFAULT_STATE.limit,
    view: (searchParams.get("view") as "cards" | "table") ?? DEFAULT_STATE.view,
  };
}

export function useSearchState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(() => parseStateFromSearchParams(searchParams), [searchParams]);

  const updateState = useCallback(
    (updates: Partial<SearchState> | ((prev: SearchState) => Partial<SearchState>)) => {
      const current = parseStateFromSearchParams(searchParams);
      const partial = typeof updates === "function" ? updates(current) : updates;

      const newState = { ...current, ...partial };
      if (partial.filters) {
        newState.filters = { ...current.filters, ...partial.filters };
      }

      const params = new URLSearchParams();

      if (newState.query) params.set("q", newState.query);

      const { filters } = newState;
      if (filters.sources.length > 0) params.set("source", filters.sources.join(","));
      if (filters.abdcRatings.length > 0) params.set("abdc_rating", filters.abdcRatings.join(","));
      if (filters.ajgRatings.length > 0) params.set("ajg_rating", filters.ajgRatings.join(","));
      if (filters.sjrQuartiles.length > 0) params.set("sjr_quartile", filters.sjrQuartiles.join(","));
      if (filters.area) params.set("area", filters.area);
      if (filters.ajgSubjectArea) params.set("ajg_subject_area", filters.ajgSubjectArea);
      if (filters.scimagoAreas) params.set("scimago_areas", filters.scimagoAreas);
      if (filters.scopusAreaId) params.set("scopus_area_id", filters.scopusAreaId);
      if (filters.scopusAreaGroupId) params.set("scopus_area_group_id", filters.scopusAreaGroupId);
      if (filters.majorGroupId) params.set("major_group_id", filters.majorGroupId);
      if (filters.areaGroupId) params.set("area_group_id", filters.areaGroupId);
      if (filters.publisher) params.set("publisher", filters.publisher);
      if (filters.activeStatuses.length > 0) params.set("active_status", filters.activeStatuses.join(","));
      if (filters.sourceTypes.length > 0) params.set("source_type", filters.sourceTypes.join(","));
      if (filters.yearFrom) params.set("year_from", filters.yearFrom);
      if (filters.yearTo) params.set("year_to", filters.yearTo);

      if (newState.sort !== DEFAULT_STATE.sort) params.set("sort", newState.sort);
      if (newState.order !== DEFAULT_STATE.order) params.set("order", newState.order);
      if (newState.page !== DEFAULT_STATE.page) params.set("page", String(newState.page));
      if (newState.limit !== DEFAULT_STATE.limit) params.set("limit", String(newState.limit));
      if (newState.view !== DEFAULT_STATE.view) params.set("view", newState.view);

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const setQuery = useCallback(
    (query: string) => {
      updateState({ query, page: 1 });
    },
    [updateState]
  );

  const setFilters = useCallback(
    (filters: Partial<SearchFilters>) => {
      updateState({ filters, page: 1 } as Partial<SearchState>);
    },
    [updateState]
  );

  const setSort = useCallback(
    (sort: string, order: string) => {
      updateState({ sort, order, page: 1 });
    },
    [updateState]
  );

  const setPage = useCallback(
    (page: number) => {
      updateState({ page });
    },
    [updateState]
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateState({ limit, page: 1 });
    },
    [updateState]
  );

  const setView = useCallback(
    (view: "cards" | "table") => {
      updateState({ view });
    },
    [updateState]
  );

  const resetFilters = useCallback(() => {
    updateState({ filters: DEFAULT_FILTERS, page: 1 } as Partial<SearchState>);
  }, [updateState]);

  const hasActiveFilters = useMemo(() => {
    const { filters } = state;
    return (
      filters.sources.length > 0 ||
      filters.abdcRatings.length > 0 ||
      filters.ajgRatings.length > 0 ||
      filters.sjrQuartiles.length > 0 ||
      filters.area !== "" ||
      filters.ajgSubjectArea !== "" ||
      filters.scimagoAreas !== "" ||
      filters.scopusAreaId !== "" ||
      filters.scopusAreaGroupId !== "" ||
      filters.majorGroupId !== "" ||
      filters.areaGroupId !== "" ||
      filters.publisher !== "" ||
      filters.activeStatuses.length > 0 ||
      filters.sourceTypes.length > 0 ||
      filters.yearFrom !== "" ||
      filters.yearTo !== ""
    );
  }, [state]);

  const activeFilterCount = useMemo(() => {
    const { filters } = state;
    let count = 0;
    if (filters.sources.length > 0) count++;
    if (filters.abdcRatings.length > 0) count++;
    if (filters.ajgRatings.length > 0) count++;
    if (filters.sjrQuartiles.length > 0) count++;
    if (filters.area) count++;
    if (filters.ajgSubjectArea) count++;
    if (filters.scimagoAreas) count++;
    if (filters.scopusAreaId) count++;
    if (filters.scopusAreaGroupId) count++;
    if (filters.majorGroupId) count++;
    if (filters.areaGroupId) count++;
    if (filters.publisher) count++;
    if (filters.activeStatuses.length > 0) count++;
    if (filters.sourceTypes.length > 0) count++;
    if (filters.yearFrom || filters.yearTo) count++;
    return count;
  }, [state]);

  return {
    state,
    setQuery,
    setFilters,
    setSort,
    setPage,
    setLimit,
    setView,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
