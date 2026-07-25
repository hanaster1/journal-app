"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterYearRangeProps {
  min: number;
  max: number;
  yearFrom: string;
  yearTo: string;
  onChange: (from: string, to: string) => void;
}

export function FilterYearRange({
  min,
  max,
  yearFrom,
  yearTo,
  onChange,
}: FilterYearRangeProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">From Year</Label>
        <Input
          type="number"
          placeholder={`Min: ${min}`}
          value={yearFrom}
          onChange={(e) => onChange(e.target.value, yearTo)}
          min={min}
          max={max}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">To Year</Label>
        <Input
          type="number"
          placeholder={`Max: ${max}`}
          value={yearTo}
          onChange={(e) => onChange(yearFrom, e.target.value)}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}
