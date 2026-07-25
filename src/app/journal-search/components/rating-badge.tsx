"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRatingBadgeTier } from "../lib/search-utils";

const tierStyles: Record<number, string> = {
  1: "bg-primary/10 text-primary border-primary/20",
  2: "bg-indigo-50 text-indigo-700 border-indigo-200",
  3: "bg-slate-50 text-slate-600 border-slate-200",
  4: "bg-stone-50 text-stone-500 border-stone-200",
  5: "bg-zinc-50 text-zinc-400 border-zinc-200",
};

interface RatingBadgeProps {
  system: "abdc" | "ajg" | "sjr";
  value: string;
  className?: string;
}

const systemLabels: Record<string, string> = {
  abdc: "ABDC",
  ajg: "AJG",
  sjr: "SJR",
};

export function RatingBadge({ system, value, className }: RatingBadgeProps) {
  const tier = getRatingBadgeTier(system, value);

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        tierStyles[tier],
        className
      )}
    >
      {systemLabels[system]} {value}
    </Badge>
  );
}
