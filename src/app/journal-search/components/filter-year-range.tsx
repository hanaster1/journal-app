"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const [localFrom, setLocalFrom] = useState(yearFrom);
  const [localTo, setLocalTo] = useState(yearTo);

  const clamp = useCallback(
    (val: string, lo: number, hi: number): string => {
      const n = parseInt(val);
      if (isNaN(n)) return "";
      return Math.max(lo, Math.min(hi, n)).toString();
    },
    []
  );

  const handleFromBlur = () => {
    const clamped = clamp(localFrom, min, max);
    const fromVal = clamped || yearFrom;
    setLocalFrom(fromVal);
    onChange(fromVal, yearTo);
  };

  const handleToBlur = () => {
    const clamped = clamp(localTo, min, max);
    const toVal = clamped || yearTo;
    setLocalTo(toVal);
    onChange(yearFrom, toVal);
  };

  const handleFromChange = (val: string) => {
    setLocalFrom(val);
    if (val === "") {
      onChange("", yearTo);
    }
  };

  const handleToChange = (val: string) => {
    setLocalTo(val);
    if (val === "") {
      onChange(yearFrom, "");
    }
  };

  const isFromInvalid =
    localFrom !== "" &&
    !isNaN(parseInt(localFrom)) &&
    (parseInt(localFrom) < min || parseInt(localFrom) > max);

  const isToInvalid =
    localTo !== "" &&
    !isNaN(parseInt(localTo)) &&
    (parseInt(localTo) < min || parseInt(localTo) > max);

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">From Year</Label>
        <Input
          type="number"
          placeholder={`Min: ${min}`}
          value={localFrom}
          onChange={(e) => handleFromChange(e.target.value)}
          onBlur={handleFromBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFromBlur();
          }}
          min={min}
          max={max}
          aria-invalid={isFromInvalid}
          className={isFromInvalid ? "border-destructive" : ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">To Year</Label>
        <Input
          type="number"
          placeholder={`Max: ${max}`}
          value={localTo}
          onChange={(e) => handleToChange(e.target.value)}
          onBlur={handleToBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleToBlur();
          }}
          min={min}
          max={max}
          aria-invalid={isToInvalid}
          className={isToInvalid ? "border-destructive" : ""}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 text-xs"
          onClick={() => {
            const from = (currentYear - 5).toString();
            const to = currentYear.toString();
            setLocalFrom(from);
            setLocalTo(to);
            onChange(from, to);
          }}
        >
          Last 5 yrs
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 text-xs"
          onClick={() => {
            const from = (currentYear - 10).toString();
            const to = currentYear.toString();
            setLocalFrom(from);
            setLocalTo(to);
            onChange(from, to);
          }}
        >
          Last 10 yrs
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => {
            setLocalFrom("");
            setLocalTo("");
            onChange("", "");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
