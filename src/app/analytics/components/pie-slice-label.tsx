import { formatCount } from "../lib/chart-sizing";

const RADIAN = Math.PI / 180;

export const PIE_LABEL_COLOR = "#2D2A3D";
export const PIE_LABEL_LINE_COLOR = "#6B6580";
export const PIE_CHART_LABEL_MARGIN = {
  top: 24,
  right: 56,
  bottom: 24,
  left: 56,
} as const;

export function renderPieSliceLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  value,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  value?: number | string;
}) {
  const count = typeof value === "number" ? value : Number(value);
  if (!count) return null;

  const labelRadius = outerRadius + 28;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={PIE_LABEL_COLOR}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {formatCount(count)}
    </text>
  );
}
