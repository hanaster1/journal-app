import { useQuery } from "@tanstack/react-query";

export function useJournalDetail(id: number | null) {
  return useQuery({
    queryKey: ["journalDetail", id],
    queryFn: () => fetch(`/api/journal/${id}`).then((r) => r.json()),
    enabled: id !== null,
  });
}
