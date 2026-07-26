"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS, sourceConfig } from "../lib/chart-config";
import { formatCount } from "../lib/chart-sizing";

interface Props {
  data: {
    ABDC: { rating: string; count: number }[];
    AJG: { rating: string; count: number }[];
    Scimago: { rating: string; count: number }[];
  };
}

export function RankDistribution({ data }: Props) {
  const panels = [
    { key: "ABDC", label: "ABDC Rating", rows: data.ABDC, color: CHART_COLORS.primary },
    { key: "AJG", label: "AJG Rating", rows: data.AJG, color: CHART_COLORS.secondary },
    {
      key: "Scimago",
      label: "Scimago Quartile",
      rows: data.Scimago,
      color: CHART_COLORS.tertiary,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {panels.map((panel) => (
        <div key={panel.key}>
          <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
            {panel.label}
          </p>
          <ChartContainer
            config={sourceConfig([panel.key])}
            className="aspect-auto h-[380px] w-full"
          >
            <BarChart data={panel.rows} margin={{ top: 24, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="rating" tick={{ fontSize: 13 }} interval={0} />
              <YAxis tick={{ fontSize: 13 }} tickFormatter={formatCount} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="count"
                fill={panel.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={64}
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                  formatter={formatCount}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      ))}
    </div>
  );
}
