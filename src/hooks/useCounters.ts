import { useQuery } from "@tanstack/react-query";

export function useCounters() {
  return useQuery({
    queryKey: ["counters"],
    queryFn: () => fetch("/api/journals/counters").then((r) => r.json()),
  });
}
