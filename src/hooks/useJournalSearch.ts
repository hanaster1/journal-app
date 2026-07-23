import { useQuery } from "@tanstack/react-query";

interface SearchParams {
  q: string;
  source?: string;
  rating?: string;
  area?: string;
  page?: number;
  limit?: number;
}

export function useJournalSearch(params: SearchParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("q", params.q);
  if (params.source) searchParams.set("source", params.source);
  if (params.rating) searchParams.set("rating", params.rating);
  if (params.area) searchParams.set("area", params.area);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["journalSearch", params],
    queryFn: () =>
      fetch(`/api/journals/search?${searchParams.toString()}`).then((r) =>
        r.json()
      ),
    enabled: params.q.length >= 2,
  });
}
