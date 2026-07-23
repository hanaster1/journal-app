import { useQuery } from "@tanstack/react-query";

interface JournalsParams {
  area?: string;
  group?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useJournals(params: JournalsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.area) searchParams.set("area", params.area);
  if (params.group) searchParams.set("group", params.group);
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["journals", params],
    queryFn: () =>
      fetch(`/api/journals?${searchParams.toString()}`).then((r) => r.json()),
  });
}
