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
  data: { name: string; count: number }[];
}

export function SourceDistribution({ data }: Props) {
  const config = sourceConfig(data.map((d) => d.name));

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-16">
      <ChartContainer
        config={config}
        className="aspect-auto h-[420px] w-full max-w-[440px]"
      >
        <PieChart margin={PIE_CHART_LABEL_MARGIN}>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            innerRadius={100}
            outerRadius={175}
            strokeWidth={2}
            stroke="#FFFFFF"
            label={renderPieSliceLabel}
            labelLine={{ stroke: PIE_LABEL_LINE_COLOR, strokeWidth: 1 }}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <PieLegend items={data} className="w-full max-w-[340px]" />
    </div>
  );
}
