import { useQuery } from "@tanstack/react-query";

interface JournalAreasParams {
  majorGroup?: string;
  areaGroup?: string;
  area?: string;
  source?: string;
  rank?: string;
  page?: number;
  limit?: number;
}

export function useJournalAreas(params: JournalAreasParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.majorGroup) searchParams.set("majorGroup", params.majorGroup);
  if (params.areaGroup) searchParams.set("areaGroup", params.areaGroup);
  if (params.area) searchParams.set("area", params.area);
  if (params.source) searchParams.set("source", params.source);
  if (params.rank) searchParams.set("rank", params.rank);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["journalAreas", params],
    queryFn: () =>
      fetch(`/api/journal-areas?${searchParams.toString()}`).then((r) => r.json()),
  });
}
