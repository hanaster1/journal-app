"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { sourceConfig } from "../lib/chart-config";
import { PieLegend, PIE_COLORS } from "./pie-legend";
import {
  PIE_CHART_LABEL_MARGIN,
  PIE_LABEL_LINE_COLOR,
  renderPieSliceLabel,
} from "./pie-slice-label";

interface Props {
  byStatus: { status: string; count: number }[];
  bySourceType: { type: string; count: number }[];
}

export function ScopusStatusChart({ byStatus, bySourceType }: Props) {
  const panels = [
    {
      key: "status",
      label: "Active Status",
      items: byStatus.map((d) => ({ name: d.status, count: d.count })),
    },
    {
      key: "sourceType",
      label: "Source Type",
      items: bySourceType.map((d) => ({ name: d.type, count: d.count })),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {panels.map((panel) => (
        <div key={panel.key}>
          <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
            {panel.label}
          </p>
          <ChartContainer
            config={sourceConfig(panel.items.map((d) => d.name))}
            className="aspect-auto h-[380px] w-full"
          >
            <PieChart margin={PIE_CHART_LABEL_MARGIN}>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={panel.items}
                dataKey="count"
                nameKey="name"
                innerRadius={90}
                outerRadius={160}
                strokeWidth={2}
                stroke="#FFFFFF"
                label={renderPieSliceLabel}
                labelLine={{ stroke: PIE_LABEL_LINE_COLOR, strokeWidth: 1 }}
              >
                {panel.items.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <PieLegend items={panel.items} className="mt-4" />
        </div>
      ))}
    </div>
  );
}
