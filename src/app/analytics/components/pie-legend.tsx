"use client";

import { CHART_COLORS } from "../lib/chart-config";

export const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
];

interface Props {
  items: { name: string; count: number }[];
  className?: string;
}

export function PieLegend({ items, className }: Props) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-4 py-1.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="h-3.5 w-3.5 shrink-0 rounded-sm"
              style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
            />
            <span className="truncate text-sm font-medium">{item.name}</span>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-sm font-semibold tabular-nums">
              {item.count.toLocaleString()}
            </span>
            <span className="ml-1.5 text-sm text-muted-foreground tabular-nums">
              {total > 0 ? `${((item.count / total) * 100).toFixed(1)}%` : "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
