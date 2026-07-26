"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Legend, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import { CHART_COLORS, sourceConfig } from "../lib/chart-config";
import { formatCount, truncateLabel } from "../lib/chart-sizing";

interface Props {
  data: {
    name: string;
    ABDC: number;
    AJG: number;
    Scimago: number;
    Scopus: number;
  }[];
}

function segmentLabel(value: number) {
  return value > 0 ? formatCount(value) : "";
}

export function DbCoverageChart({ data }: Props) {
  const config = sourceConfig(["ABDC", "AJG", "Scimago", "Scopus"]);

  return (
    <ChartContainer config={config} className="aspect-auto h-[480px] w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 80, left: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 13 }}
          tickFormatter={(value: string) => truncateLabel(value, 28)}
          angle={-30}
          textAnchor="end"
          interval={0}
          height={90}
        />
        <YAxis tick={{ fontSize: 13 }} tickFormatter={formatCount} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey="ABDC" stackId="coverage" fill={CHART_COLORS.primary} maxBarSize={80}>
          <LabelList
            dataKey="ABDC"
            position="center"
            fill="#FFFFFF"
            fontSize={11}
            fontWeight={600}
            formatter={segmentLabel}
          />
        </Bar>
        <Bar dataKey="AJG" stackId="coverage" fill={CHART_COLORS.secondary} maxBarSize={80}>
          <LabelList
            dataKey="AJG"
            position="center"
            fill="#FFFFFF"
            fontSize={11}
            fontWeight={600}
            formatter={segmentLabel}
          />
        </Bar>
        <Bar dataKey="Scimago" stackId="coverage" fill={CHART_COLORS.tertiary} maxBarSize={80}>
          <LabelList
            dataKey="Scimago"
            position="center"
            fill="#FFFFFF"
            fontSize={11}
            fontWeight={600}
            formatter={segmentLabel}
          />
        </Bar>
        <Bar dataKey="Scopus" stackId="coverage" fill={CHART_COLORS.quaternary} maxBarSize={80}>
          <LabelList
            dataKey="Scopus"
            position="center"
            fill="#FFFFFF"
            fontSize={11}
            fontWeight={600}
            formatter={segmentLabel}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
