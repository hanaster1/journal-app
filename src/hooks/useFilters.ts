import { useQuery } from "@tanstack/react-query";

export function useFilters() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: () => fetch("/api/filters").then((r) => r.json()),
  });
}
