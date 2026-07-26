"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { SORT_OPTIONS } from "../lib/search-utils";

interface SortControlsProps {
  sort: string;
  order: string;
  onSortChange: (sort: string, order: string) => void;
}

export function SortControls({ sort, order, onSortChange }: SortControlsProps) {
  const currentValue = sort === "title" && order === "desc" ? "title_desc" : sort;

  const handleChange = (value: string | null) => {
    if (!value) return;
    
    const option = SORT_OPTIONS.find((o) => o.value === value);
    if (option) {
      if (value === "title_desc") {
        onSortChange("title", "desc");
      } else {
        onSortChange(value, option.order);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium whitespace-nowrap">Sort by:</Label>
      <Combobox value={currentValue} onValueChange={handleChange}>
        <ComboboxInput placeholder="Sort by..." className="w-[200px] bg-card" />
        <ComboboxContent>
          <ComboboxList>
            {SORT_OPTIONS.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No sort option found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
