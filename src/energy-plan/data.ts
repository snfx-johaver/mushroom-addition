import type { HomeAssistant } from "../types";
import { clipIntervals, numeric, parseIntervals, readPath, timestamp } from "../energy-cards/data";
import type { TimeInterval } from "../energy-cards/types";
import type { PlanMetric, PlanRow } from "./config";

export interface RowData {
  intervals: TimeInterval[];
  error?: "Source missing" | "Invalid data source or field mapping" | "No published intervals" | "Stale data source";
}

export function rowData(hass: HomeAssistant | undefined, row: PlanRow, entityId: string | undefined, start: number, end: number, maxAgeMinutes = 60): RowData {
  const entity = hass?.states[row.entity || entityId || ""];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) return { intervals: [], error: "Source missing" };
  const updated = timestamp(entity.last_updated);
  if (updated === undefined || Date.now() - updated > maxAgeMinutes * 60000 || updated > Date.now() + 60000) return { intervals: [], error: "Stale data source" };
  let root: unknown = entity.attributes;
  if (row.adapter === "state") {
    try { root = JSON.parse(entity.state); }
    catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      return { intervals: [], error: "Invalid data source or field mapping" };
    }
  }
  const list = readPath(root, row.path);
  if (!Array.isArray(list)) return { intervals: [], error: "Invalid data source or field mapping" };
  if (!list.length) return { intervals: [], error: "No published intervals" };
  const intervals = parseIntervals(entity, row, row.valueField, root).sort((a, b) => a.start - b.start);
  if (intervals.length !== list.length || intervals.some((item, index) =>
    index > 0 && item.start < intervals[index - 1].end ||
    row.kind === "soc" && (item.value < 0 || item.value > 100))) {
    return { intervals: [], error: "Invalid data source or field mapping" };
  }
  const visible = clipIntervals(intervals, start, end);
  return visible.length ? { intervals: visible } : { intervals: [], error: "No published intervals" };
}

export function metricValue(hass: HomeAssistant | undefined, metric: PlanMetric, maxAgeMinutes = 60): number | undefined {
  const entity = hass?.states[metric.entity || ""];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) return undefined;
  const updated = timestamp(entity.last_updated);
  if (updated === undefined || Date.now() - updated > maxAgeMinutes * 60000 || updated > Date.now() + 60000) return undefined;
  return numeric(metric.field ? readPath(entity.attributes, metric.field) : entity.state);
}

export function intervalLabel(row: PlanRow, item: TimeInterval): string {
  const status = row.statusField ? readPath(item.source, row.statusField) : undefined;
  if (typeof status === "string" && status.trim()) return status;
  return item.value > 0 ? row.positiveLabel : item.value < 0 ? row.negativeLabel : row.zeroLabel;
}

export function displayIntervals(row: PlanRow, intervals: TimeInterval[]): Array<TimeInterval & { minimum: number; maximum: number }> {
  const result: Array<TimeInterval & { minimum: number; maximum: number }> = [];
  for (const item of intervals) {
    const previous = result.at(-1);
    const same = previous && previous.end === item.start && (
      row.kind === "price" && previous.value === item.value ||
      row.kind === "schedule" && Math.sign(previous.value) === Math.sign(item.value) && intervalLabel(row, previous) === intervalLabel(row, item)
    );
    if (same && previous) {
      previous.end = item.end;
      previous.minimum = Math.min(previous.minimum, item.value);
      previous.maximum = Math.max(previous.maximum, item.value);
    } else result.push({ ...item, minimum: item.value, maximum: item.value });
  }
  return result;
}

export function displayPriceIntervals(row: PlanRow, intervals: TimeInterval[]): Array<TimeInterval & { minimum: number; maximum: number }> {
  const result: Array<TimeInterval & { minimum: number; maximum: number }> = [];
  for (const item of intervals) {
    const previous = result.at(-1);
    const band = (value: number) => value <= row.low ? "low" : value >= row.high ? "high" : "middle";
    if (previous && previous.end === item.start && band(previous.value) === band(item.value)) {
      previous.end = item.end;
      previous.minimum = Math.min(previous.minimum, item.value);
      previous.maximum = Math.max(previous.maximum, item.value);
    } else result.push({ ...item, minimum: item.value, maximum: item.value });
  }
  return result;
}

export function displayPowerScale(row: PlanRow, intervals: TimeInterval[]): number {
  if (row.id !== "solar" || row.kind !== "power") return row.scale;
  const maximum = intervals.reduce((value, item) => Math.max(value, Math.abs(item.value)), 0);
  return maximum > 0 ? maximum : row.scale;
}

export function rowCoverage(data: RowData, start: number, end: number): number {
  if (end <= start || data.error) return 0;
  return data.intervals.reduce((sum, item) => sum + Math.max(0, Math.min(end, item.end) - Math.max(start, item.start)), 0) / (end - start);
}
