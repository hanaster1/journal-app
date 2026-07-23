import { useQuery } from "@tanstack/react-query";

export function useAreas() {
  return useQuery({
    queryKey: ["areas"],
    queryFn: () => fetch("/api/areas").then((r) => r.json()),
  });
}
