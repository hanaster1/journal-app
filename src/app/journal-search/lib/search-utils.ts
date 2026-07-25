export const SORT_OPTIONS = [
  { value: "title", label: "Title (A–Z)", order: "asc" },
  { value: "title_desc", label: "Title (Z–A)", order: "desc" },
  { value: "publisher", label: "Publisher (A–Z)", order: "asc" },
  { value: "year", label: "Year (Newest)", order: "desc" },
] as const;

export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

export function getRatingBadgeTier(system: "abdc" | "ajg" | "sjr", value: string): number {
  if (system === "abdc") {
    switch (value) {
      case "A*": return 2;
      case "A": return 3;
      case "B": return 4;
      case "C": return 5;
      default: return 5;
    }
  }
  if (system === "ajg") {
    switch (value) {
      case "4*": return 1;
      case "4": return 2;
      case "3": return 3;
      case "2": return 4;
      case "1": return 5;
      default: return 5;
    }
  }
  if (system === "sjr") {
    switch (value) {
      case "Q1": return 2;
      case "Q2": return 3;
      case "Q3": return 4;
      case "Q4": return 5;
      default: return 5;
    }
  }
  return 5;
}
