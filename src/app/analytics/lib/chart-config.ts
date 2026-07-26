import type { ChartConfig } from "@/components/ui/chart";

export const CHART_COLORS = {
  primary: "#5B3B8C",
  secondary: "#7C5CBF",
  tertiary: "#9B7FD4",
  quaternary: "#BBA8E3",
  quinary: "#D6CFE0",
} as const;

export const monoConfig: ChartConfig = {
  primary: { label: "Primary", color: CHART_COLORS.primary },
  secondary: { label: "Secondary", color: CHART_COLORS.secondary },
  tertiary: { label: "Tertiary", color: CHART_COLORS.tertiary },
  quaternary: { label: "Quaternary", color: CHART_COLORS.quaternary },
  quinary: { label: "Quinary", color: CHART_COLORS.quinary },
};

export function sourceConfig(keys: string[]): ChartConfig {
  const colorKeys = Object.keys(CHART_COLORS) as (keyof typeof CHART_COLORS)[];
  const config: ChartConfig = {};
  keys.forEach((key, i) => {
    config[key] = { label: key, color: CHART_COLORS[colorKeys[i % colorKeys.length]] };
  });
  return config;
}
