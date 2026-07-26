const MIN_CHART_HEIGHT = 320;

// Axis + margin allowance on top of the space the bars themselves need.
const AXIS_ALLOWANCE = 64;

export function horizontalBarHeight(rows: number, rowHeight = 36) {
  return Math.max(MIN_CHART_HEIGHT, rows * rowHeight + AXIS_ALLOWANCE);
}

export function truncateLabel(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}\u2026` : value;
}

export function formatCount(value: number | string) {
  return typeof value === "number" ? value.toLocaleString() : String(value);
}
