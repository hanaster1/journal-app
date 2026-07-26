"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { sourceConfig, CHART_COLORS } from "../lib/chart-config";
import { formatCount, horizontalBarHeight, truncateLabel } from "../lib/chart-sizing";
import { useCategoryAxis } from "../hooks/use-category-axis";

interface Props {
  data: { name: string; count: number }[];
}

export function TopAreaChart({ data }: Props) {
  const config = sourceConfig(data.map((d) => d.name));
  const axis = useCategoryAxis({ width: 230, chars: 44, fontSize: 13 });

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: horizontalBarHeight(data.length, 42) }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 64, bottom: 8, left: 8 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: axis.fontSize }} tickFormatter={formatCount} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: axis.fontSize }}
          tickFormatter={(value: string) => truncateLabel(value, axis.chars)}
          interval={0}
          width={axis.width}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="count"
          fill={CHART_COLORS.primary}
          radius={[0, 4, 4, 0]}
          maxBarSize={32}
        >
          <LabelList
            dataKey="count"
            position="right"
            className="fill-foreground"
            fontSize={12}
            formatter={formatCount}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
